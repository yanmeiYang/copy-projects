/**
 *  Created by BoGao on 2017-12-15;
 *
 *  Used in CSR Build different system.
 *
 *  TODO BUILD TreeShake non target systems.
 */
const { AvailableSystems } = require('../src/core/system');
const fs = require('fs');

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

console.log('system is [', system, '] start building...');

const replaceFile = (template, target, mapping) => {
  const templateFile = fs.readFileSync(template);
  let out = templateFile.toString();
  out = out.replace('$$ NOTE $$', `!!! This is generated automatically, don't modify !!! `);
  for (const map of mapping) {
    out = out.replace(new RegExp(map.pattern, 'g'), map.to);
  }
  fs.writeFileSync(target, out);
};


replaceFile('./src/template-systems.js', './src/systems/index.js', [
  { pattern: '##{system}##', to: system },
]);

replaceFile('./src/template-index.js', './src/index.js', [
  {
    pattern: '/\\* \\$\\$ require\\(ROUTER\\) \\*/',
    to: `require('./systems/${system}/router')`
  },
]);

replaceFile('./src/template-themes.js', './src/themes/index.js', [
  { pattern: '##{system}##', to: system },
]);

