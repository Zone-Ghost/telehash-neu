var inspect = require('util').inspect;

var neuMesh = require('./thLib.js');


var testMesh = neuMesh.initEndpoint({}, (err, wat) => {
  console.log(err ? err : wat)
  console.log(inspect(testMesh, true, 8));
});
