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
    expertRating: [],
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
  },

  subscriptions: {
    setup({ dispatch, history }){
      history.listen((location) => {
        if (location.pathname === '/seminar') {
          dispatch({ type: 'getSeminar', payload: { offset: 0, size: 20, filter: { src: 'ccf' } } });
        }
        if (location.pathname === '/seminarpost') {
          dispatch({ type: 'getCategory', payload: { category: 'activity_organizer_options' } });
          dispatch({ type: 'getCategory', payload: { category: 'activity_type' } });
          dispatch({ type: 'app/getCurrentUserInfo' });
        }

        const expertRating = pathToRegexp('/seminar/expert-rating/:id').exec(location.pathname);
        const match = pathToRegexp('/seminar/:id').exec(location.pathname);
        if (match || expertRating) {
          const id = match ? decodeURIComponent(match[1]) : decodeURIComponent(expertRating[1]);
          dispatch({ type: 'getSeminarByID', payload: { id } });
          // dispatch({ type: 'listActivityScores', payload: { uid: 'me', src: 'ccf', actid: id } });
          dispatch({ type: 'getCommentFromActivity', payload: { id: id, offset: 0, size: 10 } });

        }
      });

    },
  },

  effects: {
    *getSeminar({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
      const { offset, size, filter } = payload;
      const { data } = yield call(seminarService.getSeminar, offset, size, filter);
      yield put({ type: 'getSeminarsSuccess', payload: { data, offset, size } });
    },
    *getSeminarByID({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
      yield put({ type: 'clearState' });
      const { id } = payload;
      const { data } = yield call(seminarService.getSeminarById, id);
      const listActivityScores = yield call(seminarService.listActivityScores, 'me', 'ccf', id);
      yield put({ type: 'listActivityScoresSuccess', payload: listActivityScores.data });
      yield put({ type: 'getSeminarByIDSuccess', payload: { data } });
    },

    *getSpeakerSuggest({ payload }, { call, put }){
      yield put({ type: 'showLoading' });
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
      const { query, offset, size, src} = payload;
      const { data } = yield call(seminarService.searchActivity, query, offset, size, src);
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
    *deleteCommentFromActivity({ payload }, { call, put }){
      const { cid, id } = payload;
      const deleteComment = yield call(seminarService.deleteCommentFromActivity, cid);
      if (deleteComment.data.status) {
        //目前只取前10条评论
        const { data } = yield call(seminarService.getCommentFromActivity, id, 0, 10);
        yield  put({ type: 'getCommentFromActivitySuccess', payload: data });
      }
      else {
        console.log('deleteComment Error:', deleteComment.data)
      }
    },
    *updateOrSaveActivityScore({ payload }, { call, put }){
      const { src, actid, aid, key, score, lvtime } = payload;
      yield call(seminarService.updateOrSaveActivityScore, src, actid, aid, key, score, lvtime);
      const { data } = yield call(seminarService.listActivityScores, 'me', 'ccf', actid);
      yield put({ type: 'listActivityScoresSuccess', payload: data });
    },
    *listActivityScores({ payload }, { call, put }){
      const { uid, src, actid } = payload;
      const { data } = yield call(seminarService.listActivityScores, uid, src, actid);
      yield put({ type: 'listActivityScoresSuccess', payload: data });
    }
  },

  reducers: {
    clearState(state){
      return { ...state, summaryById: [], expertRating: [], results: [] }
    },

    getSeminarsSuccess(state, { payload: { data, offset, size } }){
      let newData = [];
      if (state.results.length >= size) {
        newData = state.results.concat(data)
      } else {
        newData = data
      }
      return { ...state, results: newData, loading: false, offset: offset + state.sizePerPage };
    },

    getSeminarByIDSuccess(state, { payload: { data } }){
      return { ...state, summaryById: data, loading: false };
    },

    getSpeakerSuggestSuccess(state, { payload: { data } }){
      return { ...state, speakerSuggests: data, loading: false };
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
      return { ...state, [category]: data.data }
    },

    updateData(state, { payload: { data } }) {
      return { ...state, activity_organizer_options: data };
    },

    getCommentFromActivitySuccess(state, { payload: { data } }){
      return { ...state, comments: data }
    },

    listActivityScoresSuccess(state, { payload: { data } }){
      return { ...state, expertRating: data }
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
