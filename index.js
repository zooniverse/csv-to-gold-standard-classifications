var path = require('path');
var fs = require('fs');
var Baby = require('babyparse');

if (process.argv.length !== 5) {
  console.error('node index.js path/to/data.csv path/to/ids.csv path/to/annotator.js');
  process.exit(1);
}

var inputCSVFilename = path.resolve(process.argv[2]);
var inputCSVContent = fs.readFileSync(inputCSVFilename).toString().trim();
var parsedInput = Baby.parse(inputCSVContent, {
  header: true,
});

if (parsedInput.errors.length !== 0) {
  console.error(parsedInput.errors.join('\n'));
  process.exit(1);
}

var idsCSVFilename = path.resolve(process.argv[3]);
var idsCSVContent = fs.readFileSync(idsCSVFilename).toString().trim();
var parsedIDs = Baby.parse(idsCSVContent, {
  header: true,
});

if (parsedIDs.errors.length !== 0) {
  console.error(parsedIDs.errors.join('\n'));
  process.exit(1);
}

var rowKeys = Object.keys(parsedIDs.data[0]);

var ONLY_NUMBERS = /^\d+$/;
var idKey = rowKeys.filter(function(key) {
  var value = parsedIDs.data[0][key];
  return ONLY_NUMBERS.test(value);
})[0];

var dataKeys = rowKeys.filter(function(key) {
  return key !== idKey;
});

var annotatorModule = path.resolve(process.argv[4]);
var annotator = require(annotatorModule);

var classifications = parsedIDs.data.map(function(idRow) {
  var subjectID = idRow[idKey];

  var matchingInputRow = parsedInput.data.filter(function(inputRow) {
    return dataKeys.every(function(key) {
      if (annotator.caseInsensitve) {
        return inputRow[key].toLowerCase() === idRow[key].toLowerCase();
      } else {
        return inputRow[key] === idRow[key];
      }
    });
  })[0];

  if (matchingInputRow === undefined) {
    return null;
  }

  var annotations = [].concat(annotator(matchingInputRow));

  return {
    links: {
      subjects: [subjectID]
    },
    annotations: annotations
  };
}).filter(Boolean);

console.log(JSON.stringify(classifications, null, 2));
