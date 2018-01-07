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

const { SYSTEM, Locale } = sysconfig;

const debug = require('debug')('aminer:engine');
const perf = require('debug')('perf:aminer:engine');

const ERROR_MSG_DURATION = 3; // 3 秒

const initANTD = () => {
  message.config({ duration: 4 });
};

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
};

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


// Create DVA
const app = dva({
  // history: createHistory(),
  onError,
});

initDVA(app);
initANTD();

const cache = {};

let engineInstance;

const model = (m) => {
  debug("Try add model %s.", m.namespace);

  // development check
  if (process.env.NODE_ENV !== 'production') {
    if (!m || !m.namespace) {
      console.error("Can't read namespace from model ", m);
      return;
    }
  }

  if (cache[m.namespace]) {
    // debug("Can't add model with the exist namespace %s.", m.namespace);
    return;
  }

  // Add model to dva.
  app.model(m);

  // Don't need to save model instance to avoid unnecessary memory-leak.
  cache[m.namespace] = true;
};

const start = () => {
  if (!engineInstance) {
    engineInstance = app.start();
    debug("Engine start success.");
  }
  return engineInstance;
};

const messages = initIntl();

const withIntl = (Child) => {
  return React.createElement(IntlProvider,
    { locale: Locale, messages },
    Child,
  );
};

const router = (router) => {
  app.router(router);
  return start();
};

const routerDirect = (router) => {
  app.router(() => React.createElement(router));
  return start();
};

export { model, router, routerDirect, start, withIntl }
