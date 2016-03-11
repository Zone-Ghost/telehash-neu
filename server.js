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
    thLib.discoverMode(true);
    let r_stream = thLib.links.router.stream();
    r_stream.on('readable', (_data) => { console.log(`From counterparty: ${_data}`); });
    thLib.events.on('routerStream',
      (_obj) => {
        console.log('Got a routerStream callback.');
        setInterval(
          () => {
            _obj.stream.write('SERVER ---> ROUTER');
          }, 1000
        );
      }
    );
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

const testMesh = neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);

console.log(inspect(testMesh, true, 8));
