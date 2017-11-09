/**
 * Created by yangyanmei on 17/5/26.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { sysconfig } from '../systems';
// import { config } from '../utils';
import * as seminarService from '../services/seminar';
import * as uconfigService from '../services/universal-config';
import * as personService from '../services/person';
import { takeLatest } from './helper';

export default {
  namespace: 'seminar',

  state: {
    results: [],
    id: null,
    loading: false,
    offset: 0,
    sizePerPage: 20,
    query: '',
    summaryById: {},
    speakerSuggests: [],
    selectedSuggestSpeaker: {},
    activity_organizer_options: [], // 用户手动输入的org
    postSeminarOrganizer: [], // 所有活动类型的合集
    orgcategory: {}, // 活动类型
    activity_type: {}, // 活动类型
    orgByActivity: {},
    contribution_type: [],
    comments: [],
    expertRating: [],
    tags: [],
    topMentionedTags: {},
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // if (location.pathname === '/seminar') {
        //   dispatch({
        //     type: 'getSeminar',
        //     payload: { offset: 0, size: 20, filter: { src: sysconfig.SOURCE } },
        //   });
        //   dispatch({ type: 'getTopMentionedTags', payload: { src: sysconfig.SOURCE, num: 10 } });
        // }
        // if (location.pathname === '/seminar-post') {
        //   dispatch({
        //     type: 'getCategoriesHint',
        //     payload: { category: 'orglist_' },
        //   });
        // }
        const expertRating = pathToRegexp('/seminar/expert-rating/:id').exec(location.pathname);
        const match = pathToRegexp('/seminar/:id').exec(location.pathname);
        if (match || expertRating) {
          const id = match ? decodeURIComponent(match[1]) : decodeURIComponent(expertRating[1]);
          dispatch({ type: 'getSeminarByID', payload: { id } });
          dispatch({ type: 'getCommentFromActivity', payload: { id, offset: 0, size: 10 } });
        }
      });
    },
  },

  effects: {
    getSeminar: [function* ({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { offset, size, filter } = payload;
      const { data } = yield call(seminarService.getSeminar, offset, size, filter);
      yield put({ type: 'getSeminarsSuccess', payload: { data, offset, size } });
    }, takeLatest],

    * getSeminarByID({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      yield put({ type: 'clearState' });
      const { id } = payload;
      const { data } = yield call(seminarService.getSeminarById, id);
      const listActivityScores = yield call(seminarService.listActivityScores, 'me', sysconfig.SOURCE, id);
      yield put({ type: 'listActivityScoresSuccess', payload: listActivityScores.data });
      yield put({ type: 'getSeminarByIDSuccess', payload: { data } });
    },

    * getSpeakerSuggest({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(seminarService.getSpeakerSuggest, payload);
      yield put({ type: 'getSpeakerSuggestSuccess', payload: { data } });
    },
    * postSeminarActivity({ payload }, { call, put }) {
      const { data } = yield call(seminarService.postSeminarActivity, payload);
      if (data.status) {
        yield put(routerRedux.push({ pathname: `/seminar/${data.id}` }));
      }
    },
    * searchActivity({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query, offset } = payload;
      const { data } = yield call(seminarService.searchActivity, payload);
      yield put({ type: 'searchActivitySuccess', payload: { data, query, offset } });
    },
    * getCategory({ payload }, { call, put }) {
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'getCategorySuccess', payload: { data, category } });
    },
    getOrgList: [function* ({ payload }, { call, put }) {
      const { category } = payload;
      const data = yield call(uconfigService.listByCategory, category);
      yield put({ type: 'getCategorySuccess', payload: { data, category } });
    }, takeLatest],
    * addKeyAndValue({ payload }, { call, put }) {
      const { key, val } = payload;
      const data = yield call(uconfigService.setByKey, 'activity_organizer_options', decodeURI(key), val);
      // if (data.data && data.data.status === true) {
      //   yield put({ type: 'updateData', payload: { data } });
      // } else {
      //   console.error('addKeyAndValue Error: ', data);
      // }
    },
    * deleteActivity({ payload }, { call }) {
      const { id, body } = payload;
      yield call(seminarService.deleteActivity, id, body);
      // if (data.status) {
      //   yield put(routerRedux.push('/seminar'));
      // }
    },
    * getCommentFromActivity({ payload }, { call, put }) {
      const { id, offset, size } = payload;
      const { data } = yield call(seminarService.getCommentFromActivity, id, offset, size);
      yield put({ type: 'getCommentFromActivitySuccess', payload: data });
    },
    * addCommentToActivity({ payload }, { call, put }) {
      const { id, data } = payload;
      yield call(seminarService.addCommentToActivity, id, data);
      // 目前只取前10条评论
      const comments = yield call(seminarService.getCommentFromActivity, id, 0, 10);
      yield put({ type: 'getCommentFromActivitySuccess', payload: comments.data });
    },
    * deleteCommentFromActivity({ payload }, { call, put }) {
      const { cid, id } = payload;
      const deleteComment = yield call(seminarService.deleteCommentFromActivity, cid);
      if (deleteComment.data.status) {
        // 目前只取前10条评论
        const { data } = yield call(seminarService.getCommentFromActivity, id, 0, 10);
        yield put({ type: 'getCommentFromActivitySuccess', payload: data });
      } else {
        console.log('deleteComment Error:', deleteComment.data);
      }
    },
    * updateOrSaveActivityScore({ payload }, { call, put }) {
      const { src, actid, aid, key, score, lvtime } = payload;
      yield call(seminarService.updateOrSaveActivityScore, src, actid, aid, key, score, lvtime);
      const { data } = yield call(seminarService.listActivityScores, 'me', sysconfig.SOURCE, actid);
      yield put({ type: 'listActivityScoresSuccess', payload: data });
    },
    * listActivityScores({ payload }, { call, put }) {
      const { uid, src, actid } = payload;
      const { data } = yield call(seminarService.listActivityScores, uid, src, actid);
      yield put({ type: 'listActivityScoresSuccess', payload: data });
    },
    * keywordExtraction({ payload }, { call, put }) {
      const { data } = yield call(seminarService.keywordExtraction, payload);
      yield put({ type: 'getTagsByContent', payload: data });
    },
    * getTopMentionedTags({ payload }, { call, put }) {
      const { src, num } = payload;
      const data = yield call(seminarService.getTopMentionedTags, src, num);
      yield put({ type: 'getTopMentionedTagsSuccess', data });
    },
    // 输入多个id，返回对应的承办单位
    * getCategoryGroup({ payload }, { call, put }) {
      const { groupCategory, categoryTemplate, coOrgCategory } = payload;
      const data = yield call(uconfigService.listByCategory, groupCategory);
      if (data && data.data && data.data.data) {
        let categories = '';
        const parentOptions = [];
        data.data.data.map((item) => {
          const newCategory = categoryTemplate
            .replace('{id}', item.id);
          categories += `${newCategory}.`;
          parentOptions.push({
            value: item.key,
            label: item.key,
            children: [],
            id: categoryTemplate.replace('{id}', item.id),
          });
          return true;
        });
        if (coOrgCategory) {
          parentOptions.push({
            value: '协办单位',
            label: '协办单位',
            children: [],
            id: coOrgCategory,
          });
          categories += coOrgCategory;
        }
        const getOrgByCategoryList =
          yield call(uconfigService.listConfigsByCategoryList, categories);
        yield put({
          type: 'setCoOrg',
          payload: { coOrgCategory, parentOptions, getOrgByCategoryList },
        });
      }
    },
    // *getCategoriesHint({ payload }, { call, put }) {
    //   const { category } = payload;
    //   const suggestCategory = yield call(uconfigService.getCategoriesHint, category);
    //   if (suggestCategory.data.categories.length > 0) {
    //     for (const orgList of suggestCategory.data.categories) {
    //       const { data } = yield call(uconfigService.listByCategory, orgList);
    //       yield put({ type: 'getAllOrgSuccess', payload: { data, orgList } });
    //     }
    //   }
    // },
    *updateSeminarActivity({ payload }, { call, put }) {
      const seminarId = payload.id;
      const { data } = yield call(seminarService.updateSeminarActivity, payload);
      if (data.status) {
        yield put(routerRedux.push({ pathname: `/seminar/${seminarId}` }));
      }
    },
    * saveSuggestExpert({ payload }, { call, put }) {
      const { speaker } = payload;
      const id = speaker.payload.id;
      const { data } = yield call(personService.getPerson, id);
      const emailStr = yield call(personService.personEmailStr, id);
      if (data && emailStr.data.status) {
        const email = emailStr.data.email;
        yield put({
          type: 'saveSuggestExpertSuccess', payload: { speaker, data, email },
        })
        ;
      }
    },
  },

  reducers: {
    clearState(state) {
      return { ...state, summaryById: {}, expertRating: [], results: [], orgByActivity: {} };
    },

    getSeminarsSuccess(state, { payload: { data, offset, size } }) {
      let newData = [];
      if (state.results.length >= size && offset !== 0) {
        newData = state.results.concat(data);
      } else if (offset === 0) {
        newData = data;
      } else {
        newData = state.results;
      }
      return { ...state, results: newData, loading: false, offset: offset + state.sizePerPage };
    },

    getSeminarByIDSuccess(state, { payload: { data } }) {
      return { ...state, summaryById: data, loading: false };
    },

    getSpeakerSuggestSuccess(state, { payload: { data } }) {
      return { ...state, speakerSuggests: data, loading: false };
    },

    emptySpeakerSuggests(state) {
      return { ...state, speakerSuggests: [] };
    },

    searchActivitySuccess(state, { payload: { data, query, offset } }) {
      let results = [];
      if (offset === 0) {
        results = data;
      } else {
        results = state.results.concat(data);
      }
      return {
        ...state,
        results,
        query,
        loading: false,
        offset: offset + state.sizePerPage,
      };
    },

    getCategorySuccess(state, { payload: { data, category } }) {
      if (category === 'orgcategory' || category === 'activity_type'
        || category === 'activity_organizer_options' || category === 'contribution_type') {
        return { ...state, [category]: data.data };
      } else if (category.includes('orglist_')) {
        return { ...state, orgByActivity: data.data };
      } else {
        return { ...state };
      }
    },
    // getAllOrgSuccess(state, { payload: { data } }) {
    //   const org = state.postSeminarOrganizer.concat(data.data);
    //   return {
    //     ...state,
    //     postSeminarOrganizer: org,
    //   };
    // },
    updateData(state, { payload: { data } }) {
      const newOrgList = state.activity_organizer_options.data.concat(data.data);
      return {
        ...state,
        activity_organizer_options: newOrgList,
      };
    },

    getCommentFromActivitySuccess(state, { payload: { data } }) {
      return { ...state, comments: data };
    },

    listActivityScoresSuccess(state, { payload: { data } }) {
      return { ...state, expertRating: data };
    },

    addCommentToActivitySuccess(state) {
      return { ...state };
    },
    getTagsByContent(state, { payload }) {
      const words = [];
      payload.keywords.map((keyword) => {
        return words.push(keyword.word);
      });
      return { ...state, tags: words };
    },
    getTopMentionedTagsSuccess(state, { data }) {
      return { ...state, topMentionedTags: data };
    },
    cancleSuggestExpert(state, { payload }) {
      return { ...state, selectedSuggestSpeaker: payload };
    },
    saveSuggestExpertSuccess(state, { payload: { speaker, data, email } }) {
      speaker.bio = data.contact.bio ? data.contact.bio : '';
      speaker.phone = data.contact.phone ? data.contact.phone : '';
      speaker.email = email;
      return { ...state, selectedSuggestSpeaker: speaker };
    },
    setCoOrg(state, { payload: { coOrgCategory, getOrgByCategoryList, parentOptions } }) {
      parentOptions.map((item) => {
        getOrgByCategoryList.data.data[item.id].map((children) => {
          item.children.push({ label: children.key, value: children.key, id: children.id });
          return true;
        });
        return true;
      });
      return {
        ...state,
        postSeminarOrganizer: parentOptions.filter(item => item.id !== coOrgCategory),
        activity_organizer_options: parentOptions,
      };
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
