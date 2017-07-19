/**
 * Created by BoGao on 2017/7/19.
 */

console.log('Using define.js');

// const SYSTEM = 'ccf';
const SYSTEM = 'huawei';
// const SYSTEM = 'alibaba';
// const SYSTEM = 'tencent';

const define = {
  SYSTEM,
  PRODUCTION: true,
  VERSION: '0.1.0',
  BROWSER_SUPPORTS_HTML5: true,
  TWO: '1+1', // like marco
  'typeof window': 'object',
  API_BASE_URL: 'http://dev.example.com',
};

module.exports = () => {
  // System's config will override the default.
  const overrides = require('./systems/' + SYSTEM + '/define.js'); // eslint-disable-line
  Object.keys(overrides).map((key) => {
    define[key] = overrides[key];
    return true;
  });
  return define;
};
