var inspect = require('util').inspect;

var neuMesh = require('./thLib.js');


var testMesh = neuMesh.initEndpoint();

console.log(inspect(testMesh, true, 8));
