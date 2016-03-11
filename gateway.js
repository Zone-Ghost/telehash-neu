'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the gateway.
// This might be a user's handset or a home gateway.
const myIdentity = require('./ROUTER.json');

const streamActor = (r_stream) => {
  r_stream.on('readable', (_data) => { console.log(`READABLE From counterparty: ${_data}`); });
  r_stream.on('data', (_data) => { console.log(`DATA From counterparty: ${_data}`); });
//  setInterval(
//    () => {
//      r_stream.write('ROUTER ---> SERVER');
//    }, 1000
//  );
};


const cbFunction = (err, thLib) => {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    thLib.discoverMode(true);

    thLib.events.on('registryStream', (obj) => {
      console.log('Got a registryStream callback.');
      streamActor(obj.stream());
    });
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);

console.log(inspect(testMesh, true, 8));
