# SQLParse

Basic JS SQLParser, creates an object (array of arrays) of the query.

Does not support nested brackets
Only supports select, where and orderby

### You only need to initialize the SQLParse object once

To change the query alter the value of the property:<br>
```object.query = "select * where new=true"```

The query will be parsed automatically

![Alt text](https://github.com/hazlema/SQLParse/blob/master/img/SQLParse.png "SQLParse")
