/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import 'babel-polyfill';
import createHistory from 'history/createBrowserHistory';
import { IntlProvider, addLocaleData } from 'react-intl';
import { createLogger } from 'redux-logger';
import { message } from 'antd';
import createLoading from 'dva-loading';
// import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
import { sysconfig } from './systems';
import { config } from './utils';
import { ReduxLoggerEnabled } from './utils/debug';

// const log = ::console.log;
const logErr = ::console.error;

const ERROR_MSG_DURATION = 3; // 3 秒

configAntd();

if (ENABLE_PERF) { // eslint-disable-line no-undef
  window.Perf = require('react-addons-perf');
}

/** ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------*/

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(error) {
    if (process.env.NODE_ENV !== 'production') {
      logErr(
        '===============================================\n这回真的错的不行了！！！\n',
        error,
        '===============================================',
      );
      message.error(error.message, ERROR_MSG_DURATION);
    } else {
      logErr('= Global Error:', error);
      message.error(error.message, ERROR_MSG_DURATION);
    }
  },
});

app.use(createLoading({ effects: true }));

if (process.env.NODE_ENV !== 'production') {
  if (ReduxLoggerEnabled) {
    app.use({ onAction: createLogger() });
  }
}

// 2. Model
app.model(require('./models/app'));

// 3. Router
app.router(require('./systems/' + sysconfig.SYSTEM + '/router'));
// app.router(require('./router2'));

// Locale
const messages = require('./locales/' + sysconfig.Locale);
addLocaleData(require('react-intl/locale-data/' + sysconfig.Locale));

// Graphql
// const client = new ApolloClient({
//   networkInterface: createNetworkInterface({
//     uri: config.graphqlAPI,
//   }),
// });

const App = app.start();
ReactDOM.render(
  // <ApolloProvider client={client}>
  <IntlProvider locale={sysconfig.Locale} messages={messages}>
    <App />
  </IntlProvider>,
  // </ApolloProvider>,
  document.getElementById('root'),
);

/**
 * Config AntD.
 */
function configAntd() {
  message.config({ duration: 4 });
}
