'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
const myIdentity = require('./REGISTRY.json');

const cbFunction = (err, thLib) => {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    //thLib.discoverMode(true);
    const _stream = thLib.links.router.stream();
    setInterval(
      function () {
        _stream.write('Data SERVER ---> ROUTER');
      }, 1000
    );
    thLib.pingAll();
    console.log('Got a stream.');
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);

console.log(inspect(testMesh, true, 8));
