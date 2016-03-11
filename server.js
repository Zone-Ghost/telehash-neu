var inspect = require('util').inspect;

var neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
var my_identity = require('./REGISTRY.json');


var testMesh = neuMesh.initEndpoint({}, (err, wat) => {
  console.log(err ? err : wat)
  console.log(inspect(testMesh, true, 8));
});
