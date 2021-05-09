const SQLParse = require(`./SQLParse.js`);
let parser = new SQLParse();

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

function test(index, desc, fn) {
    console.log(`\n===[ Test #${index} ]==============================================\n` +
                `${desc}\n`);

    console.log( eval(fn) );
}

console.log(`\n===[ DataSet Dump (Before Changes) ]====================================`);
console.log(db);

test(1, "Change Yellow and Green records to gray and insert column newData", `
    parser
        .setQuery('select name, color, newData where color="green" or color="yellow"')
        .update({
            color: "gray",
            newData: "inserted"
        }, db).results()
`);

test(2, "Updating records, setting all a's to a num of 99", `
    parser.query = "select name, num where name=/^a/i orderby num";

    parser
        .sort(db)
        .update({num: 99})
        .results()
`);

test(3, "Changing Q's series to Voyager", `
    parser.query = "where name='Q'";

    parser
        .update({series: "Voyager"}, db)
        .results()
`);

console.log(`\n===[ DataSet Dump (After Changes) ]====================================`);
console.log(db);
