/**
 * Created by yangyanmei on 17/8/21.
 */
import * as tobProfileService from '../../services/2b-profile';

export default {
  namespace: 'tobProfile',

  state: {
    results: [],
    flag: 0,
    extraData: [],
    item: [],
    profile: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tobprofile') {
          dispatch({
            type: 'getExpert',
            payload: { src: 'ccf', offset: 0, size: 20 },
          });
        }
      });
    },
  },

  effects: {
    * getExpert({ payload }, { call, put }) {
      const { src, offset, size } = payload;
      const { data } = yield call(tobProfileService.getExpertInfo, src, offset, size);
      yield put({ type: 'getExpertList', payload: { data } });
    },
    *getItemById({ payload }, { call, put }) {
      const { data } = yield call(tobProfileService.getEveryInfo, payload);
      yield put({
        type: 'getItem', payload: { data: data.data },
      })
      ;
    },
    * searchItemByName({ payload }, { call, put }) {
      console.log('searchItemByName', payload);
      const { data } = yield call(tobProfileService.searchEveryInfo, payload);
      yield put({
        type: 'searchInfo', payload: { data: data.data },
      })
      ;
    },
    * deleteItemById({ payload }, { call, put }) {
      const { src, key } = payload;
      const { data } = yield call(tobProfileService.deleteByKey, src, key);
      if (data.status) {
        yield put({ type: 'deleteItem', payload });
      } else {
        console.log('数据操作失败！');
      }
    },

    * addInfo({ payload }, { call, put }) {
      const src = 'ccf';
      const newData = payload;
       newData.email = payload.email.split(';');
      const { data } = yield call(tobProfileService.addExpertInfo, src, newData);
      if (data.status) {
        const addedGetData = yield call(tobProfileService.getExpertInfo, src, 0, 10);
        yield put({ type: 'getExpertList', payload: { data: addedGetData.data } });
      }
      console.log(data);
      yield put({ type: 'addition', payload: { data } });
    },
    * updateInfo({ payload }, { call, put }) {
      const { src, key } = payload;
      const updata = payload.data;
      updata.gender = parseInt(payload.data.gender);
      // updata.email = payload.data.email.join('.');
      const updateData = yield call(tobProfileService.updateByKey, src, key, updata);
      console.log('这里这里这里',updateData);
      yield put({ type: 'updateItem', payload: { updateData } });
    },
  },
  reducers: {
    updateItem(state, { payload: { updateData } }) {
      return { ...state, loading: true };
    },
    getExpertList(state, { payload: { data } }) {
      console.log('整个数据:', data);
      return { ...state, results: data, loading: true };
    },
    getItem(state, { payload: { data } }) {
      return { ...state, extraData: data, loading: true };
    },
    searchInfo(state, { payload: { data } }) {
      const searchState = { ...state };
      searchState.results.data = data;
      return searchState;
    },
    deleteItem(state, { payload }) {
      const data = state.results.data.filter(item => item.id !== payload.key);
      const newState = { ...state };
      newState.results.data = data;
      return newState;
    },
    addition(state, { payload: { data } }) {
      return { ...state, loading: true };
    },
  },
};

