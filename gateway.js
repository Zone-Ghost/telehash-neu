'use strict';

const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the gateway.
// This might be a user's handset or a home gateway.
const myIdentity = require('./ROUTER.json');

const streamActor = function(aStream) {
  const rStream = aStream();
  console.log('stream actor working');
  rStream.on('readable', function(_data) { console.log(`READABLE From counterparty: ${_data}`); });
  rStream.on('data', function(_data) {
    console.log(`DATA From counterparty: ${_data}`);
    rStream.write('HELLO SERVER DOG.  THIS IS GATEWAY.');
  });
  setInterval(
    function() {
      r_stream.write('ROUTER ---> SERVER');
    }, 1000
  );
};


const cbFunction = function(err, thLib) {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    thLib.discoverMode(true);

    thLib.events.on('registryStream', function(obj) {
      console.log('Got a registryStream callback.');
      streamActor(obj.stream);
    });
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);
