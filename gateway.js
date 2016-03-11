var inspect = require('util').inspect;

var neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the gateway.
// This might be a user's handset or a home gateway.
var my_identity = require('./ROUTER.json');


var testMesh = neuMesh.initEndpoint();

console.log(inspect(testMesh, true, 8));
