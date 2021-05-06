var db = [
        { name: "Matthew", color:  "red",         num: 90 },
        { name: "fraNK",   color:  "red",         num: 8 },
        { name: "Molly",   color:  "blue" },
        { name: "Molly",   color:  "blue",        num: 0.1 },
        { name: "Frank",   color:  "bright blue", num: 70 },
        { name: "Molly",   color:  "blue",        num: 300 },
        { name: "steve",   color:  "yellow",      num: 0 },
        { name: "Q",       series: "TNG" },
        { name: "sisko",   series: "DS9" },
        { name: "Quark",   series: "DS9" },
        { name: "Garak",   series: "DS9" },
        { name: "frank",   color:  "yellow",      num: 20 },
        { name: "Frank",   color:  "green",       num: 0.2 },
        { name: "Molly",   color:  "green",       num: 50 },
        { name: "Molly",   color:  "green",       num: 0 },
        { name: "Molly",   color:  "bright blue", num: 300 },
];

function customSort(groups, data) {
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
    
    db.sort(function (a, b) {
        let group = [];

        groups.forEach(key => {
            let isCol = key[0];
            let isRev = (key[1] == "asc") ? true : false;

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

console.log(customSort('num', db));

// console.log(customSort([
//     ['name', 'desc'], 
//     ['num', 'desc']
// ], db));
