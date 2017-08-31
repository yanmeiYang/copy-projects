/** Created by Bo Gao on 2017-06-07 */
import * as personService from '../services/person';
import * as searchService from '../services/search';

const cache = {};

export default {

  namespace: 'expertMap',

  state: {
    personId: '',
    personInfo: {},
    geoData: {},
    // for rightInfoZone,
    rightInfoType: 'global', // global, person, cluster
    infoZoneIds: '', // ids as string splitted by ',' or one id.;
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
      const { personId } = payload;
      let data = cache[personId];
      if (!data) {
        data = yield call(personService.getPerson, personId);
        cache[personId] = data;
      }
      yield put({ type: 'getPersonInfoSuccess', payload: { data } });
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

    setRightInfo(state, { payload: { idString, rightInfoType } }) {
      return { ...state, infoZoneIds: idString, rightInfoType };
    },

    searchMapSuccess(state, { payload: { data } }) {
      // TODO translate data into target format.
      const geoSearchData = [];
      if (data.data) {
        const geomap = {};
        data.data.cities.map((item) => {
          geomap[item.id] = item;
          return null;
        })
        data.data.data.map((item) => {
          const add = [];
          let c = item.city;
          // console.log(geomap[c]);
          while (true) {
            add.push(geomap[c].name);
            if (geomap[c].parent_id === 0 || typeof (geomap[c].parent_id) === 'undefined') {
              break;
            } else {
              c = geomap[c].parent_id;
            }
          }
          geoSearchData.push({
            name: item.n,
            id: item.i,
            country: geomap[item.country],
            city: geomap[item.city],
            name_zh: item.n_zh,
            longaddress: add,
            hindex: item.h,
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
