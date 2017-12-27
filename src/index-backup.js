/* eslint-disable prefer-template,import/no-dynamic-require,global-require */
/**
 * Created by GaoBo on 2017/12/26.
 *
 * This file must support node run directly.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import 'babel-polyfill';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider, addLocaleData } from 'react-intl';
import { createLogger } from 'redux-logger';
import { message } from 'antd';
import createLoading from 'dva-loading';
// import { sysconfig } from 'systems';
import { ReduxLoggerEnabled } from './utils/debug';

// TODO bad
const sysconfig = {};

// 暂时不用这两个，编译不通过。
// TODO 使用babel编译通过这两个语句.

// const log = ::console.log;
// const logErr = ::console.error;

const ERROR_MSG_DURATION = 3; // 3 秒

const configAntd = () => {
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

const fixIntl = () => {
  // Locale
  const messages = require('./locales/' + sysconfig.Locale);
  addLocaleData(require('react-intl/locale-data/' + sysconfig.Locale));

  // fix intl bugs.
  const areIntlLocalesSupported = require('intl-locales-supported');

  const localesMyAppSupports = ['en', 'zh'];

  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
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

  return messages;
};

// TODO SSR best practice of create dva instance.
const createDva = (options) => {
  //opts = {}, { models, router } = {}, isServer
  const { models, router, isServerMode, ...opts } = options;

  // 1. Initialize
  const app = dva({
    history: createHistory(),
    onError,
    ...opts || {},
  });

  app.use(createLoading({ effects: true }));

  if (process.env.NODE_ENV !== 'production') {
    if (ReduxLoggerEnabled) {
      app.use({ onAction: createLogger() });
    }
  }

  // 2. Model
  app.model(models);

  // 3. Router
  app.router(router);

  return app;
};

/** ----------------------------------------------------------------------------
 * Start
 * ----------------------------------------------------------------------------*/

// init...
configAntd();

const app = createDva({
  // models: require('./models/app'),
  // router: require('./systems/' + sysconfig.SYSTEM + '/router'),
  isServerMode: false,
});

const messages = fixIntl();

// start dva
const App = app.start();
ReactDOM.render(
  <IntlProvider locale={sysconfig.Locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root'),
);

/**
 * Config AntD.
 */
module.exports = {
  createDva,
  configAntd, onError, fixIntl,
};
