/* eslint-disable prefer-template,import/no-dynamic-require,global-require */
/**
 * Created by GaoBo on 2017/12/26.
 *
 * $$ NOTE $$
 */
import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import '@babel/polyfill';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider, addLocaleData } from 'react-intl';
import { createLogger } from 'redux-logger';
import { message } from 'antd';
import locales from 'locales';
import createLoading from 'dva-loading';
import { sysconfig } from 'systems';
import { ReduxLoggerEnabled } from 'utils/debug';

// TODO 使用babel编译通过这两个语句. 暂时不用这两个，编译不通过。
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
  const { Locale } = sysconfig;
  const messages = require(`./locales/${Locale}`).default;
  addLocaleData(require(`react-intl/locale-data/${Locale}`).default);

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

  return messages;
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

/** ----------------------------------------------------------------------------
 * Start
 * ----------------------------------------------------------------------------*/

// init others...
configAntd();

// create dva
const app = dva({
  history: createHistory(),
  onError,
});

initDVA(app);

// Model的引入，一种写法是这样的
app.model(require('models/app').default);

app.router(/* $$ require(ROUTER) */);

const messages = fixIntl();

// start dva
const App = app.start();

ReactDOM.render(
  <IntlProvider locale={sysconfig.Locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root'),
);
