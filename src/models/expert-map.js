/** Created by Bo Gao on 2017-06-07 */
import * as strings from 'utils/strings';
import * as personService from 'services/person';
import * as mapService from 'services/expert-map-service';

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
      let { query } = payload;
      query = strings.cleanQuery(query);
      if (query) {
        const data = yield call(mapService.searchMap, query);
        yield put({ type: 'searchMapSuccess', payload: { data } });
      } else {

      }
    },

    * searchExpertBaseMap({ payload }, { call, put }) {
      const { eb } = payload;
      const data = yield call(mapService.searchExpertBaseMap, eb, 0, 200);
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
        data = [];
        for (let i = 0; i < ids.length; i += 100) {
          const cids = ids.slice(i, i + 100);
          const data1 = yield call(personService.listPersonByIds, cids);
          for (const d of data1.data.persons) {
            data.push(d);
          }
        }
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
      console.log('************************');
      console.log(data);
      return { ...state, clusterPersons: data };
    },

    setRightInfoZoneIds(state, { payload: { idString } }) {
      return { ...state, infoZoneIds: idString };
    },

    setRightInfo(state, { payload: { idString, rightInfoType } }) {
      return { ...state, infoZoneIds: idString, rightInfoType };
    },

    setClusterInfo(state, { payload: { data } }) {
      console.log('@@@@@!!!!!!!!!!!!!!!!111');
      console.log(data);
      return { ...state, clusterPersons: data };
    },

    searchMapSuccess(state, { payload: { data } }) {
      // TODO translate data into target format.
      const geoSearchData = [];
      if (data.data) {
        const geomap = {};
        data.data.cities.map((item) => {
          geomap[item.id] = item;
          return null;
        });
        data.data.data.map((item) => {
          const add = [];
          let fellow;
          if (typeof (item.fellows) !== 'undefined') {
            fellow = item.fellows;
          } else {
            fellow = [];
          }
          let c = item.city;
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
            is_ch: item.is_ch,
            fellows: fellow,
            location: {
              lat: item.lat,
              lng: item.lng,
            },
          });
          return null;
        });
      }
      return { ...state, geoData: { results: geoSearchData } };
    },

  },
};
