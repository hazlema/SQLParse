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

let parser = new SQLParse();

console.log("Dataset before any modifications\n");
console.log(db);

console.log("\n** Updating records, setting green and yellow colors to gray **\n");

console.log( 
    parser
        .setQuery('select name, color, newData where color="green" or color="yellow"')
        .update({
            color: "gray",
            newData: "inserted"
        }, db).results()
);
