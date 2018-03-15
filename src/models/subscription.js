/**
 * Created by ranyanchuan on 2018/2/5.
 */
import * as SubscriptionService from '../services/subscription-service';

export default {
  namespace: 'subscription',
  state: {
    registerInfo: false,
    follow: null,
  },

  effects: {
    *getRegisterInfo({ payload }, { call, put }) { //注册
      const data = yield call(SubscriptionService.getRegisterInfo, payload);
      yield put({ type: 'getRegisterInfoSuccess', payload: { data } });
    },
    *getFollowInfo({ payload }, { call, put }) { //获取订阅
      const data = yield call(SubscriptionService.getFollowInfo, payload);
      yield put({ type: 'getFollowInfoSuccess', payload: { data } });
    },
    *delFollowInfo({ payload }, { call, put }) { //删除订阅
      const data = yield call(SubscriptionService.delFollowInfo, payload);
      yield put({ type: 'delFollowInfoSuccess', payload: { data } });
    },
    *addFollowInfo({ payload }, { call, put }) { //获取订阅
      const data = yield call(SubscriptionService.addFollowInfo, payload);
      yield put({ type: 'addFollowInfoSuccess', payload: { data } });
    },
  },

  reducers: {
    getRegisterInfoSuccess(state, { payload: { data } }) {
      return { ...state, registerInfo: data };
    },
    getFollowInfoSuccess(state, { payload: { data } }) {
      return { ...state, follow: data };
    },
    delFollowInfoSuccess(state, { payload: { data } }) {
      if (data) {
        return { ...state, follow: false, registerInfo: true };
      } else {
        return { ...state };
      }
    },
    addFollowInfoSuccess(state, { payload: { data } }) {
      return { ...state, follow: data };
    },
  },
};
