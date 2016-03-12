'use strict';

const fs = require('fs');
const th = require('telehash');
const inspect = require('util').inspect;
const EventEmitter = require('events');
const hn = require('hashname');

class Emitter extends EventEmitter {}

const defReg = {
  keys: {
    '1a': 'akhb6r3agdzxq35jxp2s2bp4ll6j46jjcu',
    '3a': 'yn33zmwe6qw4hzi56evjfitjr6wslkttjozcziu3g66rpdgdwvxq',
    '2a': `gcbacirqbudaskugjcdpodibaeaqkaadqiaq6abqqiaquaucaeaqbingh2rf7xnrgf
    fxlfpfal2n3dfe2mfvucl7gyche7bczrxvox4cwg7wepdrdu66ceypnkpchimsgi5r555dwnge
    3xvcl7753loidkus64ospm2lph35okxudbtwxqwzgolrldbbxsdu44nzr3m5amjtaufhkdsano
    kjdlrbw35ozafhxrtts2o6pw56f6jk3hyjvkktsla6vijwo42bzznbddnk7iwzqxfl76anbc7f
    mnq5fdl3rsqgb5m2nwv66lbsgenuvp3sdf6jth3jgfnmjtlef4ykpd4la3oyx2zfowwoie2u4i
    efhqdjv7okmg62kz22yoo35ffwjmfenkcmdfvjrt6aannr4ll2bw4yjarlktrx77bzarftnwl3
    fkmyqq3kc425bd6n7z2cqouyz7ycamaqaai`,
  },
  hashname: '5kl4lesg6uouxopelrbjubk5yeouo3e3dtumm5rl6vamdwxqd2eq',
};
const defRouter = {
  keys: {
    '1a': 'akkjwabmjlacnr57nmy7kufyk34frcqzxy',
    '3a': 'dmthbylhjijqjrb4ufgz5dfrqutemabun5ebaswe3jqg4v7yorma',
    '2a': `gcbacirqbudaskugjcdpodibaeaqkaadqiaq6abqqiaquaucaeaqbjg3ulby4sbak55li
    rwqme2yxyx4fuuucmxnf6ajmspascibnv3zt2awpnuw3vztti6k2vbh7pc63jh7bqltn25n3wbzn
    rk3on7i3payxdjf33rnggllrpk77jibkgr2zyam2nqjaq7ldgapqgh6vcjz3nrfhsr55qznhmphu
    mrd73otk5rufappeod2mnbe3bgq3avpudad6utbe45hsq2ip6yfqvqp2a6tu33fd7zzety44awyb
    5cvl2txm4ff7chun27fyl5r24cb25rup7snrg677r2v5q3wm5woeg4jtnfmkv7c2l2kakojlrgad
    pplsh7xiyifkgdsikiw526kxap73rlzp4wee6hx6vucawe2gciw7vbweqz6yygdelp3z7pwr7zf5
    yqnqhl66wgwbfycamaqaai`,
  },
  hashname: 'kw4qurandncxwokuidfx6nkewvqivqwbab6fzsv4q7t5gjupyc2a',
};

function telehashMesh(_config, callback) {
  const config = {
    endpoint_id: null,
    authorized_ids: [],
    router_id: defRouter,
    registry_id: defReg,
    discovery: false,
  };

  let mesh = null;
  const linkRefs = {};
  const emitter = new Emitter();
  let timer = null;

  const build = () => {
    th.mesh({ id: config.endpoint_id }, (err, retMesh) => {
      if (err) {
        callback(new Error(`Couldn\'t generate mesh: ${err}`));
        return;
      }

      mesh = retMesh;
      linkRefs.router = mesh.link(config.router_id);
      if (linkRefs.router) {
        linkRefs.router.status((_err) => {
          if (_err) { console.log('disconnected from router', _err); return;}
          console.log('connected to router');
        });
      }

      linkRefs.registry = mesh.link(config.registry_id);
      if (linkRefs.registry) {
        linkRefs.registry.status((_err) => {
          if (_err) { console.log('disconnected from registry', _err); return;}
          console.log('connected to registry');
        });
      }
      config.authorized_ids.forEach((v) => {
        linkRefs[v.hashname] = mesh.link(v);
        linkRefs[v.hashname].status((_err) => {
          if (_err) { console.log('disconnected from thing', _err); return;}
          console.log('connected to thing');
        });
      });
      //
      // mesh.accept = (from) => {
      //   console.log('New Connection...');
      //   const hash = hn.fromKeys(from.keys);
      //   if (hash === config.registry_id.hashname) {
      //     console.log(`accepting registry: ${hash}`);
      //     mesh.link(from);
      //   } else
      //   if (hash === config.router_id.hashname) {
      //     console.log(`accepting router: ${hash}`);
      //     mesh.link(from);
      //   } else {
      //     console.log(`accepting normal: ${hash}`);
      //     mesh.link(from);
      //   }
      // };

      mesh.stream((from, args, accept) => {
        if (from.hashname === config.registry_id.hashname) {
          // this is the trusted registry
          emitter.emit('registryStream', {
            link: from.hashname,
            stream: accept,
          });
        } else
        if (from.hashname === config.router_id.hashname) {
          // this is the non-trusted router
          emitter.emit('routerStream', {
            link: from.hashname,
            stream: accept,
          });
        } else {
          emitter.emit('securedStream', {
            link: from.hashname,
            stream: accept,
          });
        }
      });

      console.log('Done building.  Calling back');
      callback(false, {
        saveAsJSON: (_path) => {
          fs.writeFile(_path, JSON.stringify(config));
        },
        addLink: (_endpoint) => {
          config.authorized_ids.push(_endpoint);
          linkRefs[_endpoint.hashname] = mesh.link(_endpoint);
        },
        discoverMode: (bool, _timer) => {
          if (timer) clearTimeout(timer);
          if (bool === false) {
            config.discovery = false;
            mesh.discover(false);
          } else {
            config.discovery = true;
            mesh.discover(true);
            if (_timer) {
              timer = setTimeout(() => {
                config.discovery = false;
                mesh.discover(false);
              }, _timer);
            }
          }
        },
        links: linkRefs,
        events: emitter,
        toString: () => inspect(config, true, 6),
        pingAll: () => {
          Object.keys(linkRefs).forEach((key) => {
            if (linkRefs[key].hasOwnProperty('ping')) {
              linkRefs[key].ping((_err, lat) => {
                if (_err) {
                  console.log(`Ping ${key} : No Response`);
                  return;
                }
                console.log(`Ping ${key} : ${lat}ms`);
              });
            } else {
              console.log(`Ping ${key} : No Link Exists`);
            }
          });
        },
      });
      return;
    });
  };
  // This constructs everything...
  if (typeof _config === 'object') Object.assign(config, _config);
  if (config.endpoint_id === null) {
    th.generate((err, endpoint) => {
      if (err) {
        callback(new Error('Couldn\'t generate endpoint'));
        return;
      }
      config.endpoint_id = endpoint;
      build();
      return;
    });
  } else {
    build();
    return;
  }
}

module.exports = {
  initEndpoint: telehashMesh,
  // not sure this has to be here...
  loadFile: (_path, _callback) => {
    if (fs.existsSync(_path) && fs.lstatSync(_path).isFile()) {
      _callback(false, JSON.parse(fs.readFileSync(_path)));
    } else {
      _callback(new Error('Failed to load provided file'));
    }
  },
};
