'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
const myIdentity = require('./REGISTRY.json');

const streamActor = (r_stream) => {
  r_stream.on('readable', (_data) => { console.log(`READABLE From counterparty: ${_data}`); });
  r_stream.on('data', (_data) => { console.log(`DATA From counterparty: ${_data}`); });
//  setInterval(
//    () => {
//      r_stream.write('SERVER ---> ROUTER');
//    }, 500
//  );
};


const cbFunction = (err, thLib) => {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    thLib.discoverMode(true);

    thLib.events.on('routerStream', (obj) => {
      console.log('Got a routerStream callback.');
      streamActor(obj.stream());
    });

    thLib.links.router.stream();
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);

console.log(inspect(testMesh, true, 8));
