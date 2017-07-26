/**
 * Created by BoGao on 2017/7/19.
 *
 * 由于需要支持在线切换各种系统。云支持。因此暂时不用define功能。
 */

const SYSTEM = 'ccf';
// const SYSTEM = 'huawei';
// const SYSTEM = 'alibaba';
// const SYSTEM = 'tencent';

const define = {
  SYSTEM: SYSTEM, // eslint-disable-line object-shorthand
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
