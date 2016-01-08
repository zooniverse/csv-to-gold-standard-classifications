module.exports = function(row) {
  // These are all known pulsars.
  var known = true;

  var value;
  if (known) {
    value = 0;
  } else {
    value = 1;
  }

  return [{
    task: 'init',
    value: value
  }];
};

module.exports.caseInsensitve = true;
