/** Created by Bo Gao on 2017-06-07 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';
import * as personService from '../services/person';
import * as searchService from '../services/search';
import * as traDataFindService from '../services/expert-trajectory-service';

const cache = {};

export default {

  namespace: 'expertTrajectory',

  state: {
    results: [],
    personId: '',
    personInfo: {},
    geoData: {},
    // for rightInfoZone,
    infoZoneIds: '', // ids as string slitted by ',';
    clusterPersons: [],
    loading: false, // TODO remove loading, use global loading compoennt.\
    yearMessage: [],
    year: '',
  },

  subscriptions: {},

  effects: {
    * searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query } = payload;
      const { data } = yield call(searchService.searchPerson, query);
      yield put({ type: 'searchPersonSuccess', payload: { data, query } });
    },

    * dataFind({ payload }, { call, put }) {
      console.log('enter kfFind, with query:', payload);
      const { personId } = payload;
      try {
        const data = yield call(traDataFindService.dataFind, personId);
        yield put({ type: 'dataFindSuccess', payload: { data } });
      } catch (e) {
        console.error('---- Catch Error: ---- ', e);
        yield put({
          type: 'dataNotFound',
          payload: { message: `'${personId}' Not Found ${e || ''}` },
        });
      }
    },

    * eventFind({ payload }, { call, put }) {
      const { yearNow } = payload;
      const data = yield call(traDataFindService.eventFind, yearNow);
      yield put({ type: 'eventFindSuccess', payload: { data, yearNow } });
    },

    * listPersonByIds({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'showLoading' });
      const { ids } = payload;
      let data = cache[ids];
      if (!data) {
        data = yield call(personService.listPersonByIds, ids);
        cache[ids] = data;
      }
      yield put({ type: 'listPersonByIdsSuccess', payload: { data } });
    },

  },

  reducers: {
    setRightInfo(state, { payload: { rightInfoType } }) {
      return { ...state, infoZoneIds: rightInfoType };
    },

    searchPersonSuccess(state, { payload: { data, query } }) { // state?
      const { result, total } = data;
      return {
        ...state,
        results: result,
        // pagination: { pageSize: state.pagination.pageSize, total, current },
        loading: false,
      };
    },

    dataFindSuccess(state, { payload }) {
      /*      const data = payload.data && payload.data.data;
      const kgindex = kgService.indexingKGData(data);
      const kgFetcher = kgService.kgFetcher(data, kgindex);
      // console.log('success findKG, return date is ', data);
      // console.log('indexing it: ', kgindex);
      return { ...state, kgdata: data, kgindex, kgFetcher }; */
    },

    eventFindSuccess(state, { payload: { data, yearNow } }) {
      const newMassage = state.yearMessage;
      newMassage.push({
        year: yearNow,
        events: data,
      });
      return { ...state, yearMessage: newMassage };
    },

    listPersonByIdsSuccess(state, { payload: { data } }) {
      return { ...state, clusterPersons: data.data.persons, loading: false };
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
