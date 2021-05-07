# *SQLParse*

Basic JS SQLParser, creates an object that contains the parsed SQL(ish) query.  You can then apply the query to a dataset.

Only supports select, where and orderby.

### *Functions*
* Some Functions are now chainable, marked with <span style="color:yellow;font-weight:bolder">(chain)</span>
---
- **hasQuery**: Is the query set?
- **hasSelect**: Does the query have a **Select** statement
- **hasWhere**: Does the query have a **Where** statement
- **hasOrderBy**: Does the query have an **OrderBy** statement
---
- **get**: Return the parsed query
- **getSelect**: Return the **Select** of the parsed query
- **getWhere**: Return the **Where** of the parsed query
- **getOrderBy**: Return the **OrderBy** of the parsed query
---
- **isWhere**: Return **true** || **false** if the data matches the **Where** statement
- **renderTree**: Render the parsed query
---
- **sort**: Sort the dataset <span style="color:yellow;font-weight:bolder">(chain)</span>
- **where**: Apply the **Where** query to the dataset <span style="color:yellow;font-weight:bolder">(chain)</span>
- **select**: Apply the **Select** query to the dataset <span style="color:yellow;font-weight:bolder">(chain)</span>
    - Functions for **Select** are not implemented yet
---

#### *You only need to initialize the SQLParse object once*

To change the current query simply set the value of the query property:<br>
```object.query = "select * where new=true"```

### Quick examples
`let parser = new SQLParse('where (name=/matthew/i and color = "Blue")');`

**Single where (returns true):**
`parser.isWhere({name:"matthew", color="Blue"});`

**Sort the DataSet**
`parser.sort([dataset]).results();`

**Where the DataSet**
`parser.where([dataset]).results();`

**Select the DataSet**
`parser.select([dataset]).results();`

**Do it all**
`parser.sort([dataset]).where().select().results()`

As you can see in the above query, you only need to set the dataset for the first function in the chain.

The chain is smart, for instance if there is no **Where** statement in your query,  your chain processes will skip over that part.

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
Query:       select name, color where (name=/frank/i and color=/green/i) orderby name, num

hasSelect:   true / ["name","color"]
hasWhere:    true / ["(",["name","=","/frank/i"],"and",["color","=","/green/i"],")"]
hasOrderBy:  true / ["name","num"]

Parsed query structure:
{
     "Select": [
          "name",
          "color"
     ],
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
[ { name: 'Frank', color: 'green' } ]

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
[ { name: 'Sandy', color: 'green', num: 0 },
  { name: 'Molly', color: 'green', num: 50 },
  { name: 'frank', color: 'yellow', num: 20 },
  { name: 'Frank', color: 'green', num: 0.2 } ]

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
[ { name: 'sisko', series: 'DS9' },
  { name: 'Quark', series: 'DS9' },
  { name: 'Q', series: 'TNG' },
  { name: 'Garak', series: 'DS9' },
  { name: 'Alice', color: 'blue' } ]

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
[ { name: 'Frank', color: 'bright blue', num: 70 },
  { name: 'Angie', color: 'bright blue', num: 300 } ]

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
[ { name: 'Frank', color: 'bright blue', num: 70 },
  { name: 'Angie', color: 'bright blue', num: 300 } ]

===[ Test #7 ]==============================================
Query:       select name, num where (name=/^f/i) orderby name, num

hasSelect:   true / ["name","num"]
hasWhere:    true / ["(",["name","=","/^f/i"],")"]
hasOrderBy:  true / ["name","num"]

Parsed query structure:
{
     "Select": [
          "name",
          "num"
     ],
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
[ { name: 'Frank', num: 70 },
  { name: 'frank', num: 20 },
  { name: 'fraNK', num: 8 },
  { name: 'Frank', num: 0.2 } ]

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
[ { name: 'steve', color: 'yellow', num: 0 },
  { name: 'sisko', series: 'DS9' },
  { name: 'Sandy', color: 'green', num: 0 },
  { name: 'Quark', series: 'DS9' },
  { name: 'Q', series: 'TNG' },
  { name: 'Molly', color: 'green', num: 50 },
  { name: 'Matthew', color: 'red', num: 90 },
  { name: 'Grace', color: 'blue', num: 300 },
  { name: 'Garak', series: 'DS9' },
  { name: 'Angie', color: 'bright blue', num: 300 },
  { name: 'Alice', color: 'blue' },
  { name: 'alex', color: 'blue', num: 0.1 } ]

===[ Test #9 ]==============================================
Query:       select name, series where (series="DS9" or series="TNG") orderby series

hasSelect:   true / ["name","series"]
hasWhere:    true / ["(",["series","=","\"DS9\""],"or",["series","=","\"TNG\""],")"]
hasOrderBy:  true / ["series"]

Parsed query structure:
{
     "Select": [
          "name",
          "series"
     ],
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
[ { name: 'Q', series: 'TNG' },
  { name: 'Garak', series: 'DS9' },
  { name: 'Quark', series: 'DS9' },
  { name: 'sisko', series: 'DS9' } ]

===[ Test #10 ]==============================================
Query:       where (num=null or num=0) orderby name asc

hasSelect:   false / []
hasWhere:    true / ["(",["num","=","null"],"or",["num","=","0"],")"]
hasOrderBy:  true / [["name","asc"]]

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
          "or",
          [
               "num",
               "=",
               "0"
          ],
          ")"
     ],
     "OrderBy": [
          [
               "name",
               "asc"
          ]
     ]
}
===[ Test #10 Results ]======================================
[ { name: 'Alice', color: 'blue' },
  { name: 'Garak', series: 'DS9' },
  { name: 'Q', series: 'TNG' },
  { name: 'Quark', series: 'DS9' },
  { name: 'Sandy', color: 'green', num: 0 },
  { name: 'sisko', series: 'DS9' },
  { name: 'steve', color: 'yellow', num: 0 } ]
```