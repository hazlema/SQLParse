# *SQLParse*

Basic JS SQLParser, creates an object (array of arrays) of the query.

Only supports select, where and orderby

### *Functions*
---
- **hasQuery**: Is the query set?
- **hasSelect**: Does the query have a Select statement
- **hasWhere**: Does the query have a Where statement
- **hasOrderBy**: Does the query have an OrderBy statement
---
- **get**: Return the parsed query
- **getSelect**: Return the Select of the parsed query
- **getWhere**: Return the Where of the parsed query
- **getOrderBy**: Return the OrderBy of the parsed query
---
- **isWhere**: Return true|false if the data satisfies
- **renderTree**: Render the parsed query
---
- **sort**: Return the sorted object
- **where**: Runs the where on the db
---

#### *You only need to initialize the SQLParse object once*

To change the current query simply set the value of the query property:<br>
```object.query = "select * where new=true"```

### Quick examples
`let parser = new SQLParse('where (name=/matthew/i and color = "Blue")');`

**Single where (returns true):**
`parser.isWhere({name:"matthew", color="Blue"});`

**Sort the Database (returns the database)**
`parser.sort([database]);`

**Where the Database (returns the database)**
`parser.where([database]);`

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
Query:       where (name=/frank/i and color=/green/i) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["name","=","/frank/i"],"and",["color","=","/green/i"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #2 Results ]======================================
{ name: 'Frank', color: 'green', num: 0.2 }

===[ Test #3 ]==============================================
Query:       where (color=/green/i or num=20) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","/green/i"],"or",["num","=","20"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #3 Results ]======================================
{ name: 'Sandy', color: 'green', num: 0 }
{ name: 'Molly', color: 'green', num: 50 }
{ name: 'frank', color: 'yellow', num: 20 }
{ name: 'Frank', color: 'green', num: 0.2 }

===[ Test #4 ]==============================================
Query:       where (num=null) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["num","=","null"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #4 Results ]======================================
{ name: 'sisko', series: 'DS9' }
{ name: 'Quark', series: 'DS9' }
{ name: 'Q', series: 'TNG' }
{ name: 'Garak', series: 'DS9' }
{ name: 'Alice', color: 'blue' }

===[ Test #5 ]==============================================
Query:       where (color=/bright\sblue/i) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","/bright\\sblue/i"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #5 Results ]======================================
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'Angie', color: 'bright blue', num: 300 }

===[ Test #6 ]==============================================
Query:       where (color="bright blue") orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["color","=","\"bright blue\""],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #6 Results ]======================================
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'Angie', color: 'bright blue', num: 300 }

===[ Test #7 ]==============================================
Query:       where (name=/^f/i) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["name","=","/^f/i"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #7 Results ]======================================
{ name: 'Frank', color: 'bright blue', num: 70 }
{ name: 'frank', color: 'yellow', num: 20 }
{ name: 'fraNK', color: 'red', num: 8 }
{ name: 'Frank', color: 'green', num: 0.2 }

===[ Test #8 ]==============================================
Query:       where (name!=/^f/i) orderby name, num

hasSelect:   false / []
hasWhere:    true / ["(",["name","!=","/^f/i"],")"]
hasOrderBy:  true / ["name","num"]

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
     "OrderBy": [
          "name",
          "num"
     ]
}
===[ Test #8 Results ]======================================
{ name: 'steve', color: 'yellow', num: 0 }
{ name: 'sisko', series: 'DS9' }
{ name: 'Sandy', color: 'green', num: 0 }
{ name: 'Quark', series: 'DS9' }
{ name: 'Q', series: 'TNG' }
{ name: 'Molly', color: 'green', num: 50 }
{ name: 'Matthew', color: 'red', num: 90 }
{ name: 'Grace', color: 'blue', num: 300 }
{ name: 'Garak', series: 'DS9' }
{ name: 'Angie', color: 'bright blue', num: 300 }
{ name: 'Alice', color: 'blue' }
{ name: 'alex', color: 'blue', num: 0.1 }

===[ Test #9 ]==============================================
Query:       where (series="DS9" or series="TNG") orderby series

hasSelect:   false / []
hasWhere:    true / ["(",["series","=","\"DS9\""],"or",["series","=","\"TNG\""],")"]
hasOrderBy:  true / ["series"]

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
     "OrderBy": [
          "series"
     ]
}
===[ Test #9 Results ]======================================
{ name: 'Q', series: 'TNG' }
{ name: 'Garak', series: 'DS9' }
{ name: 'Quark', series: 'DS9' }
{ name: 'sisko', series: 'DS9' }
```