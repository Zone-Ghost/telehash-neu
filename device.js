'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
const myIdentity = require('./CLIENT.json');

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity });

console.log(inspect(testMesh, true, 8));
