/**
 * Created by yangyanmei on 17/5/26.
 */
import pathToRegexp from 'path-to-regexp'
import * as seminarService from '../services/seminar';

export default {
  namespace: 'seminar',

  state: {
    results: [],
    id: null,
    summaryById: [],
    speakerSuggests: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      pageSize: 30,
      total: null,
    },
  },

  subscriptions: {
    setup({ dispatch, history }){
      history.listen((location) => {
        if (location.pathname === '/seminar') {
          dispatch({ type: 'getSeminar', payload: { offset: 0, size: 20 } });
        }

        const match = pathToRegexp('/seminar/:id').exec(location.pathname);
        if (match) {
          const id = decodeURIComponent(match[1]);
          dispatch({ type: 'getSeminarByID', payload: { id } });
        }
      });

    },
  },

  effects: {
    *getSeminar({ payload }, { call, put }){
      const { offset, size } = payload;
      const { data } = yield call(seminarService.getSeminar, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data } });
    },
    *getSeminarByID({ payload }, { call, put }){
      const { id } = payload;
      const { data } = yield call(seminarService.getSeminarById, id);
      yield put({ type: 'getSeminarByIDSuccess', payload: { data } });
    },

    *getSpeakerSuggest({ payload }, { call, put }){
      const { data } = yield call(seminarService.getSpeakerSuggest, payload);
      yield put({ type: 'getSpeakerSuggestSuccess', payload: { data } });
    }
  },

  reducers: {
    getSeminarsSuccess(state, { payload: { data } }){
      return { ...state, results: data };
    },

    getSeminarByIDSuccess(state, { payload: { data } }){
      console.log(data);
      return { ...state, summaryById: data };
    },

    getSpeakerSuggestSuccess(state, { payload: { data } }){
      console.log(data);
      return { ...state, speakerSuggests: data };
    }
  },

};
