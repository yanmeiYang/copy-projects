/**
 * Created by yangyanmei on 17/8/12.
 */
import { emailTemplate } from '../services/2b';

export default {
  namespace: 'systemSetting',
  state: {
    status: null,
  },
  subscriptions: {},
  effects: {
    *setEmailTemplate({ payload }, { call, put }) {
      // const { type, sender, subject, body } = payload;
      const data = yield call(emailTemplate, payload);
      yield put({ type: 'setEmailTemplateSuccess', payload: { data } });
    },
  },
  reducers: {
    setEmailTemplateSuccess(state, { payload: { data } }) {
      return { ...state, status: data.data.status };
    },
  },

};
