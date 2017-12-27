import { browserHistory } from 'dva/router';
import { sysconfig } from 'systems';
import { createApp } from '../src';

const models = require('./models/app');
const router = require('./systems/' + sysconfig.SYSTEM + '/router');

const app = createApp({
  history: browserHistory,
  initialState: JSON.parse(window.states),
}, { router, models });
delete window.states;
app.start('#root');
