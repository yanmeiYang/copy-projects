import 'babel-polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import { browserHistory } from 'dva/router';
import { message } from 'antd';
import './index.html';

// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: browserHistory,
  onError(error) {
    console.log(error);
    message.error(error.message);
  },
});

// 2. Model
app.model(require('./models/app'));

// 3. Router ; TODO 根据app不同，这里引入不同的router.
app.router(require('./router'));

// 4. Start
app.start('#root');
