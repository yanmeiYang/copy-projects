/**
 * Created by yangyanmei on 17/8/21.
 */
import * as tobProfileService from '../../services/2b-profile';

export default {
  namespace: 'tobProfile',

  state: {
    results: [],
    extraData: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tobprofile') {
          dispatch({
            type: 'getProfile',
            payload: { offset: 0, size: 20 },
            // payload: { src: '', offset: 0, size: 20 },
          });
        }
      });
    },
  },

  effects: {
    * getProfile({ payload }, { call, put }) {
      const { offset, size } = payload;
      const { data } = yield call(tobProfileService.getProfileSuccess, offset, size);
      yield put({ type: 'getProfileSuccess', payload: { data } });
    },
    * getProfileById({ payload }, { call, put }) {
      const { data } = yield call(tobProfileService.getProfileByIdSuccess, payload);
      yield put({
        type: 'getProfilesById', payload: { data: data.data },
      })
      ;
    },
    * search({ payload }, { call, put }) {
      const { data } = yield call(tobProfileService.searchSuccess, payload);
      yield put({
        type: 'searchProfile', payload: { data: data.data },
      })
      ;
    },
    * deleteProfileById({ payload }, { call, put }) {
      const { key } = payload;
      const { data } = yield call(tobProfileService.deleteByKey, key);
      if (data.status) {
        yield put({ type: 'deleteProfile', payload });
      } else {
        console.log('数据操作失败！');
      }
    },

    * addProfile({ payload }, { call, put }) {
      const newData = payload;
       newData.email = payload.email.split(';');
      const { data } = yield call(tobProfileService.addProfileSuccess, newData);
      // const { data } = yield call(tobProfileService.addProfileSuccess, src, newData);
      if (data.status) {
        const addedGetData = yield call(tobProfileService.addProfileSuccess, 0, 10);
        // const addedGetData = yield call(tobProfileService.addProfileSuccess, src, 0, 10);
        yield put({ type: 'getProfile', payload: { data: addedGetData.data } });
      }
      yield put({ type: 'addition', payload: { data } });
    },
    * updateProfile({ payload }, { call, put }) {
      const { key } = payload;
      const updata = payload.data;
      updata.gender = parseInt(payload.data.gender);
      const updateData = yield call(tobProfileService.updateProfileSuccess, key, updata);
      yield put({ type: 'updateProfiles', payload: { updateData } });
    },
  },
  reducers: {
    updateProfiles(state, { payload: { updateData } }) {
      return { ...state, loading: true };
    },
    getProfileSuccess(state, { payload: { data } }) {
      return { ...state, results: data, loading: true };
    },
    getProfilesById(state, { payload: { data } }) {
      return { ...state, extraData: data, loading: true };
    },
    searchProfile(state, { payload: { data } }) {
      const searchState = { ...state };
      searchState.results.data = data;
      return searchState;
    },
    deleteProfile(state, { payload }) {
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

