'use strict';

const neuMesh = require('./thLib.js');

// This file represents the telehash instance running on the device.
const myIdentity = require('./REGISTRY.json');

const streamActor = (accept) => {
  const rStream = accept();
  rStream.on('readable', (_data) => { console.log(`READABLE From counterparty: ${_data}`); });
  rStream.on('data', (_data) => {
    console.log(`DATA From counterparty: ${_data}`);
  });
  setInterval(
    () => {
      rStream.write('SERVER ---> ROUTER');
    }, 500
  );
};


const cbFunction = (err, thLib) => {
  if (err) {
    console.log(err);
  } else if (thLib) {
    console.log('About to make this instance discoverable.');
    thLib.discoverMode(true);

    thLib.events.on('routerStream', (obj) => {
      console.log('Got a routerStream callback.');
      obj.link.on('status', () => {
        streamActor(obj.stream);
      });
    });
    thLib.events.on('registryStream', (obj) => {
      console.log('Got a registryStream callback.');
      obj.link.on('status', () => {
        streamActor(obj.stream);
      });
    });

    thLib.events.on('securedStream', (obj) => {
      console.log('Got a securedStream callback.');
      obj.link.on('status', () => {
        streamActor(obj.stream);
      });
    });

    thLib.links.router.on('status', () => {
      streamActor(thLib.links.router.stream);
    });
    setTimeout(() => {
      console.log(thLib.paths())
    }, 2000);
  } else {
    console.log('No error reported, but no thLib either! Gripe. Explode.');
  }
};

neuMesh.initEndpoint({ endpoint_id: myIdentity }, cbFunction);
