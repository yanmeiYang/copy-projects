import 'babel-polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import { browserHistory } from 'dva/router';
import { message } from 'antd';
import './index.html';
import { system } from './utils/config';

if (ENABLE_PREF) { // eslint-disable-line no-undef
  window.Perf = require('react-addons-perf');
}

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError(error) {
    console.log(error);
    message.error(error.message);
    alert(error);
  },
});

// 2. Model
app.model(require('./models/app'));

// 3. Router
app.router(require('./systems/' + system + '/router')); // eslint-disable-line

// old backup
// app.router(require('./router'));

// 4. Start
app.start('#root');
