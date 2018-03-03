import { message } from 'antd';

const ERROR_MSG_DURATION = 3; // 3 秒

export default {
  onError(err) {
    err.preventDefault();
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '===============================================',
        '\n这回真的错的不行了！！！\n',
        err,
        '\n===============================================',
      );
      message.error(err.message, ERROR_MSG_DURATION);
    } else {
      console.error('= Global Error:', err);
      message.error(err.message, ERROR_MSG_DURATION);
    }
  },
};
