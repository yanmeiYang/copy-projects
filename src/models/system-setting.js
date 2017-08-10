/**
 * Created by yangyanmei on 17/8/10.
 */
import { emailTemplate } from '../services/system-setting';

export default {
  namespace: 'systemSetting',
  state: {},
  subscriptions: {},
  effects: {
    *setEmailTemplate({ payload }, { call }) {
      // const { type, sender, subject, body } = payload;
      const data = yield call(emailTemplate, payload);
    },
  },
  reducers: {},

};
