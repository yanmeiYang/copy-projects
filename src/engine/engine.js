/**
 * Create by BoGao, 2018-01-06
 *
 * Wrapper for dva.
 */
// import dva from 'dva';
import React from 'react';
// import createLoading from 'dva-loading';
// import { ReduxLoggerEnabled } from 'utils/debug';
// import { createLogger } from 'redux-logger';
import { Form } from 'antd';
import { message } from 'antd';
// import { sysconfig } from 'systems';

// const { SYSTEM, Locale } = sysconfig;

require('debug').enable('*,-sockjs*,-aminerdebug:*');
const debug = require('debug')('aminer:engine');
// const perf = require('debug')('perf:aminer:engine');

// A perf tool for react.
if (process.env.NODE_ENV !== 'production') {
  // var registerObserver = require('react-perf-devtool');
  // registerObserver();
}

// // TODO SSR best practice of create dva instance.
// const initDVA = (app) => {
//   app.use(createLoading({ effects: true }));
//
//   if (process.env.NODE_ENV !== 'production') {
//     if (ReduxLoggerEnabled) {
//       app.use({ onAction: createLogger() });
//     }
//   }
// };

// Create DVA
// const app = dva({
// history: createHistory(),
// onError,
// });

// initDVA(app);

// const cache = {};

// const model2 = (m) => {
//   // auto indent.
//   let mm = m && m.default && !m.namespace ? m.default : m;
//
//   // development check
//   if (!mm || !mm.namespace) {
//     if (process.env.NODE_ENV !== 'production') {
//       console.error("Can't read namespace from model ", mm);
//     }
//     return;
//   }
//
//   if (cache[mm.namespace]) {
//     // debug("Can't add model with the exist namespace %s.", m.namespace);
//     debug("add model [%s] Cached.", mm.namespace);
//     return;
//   }
//   debug("Add model [%s]", mm.namespace);
//
//   // Add model to dva.
//   app.model(mm);
//
//   // Don't need to save model instance to avoid unnecessary memory-leak.
//   cache[mm.namespace] = true;
// };

// const start = () => {
//   return app.start();
// };

// // TODO delete
// const router = (router) => {
//   debug('Set Router: ', router);
//   app.router(() => React.createElement(router));
//   return app.start();
// };
//
// // TODO delete..
// const dvaRouter = (router) => {
//   debug('Set DvaRouter: ', router);
//   app.router(router);
//   return start();
// };

// -------------------------------------------------
// Decorator
// -------------------------------------------------

const Page = (config) => {
  const { form, models } = config || {};

  // if (models && models.length > 0) {
  //   for (const m of models) {
  //     model(m)
  //   }
  // }

  return (page) => {
    let elm = page;
    if (form) {
      elm = Form.create()(page);
    }
    // use umi-dva-plugin not my engine.
    return elm
    // if (page && typeof page === 'function') {
    //   // act at page class.
    //   app.router(() => React.createElement(elm));
    // } else {
    //   app.router(() => elm);
    // }
    // return app.start();
  };
};

// const Models = (models) => {
//   if (models && models.length > 0) {
//     for (const m of models) {
//       model(m)
//     }
//   }
//   return page => page;
// };

// -------------------------------------------------
// react-intl, i18n
// -------------------------------------------------

// -------------------------------------------------
// init ANTD
// -------------------------------------------------

const initANTD = () => {
  message.config({ duration: 4 });
};

// global calls.
initANTD();


// -------------------------------------------------
// Export
// -------------------------------------------------

const model = (m) => {
};

const Models = (m) => {
};

export {
  model,
  Page, Models,
}
