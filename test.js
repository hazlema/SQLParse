const SQLParse = require(`./SQLParse.js`);

// Testing database
const db = [
        { name: "Matthew", color:  "red",         num: 90 },
        { name: "fraNK",   color:  "red",         num: 8 },
        { name: "Alice",   color:  "blue" },
        { name: "alex",    color:  "blue",        num: 0.1 },
        { name: "Frank",   color:  "bright blue", num: 70 },
        { name: "Grace",   color:  "blue",        num: 300 },
        { name: "steve",   color:  "yellow",      num: 0 },
        { name: "Q",       series: "TNG" },
        { name: "sisko",   series: "DS9" },
        { name: "Quark",   series: "DS9" },
        { name: "Garak",   series: "DS9" },
        { name: "frank",   color:  "yellow",      num: 20 },
        { name: "Frank",   color:  "green",       num: 0.2 },
        { name: "Molly",   color:  "green",       num: 50 },
        { name: "Sandy",   color:  "green",       num: 0 },
        { name: "Angie",   color:  "bright blue", num: 300 },
];

let parser = new SQLParse(/* You can put a query here as well */);

// Support functions
let toJson = function(data) { return JSON.stringify(data) }
let test   = function(index, query, data) {
    parser.query = query;

    console.log(`\n` +
        `===[ Test #${index} ]==============================================\n` +
        `Query:       ${parser.query}\n\n` +
        `hasSelect:   ${parser.hasSelect()} / ${toJson(parser.getSelect())}\n` +
        `hasWhere:    ${parser.hasWhere()} / ${toJson(parser.getWhere())}\n` +
        `hasOrderBy:  ${parser.hasOrderBy()} / ${toJson(parser.getOrderBy())}\n\n` +
        `Parsed query structure:\n` +
        `${parser.renderTree()}\n` +
        `===[ Test #${index} Results ]======================================`);

   
    if (data) {
        if (parser.hasOrderBy) {
            parser.filterSort(data);
        }

        if (parser.hasWhere) {
            data.forEach(row => {
                if (parser.filterWhere(row) == true) console.log(row);
            })
        }
    } else console.log(`Parsing test, No results expected`);
}

// Tests
test(1, `select max(name), num, color where ((name=0 and color = "Bright Blue") or num = 5) orderby name asc, color desc, num`);
test(2, `where (name=/frank/i and color=/green/i) orderby name, num`, db);
test(3, `where (color=/green/i or num=20) orderby name, num`, db);
test(4, `where (num=null) orderby name, num`, db);
test(5, `where (color=/bright\\sblue/i) orderby name, num`, db);
test(6, `where (color="bright blue") orderby name, num`, db);
test(7, `where (name=/^f/i) orderby name, num`, db);
test(8, `where (name!=/^f/i) orderby name, num`, db);
test(9, `where (series = "DS9" or series="TNG") orderby series`, db);
