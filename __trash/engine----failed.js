/**
 * Create by BoGao, 2018-01-06
 *
 * Wrapper for dva.
 */
import dva from 'dva';
import React from 'react';
import createLoading from 'dva-loading';
import { ReduxLoggerEnabled } from 'utils/debug';
import { createLogger } from 'redux-logger';
import locales from 'locales';
import { IntlProvider, addLocaleData } from 'react-intl';
import { message } from 'antd';
import { sysconfig } from 'systems';

// locale, list all locales here.
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { engine } from "engine/index";

const { SYSTEM, Locale } = sysconfig;

require('debug').enable('*,-sockjs*');
const debug = require('debug')('aminer:engine');
const perf = require('debug')('perf:aminer:engine');

const ERROR_MSG_DURATION = 3; // 3 秒

const onError = (error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(
      '===============================================',
      '\n这回真的错的不行了！！！\n',
      error,
      '\n===============================================',
    );
    message.error(error.message, ERROR_MSG_DURATION);
  } else {
    console.error('= Global Error:', error);
    message.error(error.message, ERROR_MSG_DURATION);
  }
};

// TODO SSR best practice of create dva instance.
const initDVA = (app) => {
  app.use(createLoading({ effects: true }));

  if (process.env.NODE_ENV !== 'production') {
    if (ReduxLoggerEnabled) {
      app.use({ onAction: createLogger() });
    }
  }
  return app;
};


// 临时解决方案，解决dva不能重置router的问题。不能重新start的问题。
// 因为同时只可能打开一个页面。所以dva实例每个页面一个吧。
// TODO umi 暂时dva的state不能跨页面共享。
// TODO 但是已经打开的页面保留state.
// create engine on each page. register model on each page.
let currentInstance; // The current instance.

const create = () => {
  debug("******* Create New Engine!!! Performance Issue.", window.location.href);

  const instance = {
    cache: { 'app': require('models/app').default },
    app: initDVA(dva({ /* history: createHistory(), */      onError, })),
  };
  currentInstance = instance;
  // return instance;
};

const model = (m) => {
  debug("Try add model %s.", m.namespace);

  // development check
  if (process.env.NODE_ENV !== 'production') {
    if (!m || !m.namespace) {
      console.error("Can't read namespace from model ", m);
      return;
    }
  }
  const cache = currentInstance.cache;
  if (cache[m.namespace]) {
    // debug("Can't add model with the exist namespace %s.", m.namespace);
    return;
  }

  // 将model添加到缓存，然后等router的时候一起初始化。
  // Add model to dva.
  // currentInstance.app.model(m);

  // Don't need to save model instance to avoid unnecessary memory-leak.
  cache[m.namespace] = m;
};

const start = () => {
  return currentInstance.app.start();
};
// const createDVATest = () => {
//   debug('Create a new DVA instance! Models do not share data');
//   const app = dva({
//     // history: createHistory(),
//     onError,
//   });
//   initDVA(app);
//   return app;
// };

const router = (router) => {
  debug('dva.router');
  const app = currentInstance.app;
  // TODO add module
  Object.keys(currentInstance.cache).forEach((ns) => {
    const m = currentInstance.cache[ns];
    debug('add model %s', ns);
    app.model(m);
  });
  app.router(() => React.createElement(router));
  return app.start();
};

// const router_backup = (router) => {
//   debug('Set Router: ', router);
//   app.router(() => React.createElement(router));
//   return start();
// };

const dvaRouter = (router) => {
  const app = currentInstance.app;
  app.router(router);
  return start();
};

// -------------------------------------------------
// react-intl, i18n
// -------------------------------------------------

const initIntl = () => {
  // fix intl bugs.
  const areIntlLocalesSupported = require('intl-locales-supported');
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(locales)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      const IntlPolyfill = require('intl');
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
  }

  // 由于现在支持的语言比较少，只有en和zh，所以将资源都引入进来，避免下面这样会打包引太多的资源。
  // addLocaleData(require(`react-intl/locale-data/${Locale}`));
  addLocaleData([...en, ...zh]);

  return require(`locales/${Locale}`).default;
};

const messages = initIntl();

const withIntl = (Child) => {
  return React.createElement(IntlProvider,
    { locale: Locale, messages },
    Child,
  );
};

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


export { model, router, dvaRouter, start, withIntl, create }
