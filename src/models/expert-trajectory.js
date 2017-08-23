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
  },

  subscriptions: {},

  effects: {
    // 直接抄expert-map的，所有剩下的东西都要改。
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
           console.log('(((((((((((((((((((');
           yield put({ type: 'dataFindSuccess', payload: { data } });
         } catch (e) {
           console.error('---- Catch Error: ---- ', e);
           yield put({
             type: 'dataNotFound',
             payload: { message: `'${personId}' Not Found ${e || ''}` },
           });
         }
    },

    * listPersonByIds({ payload }, { call, put }) {  // eslint-disable-line
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
    searchPersonSuccess(state, { payload: { data, query } }) { // state?
      const { result, total } = data;
      console.log('result', result);
      return {
        ...state,
        results: result,
        // pagination: { pageSize: state.pagination.pageSize, total, current },
        loading: false,
      };
    },

    dataFindSuccess(state, { payload }) {
      console.log('hahahahahahhaah', payload);
      /*      const data = payload.data && payload.data.data;
      const kgindex = kgService.indexingKGData(data);
      const kgFetcher = kgService.kgFetcher(data, kgindex);
      // console.log('success findKG, return date is ', data);
      // console.log('indexing it: ', kgindex);
      return { ...state, kgdata: data, kgindex, kgFetcher }; */
    },

    listPersonByIdsSuccess(state, { payload: { data } }) {
      return { ...state, clusterPersons: data.data.persons };
    },
  },
};
