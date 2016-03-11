var inspect = require('util').inspect;

var neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
var my_identity = require('./CLIENT.json');

var testMesh = neuMesh.initEndpoint();

console.log(inspect(testMesh, true, 8));
