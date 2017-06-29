/**
 * Created by yangyanmei on 17/6/29.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import * as authService from '../../services/auth';

export default {
  namespace: 'auth',
  state: { validEmail: true },
  subscriptions: {},
  effects: {
    *createUser({ payload }, { call, put }){
      // const { user } = payload;
      const { data } = yield call(authService.createUser, payload);
      yield  put({ type: 'createUserSuccess', payload: data });
    },
    *checkEmail({ payload }, { call, put }){
      const { data } = yield call(authService.checkEmail, payload);
      yield put({ type: 'checkEmailSuccess', payload: data.status })
    }
  },
  reducers: {
    createUserSuccess(state, { payload: { data } }){
      //TODO 注册成功以后的提示信息
      return { ...state }
    },
    checkEmailSuccess(state, { payload }){
      return { ...state, validEmail: payload }
    }
  }

}
