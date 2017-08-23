import React from 'react';
import ReactDOM from 'react-dom';
import dva from 'dva';
import 'babel-polyfill';
import { IntlProvider } from 'react-intl';
import { createLogger } from 'redux-logger';
import { message } from 'antd';
import { browserHistory } from 'dva/router';
import createLoading from 'dva-loading';
import { System } from './utils/system';
import { ReduxLoggerEnabled } from './utils/debug';
import './index.html';

const log = ::console.log;

if (ENABLE_PERF) { // eslint-disable-line no-undef
  window.Perf = require('react-addons-perf');
}

configAntd();

// 1. Initialize
const app = dva({
  ...createLoading({ effects: true }),
  history: browserHistory,
  onError(error) {
    console.error('Global Error:', error);
    message.error(error.message);
    // alert(error);
  },
});

if (process.env.NODE_ENV !== 'production') {
  if (ReduxLoggerEnabled) {
    app.use({ onAction: createLogger() });
  }
}

// 2. Model
app.model(require('./models/app'));

// 3. Router
app.router(require('./systems/' + System + '/router')); // eslint-disable-line
// app.router(require('./router'));

// 4. Start
const App = app.start();
ReactDOM.render(
  <IntlProvider locale="en"><App /></IntlProvider>,
  document.getElementById('root'),
);

/**
 * Config AntD.
 */
function configAntd() {
  message.config({ duration: 4 });
}
