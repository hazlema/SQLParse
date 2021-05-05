# *SQLParse*

Basic JS SQLParser, creates an object (array of arrays) of the query.

Only supports select, where and orderby

### *Functions*

- **hasQuery**: Is the query set?
- **hasSelect**: Does the query have a Select statement
- **hasWhere**: Does the query have a Where statement
- **hasOrderBy**: Does the query have an OrderBy statement<br><br>
- **get**: Return the parsed query
- **getSelect**: Return the Select of the parsed query
- **getWhere**: Return the Where of the parsed query
- **getOrderBy**: Return the OrderBy of the parsed query<br><br>
- **filterWhere**: Return true|false if the dataset satisfies the where<br><br>
- **renderTree**: Render the parsed query tree

##### *You only need to initialize the SQLParse object once*

To change the query alter the value of the property:<br>
```object.query = "select * where new=true"```

*The query will be parsed automatically*

### Quick example
`let parser = new SQLParse('where (name=/matthew/i and color = "Blue")');`

Returns true:
`parser.filterWhere({name:"matthew", color="Blue"});`

## *Test Results*
```
===[ Test #1 ]==============================================
Query:       select max(name), num, color where ((name=0 and color="Bright Blue") or num=5) orderby name asc, color desc, num

hasSelect:   true / ["max(name)","num","color"]
hasWhere:    true / ["((",["name","=","0"],"and",["color","=","\"Bright Blue\""],")","or",["num","=","5"],")"]
hasOrderBy:  true / [["name","asc"],["color","desc"],"num"]

Parsed query structure:
{
     "Select": [
          "max(name)",
          "num",
          "color"
     ],
     "Where": [
          "((",
          [
               "name",
               "=",
               "0"
          ],
          "and",
          [
               "color",
               "=",
               "\"Bright Blue\""
          ],
          ")",
          "or",
          [
               "num",
               "=",
               "5"
          ],
          ")"
     ],
     "OrderBy": [
          [
               "name",
               "asc"
          ],
          [
               "color",
               "desc"
          ],
          "num"
     ]
}
===[ Test #1 Results ]======================================
Parsing test, No results expected

===[ Test #2 ]==============================================
Query:       where (name=/frank/i and color=/green/i)

hasSelect:   false / []
hasWhere:    true / ["(",["name","=","/frank/i"],"and",["color","=","/green/i"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "name",
               "=",
               "/frank/i"
          ],
          "and",
          [
               "color",
               "=",
               "/green/i"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #2 Results ]======================================
{ name: 'Frank', color: 'green', num: 0.2 }

===[ Test #3 ]==============================================
Query:       where (color=/green/i or num=20)

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","/green/i"],"or",["num","=","20"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "color",
               "=",
               "/green/i"
          ],
          "or",
          [
               "num",
               "=",
               "20"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #3 Results ]======================================
{ name: 'frank', color: 'yellow', num: 20 }
{ name: 'Frank', color: 'green', num: 0.2 }
{ name: 'Molly', color: 'green', num: 50 }
{ name: 'Sandy', color: 'green', num: 0 }

===[ Test #4 ]==============================================
Query:       where (num=null)

hasSelect:   false / []
hasWhere:    true / ["(",["num","=","null"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "num",
               "=",
               "null"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #4 Results ]======================================
{ name: 'Alice', color: 'blue' }
{ name: 'Q', series: 'TNG' }
{ name: 'sisko', series: 'DS9' }
{ name: 'Quark', series: 'DS9' }
{ name: 'Garak', series: 'DS9' }

===[ Test #5 ]==============================================
Query:       where (color=/bright\sblue/i)

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","/bright\\sblue/i"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "color",
               "=",
               "/bright\\sblue/i"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #5 Results ]======================================
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'Angie', color: 'bright blue', num: 300 }

===[ Test #6 ]==============================================
Query:       where (color="bright blue")

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","\"bright blue\""],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "color",
               "=",
               "\"bright blue\""
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #6 Results ]======================================
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'Angie', color: 'bright blue', num: 300 }

===[ Test #7 ]==============================================
Query:       where (name=/^f/i)

hasSelect:   false / []
hasWhere:    true / ["(",["name","=","/^f/i"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "name",
               "=",
               "/^f/i"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #7 Results ]======================================
{ name: 'fraNK', color: 'red', num: 8 }
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'frank', color: 'yellow', num: 20 }
{ name: 'Frank', color: 'green', num: 0.2 }

===[ Test #8 ]==============================================
Query:       where (name!=/^f/i)

hasSelect:   false / []
hasWhere:    true / ["(",["name","!=","/^f/i"],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "name",
               "!=",
               "/^f/i"
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #8 Results ]======================================
{ name: 'Matthew', color: 'red', num: 90 }
{ name: 'Alice', color: 'blue' }
{ name: 'alex', color: 'blue', num: 0.1 }
{ name: 'Grace', color: 'blue', num: 300 }
{ name: 'steve', color: 'yellow', num: 0 }
{ name: 'Q', series: 'TNG' }
{ name: 'sisko', series: 'DS9' }
{ name: 'Quark', series: 'DS9' }
{ name: 'Garak', series: 'DS9' }
{ name: 'Molly', color: 'green', num: 50 }
{ name: 'Sandy', color: 'green', num: 0 }
{ name: 'Angie', color: 'bright blue', num: 300 }

===[ Test #9 ]==============================================
Query:       where (series="DS9" or series="TNG")

hasSelect:   false / []
hasWhere:    true / ["(",["series","=","\"DS9\""],"or",["series","=","\"TNG\""],")"]
hasOrderBy:  false / []

Parsed query structure:
{
     "Select": [],
     "Where": [
          "(",
          [
               "series",
               "=",
               "\"DS9\""
          ],
          "or",
          [
               "series",
               "=",
               "\"TNG\""
          ],
          ")"
     ],
     "OrderBy": []
}
===[ Test #9 Results ]======================================
{ name: 'Q', series: 'TNG' }
{ name: 'sisko', series: 'DS9' }
{ name: 'Quark', series: 'DS9' }
{ name: 'Garak', series: 'DS9' }
```