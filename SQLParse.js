/**
 * Simple SQL(ish) processor
 * Supports: Select, Where, OrderBy, Parentheses
 *           Regular Expression queries
 *           Strings and Numbers
 *********************************************************/
let SQLParse = function(queryString) {
    if (queryString) this.query = queryString;

 /* this.query       = Assigned in the defineProperty for query */

    this.hasQuery    = function()   { return this.Query                 != ""; }
    this.hasSelect   = function()   { return this.Parsed.Select.length  != 0;  }
    this.hasWhere    = function()   { return this.Parsed.Where.length   != 0;  }
    this.hasOrderBy  = function()   { return this.Parsed.OrderBy.length != 0;  }
    
    this.get         = function()   { return this.Parsed;         }
    this.getSelect   = function()   { return this.Parsed.Select;  }
    this.getWhere    = function()   { return this.Parsed.Where;   }
    this.getOrderBy  = function()   { return this.Parsed.OrderBy; }
    
 /* this.isWhere = Assigned in the defineProperty for query */
    this.renderTree  = function()   { return JSON.stringify(this.Parsed, null, 5) }  

    this.where       = function(db) { return Where(this.isWhere, db)       };
    this.sort        = function(db) { return Sort(this.Parsed.OrderBy, db) };
}

// Changing the query property will repopulate the tree
Object.defineProperty(SQLParse.prototype, "query", {
    get() {
        return this.Query; 
    },
    set(query) {
        this.Query   = preParse(query);
        this.Parsed  = parse(this.Query);
        this.isWhere = buildWhere(this.Parsed.Where);
    }
});

/======================================================================/

/*
 * Function: preParse
 * Purpose:  Fix spacing - 'this = that' becomes 'this=that'
 * Params:   str(string) - The string to fix
 * Returns:  string
 ****************************************************************/
function preParse(str) {
    const regex = /\s+([=!<>]+)\s+/g;
    let m, search;

    while ((m = regex.exec(str)) !== null) {
        m.forEach((match, idx) => {
            if (idx == 0) search = match;
            if (idx == 1) str = str.replace(search, match);
        });
    }
    return str;    
}

