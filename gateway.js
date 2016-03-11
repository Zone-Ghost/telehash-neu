'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the gateway.
// This might be a user's handset or a home gateway.
const myIdentity = require('./ROUTER.json');

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity });

console.log(inspect(testMesh, true, 8));
