/**
 *  Created by BoGao on 2017-12-15;
 *
 *  Used in CSR Build different system.
 *
 *  TODO BUILD TreeShake non target systems.
 */
const { AvailableSystems } = require('../src/core/system');
const { replaceFile, createFile } = require('../src/utils/node_tools');

// get system from parameter.

const args = process.argv.splice(2);

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

console.log('System is [', system, '] start building...');

// generate src/system_config.js
createFile('./src/system-config.js', `
// !!! This is generated automatically, don't modify !!! 
export default {
  system : '${system}',
};
`);

//
// replace files, not used any more.
//
const REPLACE_FILES = false;
if (REPLACE_FILES) {

  replaceFile('./src/template-systems.js', './src/systems/index.js', [
    { pattern: '##{system}##', to: system },
  ]);

  replaceFile('./src/template-index.js', './src/index.js', [
    {
      pattern: '/\\* \\$\\$ require\\(ROUTER\\) \\*/',
      to: `require('./systems/${system}/router').default`,
    },
  ]);

  replaceFile('./src/template-themes.js', './src/themes/index.js', [
    { pattern: '##{system}##', to: system },
  ]);
}

