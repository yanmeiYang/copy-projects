/**
 *  Created by BoGao on 2017-12-15;
 */
const { AvailableSystems } = require('../src/core/system');
const fs = require('fs');

// console.log('AvailableSystems is: ', AvailableSystems);
console.log();

const args = process.argv.splice(2);

let system;
const idx = args.indexOf('-s');
if (args.length > idx) {
  system = args[idx + 1];
} else {
  console.error('No system found! Please specified -s <system>');
  process.exit(-1);
}

if (AvailableSystems.indexOf(system) <= 0) {
  console.error('Error! System not available: ', system);
  process.exit(-1);
}


// create and override file.
const path = 'system-override.js';
fs.writeFileSync(path, `module.exports = { OverrideSystem: '${system}' };`);

console.log('system is [', system, '] start building...');
