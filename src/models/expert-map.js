/** Created by Bo Gao on 2017-06-07 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';
import * as personService from '../services/person';

export default {

  namespace: 'expertMap',

  state: {
    personId: '',
    personInfo: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // load personId from URL. TODO config this to pass through props.
      // history.listen((location) => {
      // TODO 这里简直太写死了。要改的通用点。但是好处是可以和profileAPI同时请求。
      // const match = pathToRegexp('/person/:id').exec(location.pathname);
      // if (match) {
      //   const pid = decodeURIComponent(match[1]);
      //   // 不在初始化的时候就调用读取方法。而是在检测到参数变化的时候再去调用。
      //dispatch({ type: 'getPublications', payload: { personId: pid, offset: 0, size: 15 } });
      // }
      // });
    },
  },

  effects: {
    *getPublistInfoxxxxxxxxxxx({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(pubsService.getPubListInfo, { personId });
      yield put({ type: 'updatePubListInfo', payload: { data } });
    },

    *getPersonInfo({ payload }, { call, put }) {  // eslint-disable-line
      // console.log('effects: getPerson', payload);
      const { personId } = payload;
      const data = yield call(personService.getPerson, personId);
      yield put({ type: 'getPersonInfoSuccess', payload: { data } });
    },

  },

  reducers: {
    getPersonInfoSuccess(state, { payload: { data } }) {
      //console.log('-----------------------------------', data.data);
      return { ...state, personInfo: data.data };
    },
  },


};
