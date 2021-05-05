const SQLParse = require('./SQLParse.js');

let parser = new SQLParse('select max(name), num, color where ((name=0 and color = "Bright Blue") or num = 5) orderby name asc, color desc, num');
let toJson = function(data) { return JSON.stringify(data) }

let run = function(data) {
    data.forEach(row => {
        if (parser.filterWhere(row) == true) console.log(row)
    });  
}

var db = [
    { name: "Matthew", color: "red", num: 90 },
    { name: "fraNK", color: "red", num: 8 },
    { name: "Alice", color: "blue" },
    { name: "alex", color: "blue", num: 0.1 },
    { name: "Frank", color: "bright blue", num: 70 },
    { name: "Grace", color: "blue", num: 300 },
    { name: "steve", color: "yellow", num: 0 },
    { name: "Q", color: "yellow" },
    { name: "frank", color: "yellow", num: 20 },
    { name: "Frank", color: "green", num: 0.2 },
    { name: "Molly", color: "green", num: 50 },
    { name: "Sandy", color: "green", num: 0 },
    { name: "Angie", color: "bright blue", num: 300 },
];

/ =[ Test 1 ]======================================/

console.log(`
    Query:       ${parser.query}

    hasSelect:   ${parser.hasSelect()} / ${toJson(parser.getSelect())}
    hasWhere:    ${parser.hasWhere()} / ${toJson(parser.getWhere())}
    hasOrderBy:  ${parser.hasOrderBy()} / ${toJson(parser.getOrderBy())}

    ${parser.renderTree()}
`);


/ =[ Test 2 ]======================================/

parser.query = "where (name=/frank/i and color=/green/i)";
console.log(`
    Query: ${parser.query}, One result expected
`);

run(db);

/ =[ Test 3 ]======================================/

parser.query = "where (color=/green/i or num=20)";
console.log(`
    Query: ${parser.query}, Four results expected
`);

run(db);

/ =[ Test 4 ]======================================/

parser.query = "where (num=null)";
console.log(`
    Query: ${parser.query}, Two results expected
`);

run(db);

/ =[ Test 5 ]======================================/

parser.query = "where (color=/bright\\sblue/i)";
console.log(`
    Query: ${parser.query}, Two results expected
`);

run(db);

/ =[ Test 6 ]======================================/

parser.query = "where (color='bright blue')";
console.log(`
    Query: ${parser.query}, Two results expected
`);

run(db);

/ =[ Test 7 ]======================================/

parser.query = "where (name=/^f/i)";
console.log(`
    Query: ${parser.query}, Four results expected
`);

run(db);
