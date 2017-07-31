import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import dva from 'dva';
import { browserHistory } from 'dva/router';
import { message } from 'antd';
import { IntlProvider } from 'react-intl';
import createLoading from 'dva-loading';
import './index.html';
import { system } from './utils/config';

if (ENABLE_PERF) { // eslint-disable-line no-undef
  window.Perf = require('react-addons-perf');
}

message.config({
  top: 100,
  duration: 4,
});

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError(error) {
    console.error('Global Error:', error);
    message.error(error.message);
    // alert(error);
  },
});

// 2. Model
app.model(require('./models/app'));

// 3. Router
app.router(require('./systems/' + system + '/router')); // eslint-disable-line
// app.router(require('./router'));

// 4. Start
const App = app.start();
ReactDOM.render(
  <IntlProvider><App /></IntlProvider>,
  document.getElementById('root'),
);

