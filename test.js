const SQLParse = require('./SQLParse.js');

let parser = new SQLParse('select max(name), num, color where name=0 and color = "Bright Blue"');
let toJson = function(data) { return JSON.stringify(data) }

console.log(`
    Query:      ${parser.query}

    hasSelect:  ${parser.hasSelect()} / ${toJson(parser.getSelect())}
    hasWhere:   ${parser.hasWhere()} / ${toJson(parser.getWhere())}
    hasOrderBy: ${parser.hasOrderBy()} / ${toJson(parser.getOrderBy())}

    ${parser.renderTree()}
`);

