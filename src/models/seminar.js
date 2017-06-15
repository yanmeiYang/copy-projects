/**
 * Created by yangyanmei on 17/5/26.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp'
import * as seminarService from '../services/seminar';
import * as uconfigService from '../services/universal-config';

export default {
  namespace: 'seminar',

  state: {
    results: [],
    id: null,
    loading: false,
    offset: 0,
    sizePerPage: 20,
    query: '',
    summaryById: [],
    speakerSuggests: [],
    activity_organizer_options: [],
    activity_type: [],
    comments: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
  },

  subscriptions: {
    setup({ dispatch, history }){
      history.listen((location) => {
        if (location.pathname === '/seminar') {
          dispatch({ type: 'getSeminar', payload: { offset: 0, size: 20 } });
        }
        if (location.pathname === '/seminarpost') {
          dispatch({ type: 'getCategory', payload: { category: 'activity_organizer_options' } });
          dispatch({ type: 'getCategory', payload: { category: 'activity_type' } })
        }

        const match = pathToRegexp('/seminar/:id').exec(location.pathname);
        if (match) {
          const id = decodeURIComponent(match[1]);
          dispatch({ type: 'getSeminarByID', payload: { id } });
          dispatch({ type: 'getCommentFromActivity', payload: { id: id, offset: 0, size: 10 } });
        }
      });

    },
  },

  effects: {
    *getSeminar({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
      const { offset, size } = payload;
      const { data } = yield call(seminarService.getSeminar, offset, size);
      yield put({ type: 'getSeminarsSuccess', payload: { data, offset } });
    },
    *getSeminarByID({ payload }, { call, put }){
      const { id } = payload;
      const { data } = yield call(seminarService.getSeminarById, id);
      yield put({ type: 'getSeminarByIDSuccess', payload: { data } });
    },

    *getSpeakerSuggest({ payload }, { call, put }){
      const { data } = yield call(seminarService.getSpeakerSuggest, payload);
      yield put({ type: 'getSpeakerSuggestSuccess', payload: { data } });
    },
    *postSeminarActivity({ payload }, { call, put }){
      const { data } = yield call(seminarService.postSeminarActivity, payload);
      if (data.status) {
        yield put(routerRedux.push({ pathname: `/seminar/` + data.id }))
      }
    },
    *searchActivity({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
      const { query, offset, size } = payload;
      const { data } = yield call(seminarService.searchActivity, query, offset, size);
      yield put({ type: 'searchActivitySuccess', payload: { data, query, offset } });
    },
    *getCategory({ payload }, { call, put }){
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'getCategorySuccess', payload: { data, category } });
    },
    *addKeyAndValue({ payload }, { call, put }) {
      const { key, val } = payload;
      const data = yield call(uconfigService.setByKey, 'activity_organizer_options', decodeURI(key), val);
      if (data.data && data.data.status === true) {
        yield put({ type: 'updateData', payload: { data } });
      } else {
        console.error('addKeyAndValue Error: ', data);
      }
    },
    *deleteActivity({ payload }, { call, put }){
      const { id, body } = payload;
      const { data } = yield call(seminarService.deleteActivity, id, body);
      if (data.status) {
        yield put(routerRedux.push('/seminar'));
      }
    },
    *getCommentFromActivity({ payload }, { call, put }){
      const { id, offset, size } = payload;
      const { data } = yield call(seminarService.getCommentFromActivity, id, offset, size);
      yield  put({ type: 'getCommentFromActivitySuccess', payload: data });
    },
    *addCommentToActivity({ payload }, { call, put }){
      const { id, data } = payload;
      const result = yield call(seminarService.addCommentToActivity, id, data);
      //目前只取前10条评论
      const comments = yield call(seminarService.getCommentFromActivity, id, 0, 10);
      yield  put({ type: 'getCommentFromActivitySuccess', payload: comments.data });
    },
  },

  reducers: {
    getSeminarsSuccess(state, { payload: { data, offset } }){
      return { ...state, results: state.results.concat(data), loading: false, offset: offset + state.sizePerPage };
    },

    getSeminarByIDSuccess(state, { payload: { data } }){
      return { ...state, summaryById: data };
    },

    getSpeakerSuggestSuccess(state, { payload: { data } }){
      console.log(data);
      return { ...state, speakerSuggests: data };
    },
    searchActivitySuccess(state, { payload: { data, query, offset } }){
      return {
        ...state,
        results: state.results.concat(data),
        query: query,
        loading: false,
        offset: offset + state.sizePerPage
      };
    },

    getCategorySuccess(state, { payload: { data, category } }){
      return { ...state, [category]: data }
    },

    updateData(state, { payload: { data } }) {
      return { ...state, activity_organizer_options: data };
    },

    getCommentFromActivitySuccess(state, { payload: { data } }){
      return { ...state, comments: data }
    },

    addCommentToActivitySuccess(state){
      return { ...state }
    },

    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },

  },

};
