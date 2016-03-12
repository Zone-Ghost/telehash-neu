'use strict';

const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
const myIdentity = require('./REGISTRY.json');

const streamActor = (aStream) => {
  const rStream = aStream();
  rStream.on('readable', (_data) => { console.log(`READABLE From counterparty: ${_data}`); });
  rStream.on('data', (_data) => {
    console.log(`DATA From counterparty: ${_data}`);
    rStream.write('HELLO GATEWAY.  THIS IS SERVER DOG.');
  });
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
      streamActor(obj.stream);
    });
    thLib.events.on('registryStream', (obj) => {
      console.log('Got a registryStream callback.');
      streamActor(obj.stream);
    });

    thLib.events.on('securedStream', (obj) => {
      console.log('Got a securedStream callback.');
      streamActor(obj.stream);
    });

    const a = thLib.links.router.stream();
    a.write('SERVER TO GATEWAY, COME IN.');
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);
