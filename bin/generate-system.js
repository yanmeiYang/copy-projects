/**
 *  Created by BoGao on 2017-12-15;
 *
 *  Used in CSR Build different system.
 *
 *  TODO BUILD TreeShake non target systems.
 */
const debug = require('debug')('aminer:engine');

const { linkFolder, createFile, clearFolders, linkPagesByRoutes } = require('./node_tools');
// const { AvailableSystems } = require('../src/core/system');
const AvailableSystems = [
  'aminer',
  'demo',
  'data_annotation',
  'alibaba',
  'acmfellow',
  'bole',
  'ccf',
  'ccftest',
  'cie',
  'cietest',
  'cipsc',
  'huawei',
  'nsfcai',
  'med_topic_trend',
  'minimalsys', // 用来调试的最小system集合
  'scei', // 中国科协：深度智库
  'tencent',
  'thurcb',
  'yocsef',
  'reco',
];

// get system from parameter.
const args = process.argv.splice(2);
debug('arguments is : %o', args);

let system;
const idx = args.indexOf('-s');
if (args.length > idx) {
  system = args[idx + 1];
} else {
  console.error('No system found! Please specify a system <system>');
  process.exit(-1);
}

if (AvailableSystems.indexOf(system) <= 0) {
  console.error('Error! System not available: ', system);

  console.log("Available systems are:");
  for (const sys of AvailableSystems) {
    console.log("  ... ", sys);
  }
  process.exit(-1);
}

// start doing things.
console.log('System is [', system, '] start building...');

// link or copy files used to start system.
clearFolders([`./src/systems`, `./src/themes`, './src/pages']);
linkFolder(`./src/seedsystems/${system}`, `./src/systems/${system}`);
linkFolder(`./src/seedthemes/${system}`, `./src/themes/${system}`);
// copyOrLink(`./src/seedsystems/${system}`, './src/systems/current');
// copyOrLink(`./src/seedthemes/${system}`, './src/themes/current');

// link or copy pages.
// TODO asset routes must exist.
const { routes } = require(`../src/seedsystems/${system}/routes.js`);
debug('arguments router : %o', routes);
linkPagesByRoutes(routes);

// generate src/system_config.js
createFile('./src/system-config.js', `
// !!! This is generated automatically, don't modify !!! 
export const system = '${system}';
`);

//
// replace files, not used any more.
//
// const REPLACE_FILES = false;
// if (REPLACE_FILES) {
//
//   replaceFile('./src/template-systems.js', './src/systems/index.js', [
//     { pattern: '##{system}##', to: system },
//   ]);
//
//   replaceFile('./src/template-index.js', './src/index.js', [
//     {
//       pattern: '/\\* \\$\\$ require\\(ROUTER\\) \\*/',
//       to: `require('./systems/${system}/router').default`,
//     },
//   ]);
//
//   replaceFile('./src/template-themes.js', './src/themes/index.js', [
//     { pattern: '##{system}##', to: system },
//   ]);
// }

