# SQLParse

Basic JS SQLParser, creates an object (array of arrays) of the query.

Does not support nested brackets
Only supports select, where and orderby

You only need to initialize the SQLParse object once

If you want to change the query:
**object.query = "select * where new='query'"**

The query will be parsed automatically

![Alt text](https://github.com/hazlema/SQLParse/blob/master/img/SQLParse.png "SQLParse")
