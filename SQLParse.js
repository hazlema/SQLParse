// Simple SQL(ish) processor
// doesn't handle nested brackets and only supports Select, Where and OrderBy
let SQLParse = function(queryString) {
    if (queryString) this.query = queryString;

    this.hasQuery   = function() { return this.Query                 != ""; }
    this.hasSelect  = function() { return this.Parsed.Select.length  != 0;  }
    this.hasWhere   = function() { return this.Parsed.Where.length   != 0;  }
    this.hasOrderBy = function() { return this.Parsed.OrderBy.length != 0;  }
    
    this.get        = function() { return this.Parsed;         }
    this.getSelect  = function() { return this.Parsed.Select;  }
    this.getWhere   = function() { return this.Parsed.Where;   }
    this.getOrderBy = function() { return this.Parsed.OrderBy; }
    
    this.renderTree = function() { return JSON.stringify(this.Parsed, null, 5) }  
}

// Changing the query property will repopulate the tree
Object.defineProperty(SQLParse.prototype, "query", {
    get() {
        return this.Query; 
    },
    set(query) {
        this.Query       = preParse(query);
        this.Parsed      = parse(this.Query);
        this.filterWhere = buildWhere(this.Parsed.Where);
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

function buildWhere(where) {
    let fn    = 'return ';
    let regex = /^[\/].*[\/ig]$/;
    let trans = {'=':'==', and:'&&', or:'||'}

    function translate(ele) { return trans[ele] ? trans[ele] : ele; }

    where.forEach(ele => {
        if (typeof ele != 'object') fn += `${translate(ele)} `
        else if (regex.exec(ele[2])) {
            if (ele[1] == '!=') fn += `(data['${ele[0]}'].match(${ele[2]}) == null) `;
            else fn += `data['${ele[0]}'].match(${ele[2]}) `;
        } else fn += `data['${ele[0]}']${translate(ele[1])}${ele[2]} `;
    });

    return new Function("data", fn);
}

module.exports = SQLParse;