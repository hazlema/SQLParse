
# *SQLParse*
***Under Heavy development***

Basic JS SQLParser, creates an object that contains the parsed SQL(ish) query.  You can then apply the query to a dataset.

Only supports select, where and orderby.

### *Functions*
Some Functions are now chainable, marked with &#x1F517;
| Function | Description |
| -------- | ----------- |
| **hasQuery** | Is the query set? |
| **hasSelect** |  Does the query have a **Select** statement |
| **hasWhere** | Does the query have a **Where** statement |
| **hasOrderBy** | Does the query have an **OrderBy** statement |
|  |  |
| **get** | Return the parsed query |
| **getSelect** | Return the **Select** of the parsed query |
| **getWhere** | Return the **Where** of the parsed query |
| **getOrderBy** | Return the **OrderBy** of the parsed query |
|  |  |
| **isWhere** | Return **true** or **false** if the data matches the **Where** statement |
| **renderTree** | Render the parsed query |
|  |  |
| &#x1F517; **setQuery** | Shortcut to set the query property |
| &#x1F517; **sort** | Sort the dataset |
| &#x1F517; **where** | Apply the **Where** query to the dataset |
| &#x1F517; **select** | Apply the **Select** query to the dataset |
| &#x1F517; **update** | Apply the updates to the dataset |

#### *You only need to initialize the SQLParse object once*

To change the current query simply set the value of the query property:<br>
```js
object.query = "where new=true"
```

### Quick examples
```js
let parser = new SQLParse('where (name=/matthew/i and color = "Blue")');
```

**Single where (returns true):**
```js
parser.isWhere({name:"matthew", color="Blue"});
```

**Sort the DataSet**
```js
parser.sort([dataset]).results();
```

**Where the DataSet**
```js
parser.where([dataset]).results();
```

**Select the DataSet**
```js
parser.select([dataset]).results();
```

**Do it all**
```js
parser.sort([dataset]).where().select().results()
```
As you can see in the above query, you only need to set the dataset for the first function in the chain.

The chain is smart, for instance if there is no **Where** statement in your query,  your chain processes will skip over that part.

**Update the DataSet (3 examples)**
```js
parser.query = "[query]";
parser.update({key: value}, [dataset]);
```
```js
parser.setQuery([query]).update({key: value}, [dataset]);
```
```js
parser.query = "[query]";
parser.sort([dataset]).update({key: value}).results();
```
- If the query is not specified the last query is used. Look at `test-update.js` for an example.
- The same rules for chained functions apply, the dataset to use only needs to be set in the first link in the chain.
## *Test Results*
- [Latest Query Test Results](test-query.txt)
- [Latest Update Test Results](test-update.txt)
