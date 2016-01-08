**Super quick and dirty** gold standard data generator

Clone the repo and run it like this:

```sh
npm install
node index.js to/data.csv to/ids.csv to/annotator.js > gold-standard.json
```

**data.csv** associates file names with data used to generate the gold standard classification.

| Filename | Is cool |
| -------- | ------- |
| Foo.jpg  | Y       |
| Bar.jpg  | N       |

**ids.csv** associates subject IDs with _n_ fields from data.csv. Enough to make a unique match. The first field with only numbers is assumed to be the ID.

| ID | Filename |
| -- | -------- |
| 1  | Foo.jpg  |
| 2  | Bar.jpg  |

**annotator.js** exports a function to take a row from data.csv and generate an array of annotations. The output of this will depend entirely on your workflow.

```js
module.exports = function(row) {
  return [{
    task: 'init',
    value: row['Is cool'] === 'Y' ? 0 : 1
  }];
}

// Optionally ignore case when matching a data row with an ID.
module.exports.caseInsensitive = true;
```