/**
 * Function: keyValueSplit
 * Purpose:  Split a string into [key, separator, value]
 * Params:   str(string) - The string to parse
 * Returns:  [key, separator, value] || string
 *           - string will be returned if there is no splitting
 ****************************************************************/
 function keyValueSplit(str) {
    const regex = /(?:([\w\d\s\(\)\'\"]+)([\>\=\<\!]+)(.*))/;
    
    if ((matched = regex.exec(str)) !== null) {
        let results=[];

        matched.forEach((match, groupIndex) => {
            if (groupIndex >= 1) results.push(match);
        });
        return results;
    } else return str;
}

/**
 * Function: parenSplit
 * Purpose:  Split a string to respect parenthesis
 * Params:   element(string) - The element to parse
 * Returns:  []
 ****************************************************************/
 function parenSplit(element) {
    const regex  = /^([\(]+)?(.*[^\)])([\)]+)?$/g;

    let results = [];

    if ((matches = regex.exec(element)) !== null) {
        matches.forEach((match, groupIndex) => {
            if (groupIndex >= 1) {
                if (match && (match.indexOf('(')) != -1) results.push(match)
                else if (match && (match.indexOf(')')) != -1) results.push(match)
                else if (match) results.push(keyValueSplit(match))
            };
        });
    }
    return results;
}

/**
 * Function: parse
 * Purpose:  Split a SQL(ish) string into an object
 * Params:   query(string) - The string to parse
 * Returns:  object
 ****************************************************************/
 function parse(query) {
    const regex  = /([^\s\"',]+|\"([^\"]*)\"|'([^']*)')+/g;
    const keys   = /^select$|^where$|^orderby$/i;
    const orders = /^asc$|^desc$/i;
    const parens = /^(\(+)|(\)+)$/g;

    let Segments = {Select: [], Where: [], OrderBy: []};
    let key      = null;

    while ((matches = regex.exec(query)) !== null) {
        let matched = matches[0];

        if (keys.exec(matched)) {
            if (matched.toLowerCase() == "select")  key = "Select"
            if (matched.toLowerCase() == "where")   key = "Where"
            if (matched.toLowerCase() == "orderby") key = "OrderBy"
        } else if (key) {
            if (key == 'OrderBy' && orders.exec(matched)) {
                let index = Segments[key].length - 1;                
                Segments[key][index] = [Segments[key][index], matched];
            } else if (key == 'Where' && parens.exec(matched)) {
                parenSplit(matched).forEach(x => Segments[key].push(x));
            } else {
                Segments[key].push(keyValueSplit(matched))
            }
        }
    }
    return Segments;
}

/======================================================================/

/**
 * Function: buildWhere
 * Purpose:  Build a fn that will test against the where statement
 * Params:   where(array) - The parsed where statement
 * Returns:  fn
 ****************************************************************/
 function buildWhere(where) {
    let fn    = '';
    let regex = /^[\/].*[\/ig]$/;
    let trans = {'=':'==', and:'&&', or:'||'}

    function translate(ele) { return trans[ele] ? trans[ele] : ele; }

    where.forEach(ele => {
        if (typeof ele != 'object') fn += `${translate(ele)} `
        else if (regex.exec(ele[2])) {
            if (ele[1] == '!=') fn += `(isNull(data['${ele[0]}']).match(${ele[2]}) == null) `;
            else fn += `(isNull(data['${ele[0]}']).match(${ele[2]}) != null) `;
        } else fn += `data['${ele[0]}']${translate(ele[1])}${ele[2]} `;
    });

    return new Function("data", `
        function isNull(ele) { return ele ? ele : '' }
        return (${fn})
    `);
}

function Where(whereFn, data) {
    rows = [];

    data.forEach(row => {
        if (whereFn(row) == true) rows.push(row);
    })

    return rows;
}

/**
 * Function: customSort
 * Purpose:  Sort data using the parsed SQL
 * Params:   OrderBy(multi) - The parsed OrderBy statement
 *           data(object)   - Data to sort
 * Returns:  object
 ****************************************************************/
 function Sort(groups, data) {
    function isNumber(n)      { return !isNaN(parseFloat(n)) && isFinite(n); }
    function isNull(obj, def) { return obj ? obj : def;                      }
    
    function getSchema(data)  {
        let Schema = {};

        // Get info
        data.forEach(row => {
            Object.keys(row).forEach(col => {
                if (!Schema.hasOwnProperty(col)) 
                    Schema[col] = {string:0, number:0};
                
                if (isNumber(row[col])) Schema[col].number += 1;
                else Schema[col].string += 1;
            });
        });

        // Set types
        Object.keys(Schema).forEach(key => {
            if ((Schema[key].number != 0) && (Schema[key].string != 0)) {
                console.log(`!WARNING!: Database column '${key}' has multiple types, assuming string`)
                Schema[key]['type'] = "isString";
            } else Schema[key]['type'] = Schema[key].number != 0 ? "isNumber" : "isString";
        });

        return Schema;
    }

    /=========================================================================/

    let schema = getSchema(data);

    // Check groups for errors 
    if (!Array.isArray(groups)) groups = [[groups, "desc"]];
    else groups = groups.map(group => { 
        if (Array.isArray(group) == false) return [group, "desc"]
        if (group.length == 1) group.push("desc") 
        return group;
    });
    
    data.sort(function (a, b) {
        let group = [];

        groups.forEach(key => {
            let isCol = key[0];
            let isRev = (key[1] == "asc") ? true : false;

            //console.log(key, isCol);
            if (schema[isCol].type == "isNumber") {
                let col1 = a[isCol] ? Number(a[isCol]) : -90000000;
                let col2 = b[isCol] ? Number(b[isCol]) : -90000000;
                
                if (isRev) group.push(col1 - col2);
                else group.push(col2 - col1);
            } else {
                let col1 = a[isCol] ? a[isCol].toString().toLowerCase() : "";
                let col2 = b[isCol] ? b[isCol].toString().toLowerCase() : "";

                if (isRev) group.push(col1.localeCompare(col2));
                else group.push(col2.localeCompare(col1));
            }
        });

        return eval(group.join(' || '));
    });

    return data;
}

module.exports = SQLParse;