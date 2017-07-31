/** Created by Bo Gao on 2017-06-07 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from '../services/publication';
import * as personService from '../services/person';
import * as searchService from '../services/search';

export default {

  namespace: 'expertMap',

  state: {
    personId: '',
    personInfo: {},
    geoData: {},
    // for rightInfoZone,
    infoZoneIds: '', // ids as string slitted by ',';
    clusterPersons: [],
  },

  subscriptions: {},

  effects: {
    * searchMap({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(searchService.searchMap, query);
      yield put({ type: 'searchMapSuccess', payload: { data } });
    },

    * getPersonInfo({ payload }, { call, put }) {  // eslint-disable-line
      // console.log('effects: getPerson', payload);
      const { personId } = payload;
      const data = yield call(personService.getPerson, personId);
      yield put({ type: 'getPersonInfoSuccess', payload: { data } });
    },

    * listPersonByIds({ payload }, { call, put }) {  // eslint-disable-line
      const { ids } = payload;
      const data = yield call(personService.listPersonByIds, ids);
      yield put({ type: 'listPersonByIdsSuccess', payload: { data } });
    },

  },

  reducers: {
    getPersonInfoSuccess(state, { payload: { data } }) {
      return { ...state, personInfo: data.data };
    },

    resetPersonInfo(state) {
      return { ...state, personInfo: {} };
    },

    listPersonByIdsSuccess(state, { payload: { data } }) {
      return { ...state, clusterPersons: data.data.persons };
    },

    setRightInfoZoneIds(state, { payload: { idString } }) {
      return { ...state, infoZoneIds: idString };
    },

    searchMapSuccess(state, { payload: { data } }) {
      // TODO translate data into target format.
      const geoSearchData = [];
      if (data.data) {
        data.data.data.map((item) => {
          geoSearchData.push({
            name: item.n,
            id: item.i,
            location: {
              lat: item.lat,
              lng: item.lng,
            },
          });
          return null;
        });
      }
      // console.log('-----------------------------------', geoSearchData);
      return { ...state, geoData: { results: geoSearchData } };
    },

  },
};
