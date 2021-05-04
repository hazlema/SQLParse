# *SQLParse*

Basic JS SQLParser, creates an object (array of arrays) of the query.

Does not support nested brackets (I may add that later)
Only supports select, where and orderby

### *Functions*

- **hasQuery**: Returns the unparsed query
- **hasSelect**: Does the query have a Select statement
- **hasWhere**: Does the query have a Where statement
- **hasOrderBy**: Does the query have an OrderBy statement<br><br>
- **get**: Return the parsed query
- **getSelect**: Return the Select of the parsed query
- **getWhere**: Return the Where of the parsed query
- **getOrderBy**: Return the OrderBy of the parsed query<br><br>
- **renderTree**: Render the parsed query tree

##### *You only need to initialize the SQLParse object once*

To change the query alter the value of the property:<br>
```object.query = "select * where new=true"```

The query will be parsed automatically

![Alt text](https://github.com/hazlema/SQLParse/blob/master/img/SQLParse.png "SQLParse")
