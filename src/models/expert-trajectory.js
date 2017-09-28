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
    eachYearHeat: {}, // each year's infomation
    year: '', // current year
    heatData: '',
    startYear: '',
    endYear: '',
    location: [],
    authorImage: '',
    table: [],
    authors: [],
    hindex: [],
    locationName: [],
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
      const data = yield call(traDataFindService.findTrajPerson, personId);
      yield put({ type: 'dataFindSuccess', payload: { data } });
    },

    * heatFind({ payload }, { call, put }) {
      let data;
      const { query } = payload;
      if (query !== '') {
        data = yield call(traDataFindService.findHeatMap, query);
      } else {
        data = yield call(traDataFindService.findTop10000);
      }
      yield put({ type: 'heatFindSuccess',
        payload: {
          heatData: data,
          // location: data.locations,
          // table: data.table,
          // authors: data.authors,
          // locationName: data.locationName,
          // hindex: data.h_index,
      } });
    },

    * eventFind({ payload }, { call, put }) {
      const { yearNow } = payload;
      const data = yield call(traDataFindService.eventFind, yearNow);
      yield put({ type: 'eventFindSuccess', payload: { data, yearNow } });
    },

    * storeHindex({ payload }, { call, put }) {
      const { hindex } = payload;
      yield put({ type: 'hindexSuccess', payload: { hindex } });
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

    * getYearData({ payload }, { call, put, select }) {
      const { year } = payload;
      const yearN = yield select(state => state.expertTrajectory.startYear);
      const table = yield select(state => state.expertTrajectory.table);
      const authors = yield select(state => state.expertTrajectory.authors);
      const authorImage = yield select(state => state.expertTrajectory.authorImage);
      const yearIndex = year - yearN;
      const data = [];
      const nextYearData = [];
      const geoCoordMap = this.doHeatGeoMap();

      const merge = {};
      const nextYear = {};
      const author = {};
      const author2 = {};
      const authorImg = {};
      const authorImgWest = {};
      const authorImgEast = {};
      const authorImgMid = {};
      for (let aid = 0; aid < table.length; aid += 1) { // 当年的数据
        const addressID = table[aid][yearIndex];
        if (addressID) {
          if (!merge[addressID]) { // 统计该地人数
            merge[addressID] = 0;
          }
          merge[addressID] += 1;

          if (!author[addressID]) {
            author[addressID] = [];
          }
          author[addressID].push(authors[aid]);

          if (authorImage[aid]) {
            if (table[aid][yearIndex] in authorImg) { // 取今年各地点的作者id
              authorImg[table[aid][yearIndex]].push(authorImage[aid]);
            } else {
              authorImg[table[aid][yearIndex]] = [];
              authorImg[table[aid][yearIndex]].push(authorImage[aid]);
            }
          }
        }
        // 第二年数据
        if (yearIndex < (this.state.endYear - this.state.startYear)) {
          const addressID2 = table[aid][yearIndex + 1];
          if (addressID2 && !merge[addressID2]) {
            if (!nextYear[addressID2]) {
              nextYear[addressID2] = 0;
            }
            nextYear[addressID2] += 1;
          }

          if (!author2[addressID2]) {
            author2[addressID2] = [];
          }
          author2[addressID2].push(authors[aid]);
        }
      }

      for (const key in merge) { // 当年的地点、人数数据
        const onenode = { name: key, value: merge[key] };
        data.push(onenode);
      }

      if (yearIndex < (this.state.endYear - this.state.startYear)) {
        for (const key in nextYear) {
          const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
          nextYearData.push(onenode);
        }
      }

      data.sort(this.sortValue);
      nextYearData.sort(this.sortValue);
      let data1 = []; // data1为人数前100地点数据， data2为100以后
      let p;
      // console.log('datasp', datas[0]);
      // console.log(datas[0].value);
      if (data.length > 10) {
        for (p = 0; data[p].value > 1 && p < 100; p += 1) {
          data1.push(data[p]);
        }
      } else {
        data1 = data;
      }
      const data2 = data.slice(p);

      // console.log('authorImg', authorImg);
      Object.keys(authorImg).map((key) => {
        // console.log('geoCOooiejijf', geoCoordMap[key]);
        if (geoCoordMap[key][0] < (-30)) {
          // console.log('come to west');
          authorImgWest[key] = authorImg[key];
        } else if (geoCoordMap[key][0] >= -30 && geoCoordMap[key][0] <= 70) {
          authorImgMid[key] = authorImg[key];
        } else if (geoCoordMap[key][0] > 70) {
          authorImgEast[key] = authorImg[key];
        }
      });

      yield put({ type: 'getPerYearHeatDataSuccess',
        payload: { year, geoCoordMap, data, yearIndex, nextYearData, data1, data2, authorImgWest, authorImgMid, authorImgEast },
      });
    },


  },

  reducers: {
    getPerYearHeatDataSuccess(state, { payload: { year, geoCoordMap, data, yearIndex, nextYearData, data1, data2, authorImgWest, authorImgMid, authorImgEast } }) {
      const yearHeat = state.eachYearHeat;
      yearHeat[year].geoCoordMap = geoCoordMap;
      yearHeat[year].data = data;
      yearHeat[year].yearIndex = yearIndex;
      yearHeat[year].nextYearData = nextYearData;
      yearHeat[year].data1 = data1;
      yearHeat[year].data2 = data2;
      yearHeat[year].authorImgWest = authorImgWest;
      yearHeat[year].authorImgMid = authorImgMid;
      yearHeat[year].authorImgEast = authorImgEast;

      return { ...state, eachYearHeat: yearHeat };
    },

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

    heatFindSuccess(state, { payload: { heatData } }) {
      const location = heatData.locations;
      const startYear = heatData.startYear;
      const endYear = heatData.endYear;
      const table = heatData.table;
      const authors = heatData.authors;
      const authorImage = heatData.authorImage;
      const locationName = heatData.locationName;
      const hindex = heatData.h_index;
      console.log('authors', authors);
      return {
        ...state,
        heatData,
        location,
        startYear,
        authorImage,
        endYear,
        table,
        authors,
        locationName,
        hindex,
      };
    },

    dataFindSuccess(state, { payload: { data } }) {
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

    hindexSuccess(state, { payload: { hindex } }) {
      return {
        ...state,
        hindex,
      };
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
