'use strict';

const inspect = require('util').inspect;
const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the gateway.
// This might be a user's handset or a home gateway.
const myIdentity = require('./ROUTER.json');

const cbFunction = (err, thLib) => {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    thLib.discoverMode(true);
    let r_stream = thLib.links.registry.stream();
    r_stream.on('readable', (_data) => { console.log(`From counterparty: ${_data}`); });
    thLib.events.on('registryStream',
      (_obj) => {
        console.log('Got a registryStream callback.');
        setInterval(
          () => {
            _obj.stream.write('ROUTER ---> SERVER');
          }, 1000
        );
        _obj.stream.on('readable', (_data) => { console.log(`From counterparty: ${_data}`); });
      }
    );
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);

console.log(inspect(testMesh, true, 8));
