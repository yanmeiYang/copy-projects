/** Created by Bo Gao on 2017-06-07 */
import pathToRegexp from 'path-to-regexp';
import * as pubsService from 'services/publication';
import * as personService from 'services/person';
import * as searchService from 'services/search';
import * as traDataFindService from 'services/expert-trajectory-service';

const cache = {};

export default {

  namespace: 'expertTrajectory',

  state: {
    trajData: {},
    results: [],
    heatData: [],

    /**************************上面的有主啦！*************************************/
    personId: '',
    personInfo: {},
    // geoData: {},
    // for rightInfoZone,
    infoZoneIds: '', // ids as string slitted by ',';
    clusterPersons: [],
    loading: false, // TODO remove loading, use global loading compoennt.\
    yearMessage: [],
    eachYearHeat: {}, // each year's infomation
    year: '', // current year
    // heatData: '',
    startYear: '',
    endYear: '',
    location: [],
    authorImage: '',
    table: [],
    authors: [],
    hindex: [],
    locationName: [],
    geoCoordMap: {},
    allMessage: [],
    // yearHeat: {},
  },

  subscriptions: {},

  effects: {
    * searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { query, offset, size } = payload;
      const { data } = yield call(searchService.searchPerson, query, offset, size);
      yield put({ type: 'searchPersonSuccess', payload: { data, query } });
    },

    * findTrajById({ payload }, { call, put }) {
      console.log('enter kfFind, with query:', payload);
      const { personId, start, end } = payload; //注意是两边的名字要一致，否则错误
      const data = yield call(traDataFindService.findTrajPerson, personId, start, end);
      yield put({ type: 'findTrajByIdSuccess', payload: { data } });
    },

    * findTrajsByRosterId({ payload }, { call, put }) {
      const { rosterId, start, end, size } = payload;
      const data = yield call(traDataFindService.findTrajsHeat, rosterId, start, end, size);
      yield put({ type: 'findTrajsByRosterIdSuccess', payload: { data } });
    },


    /*********************************
     *
     * 上面的是验证过的函数
     *
     * *********************************
     */
    * heatFind({ payload }, { call, put }) {
      let data;
      const { query } = payload;
      if (query !== '') {
        console.log("query !== '");
        data = yield call(traDataFindService.findHeatMap, query);
      } else {
        data = yield call(traDataFindService.findTop10000Data);
      }
      console.log('dataà1', data);
      const location = data.locations;
      const startYear = data.startYear;
      const endYear = data.endYear;
      const table = data.table;
      const authors = data.authors;
      const authorImage = data.authorImage;
      const locationName = data.locationName;
      const hindex = data.h_index;
      console.log();
      yield put({
        type: 'heatFindSuccess',
        payload: {
          location,
          startYear,
          endYear,
          table,
          authors,
          authorImage,
          locationName,
          hindex,
        }
      });
    },

    * eventFind({ payload }, { call, put }) {
      let data;
      const { query } = payload;
      if (query !== '') {
        data = yield call(traDataFindService.eventTop10000Find);
      } else {
        console.log('hahah');
        data = yield call(traDataFindService.eventTop10000Find);
      }
      console.log('event', data);
      yield put({ type: 'eventFindSuccess', payload: { data } });
    },

    // * storeHindex({ payload }, { call, put }) {
    //   const { hindex } = payload;
    //   yield put({ type: 'hindexSuccess', payload: { hindex } });
    // },
    //
    // * storeAid({ payload }, { call, put }) {
    //   const { authors, startYear, locationName } = payload;
    //   yield put({ type: 'aidSuccess', payload: { authors, startYear, locationName } });
    // },
    //
    // * storeTable({ payload }, { call, put }) {
    //   const { table } = payload;
    //   yield put({ type: 'tableSuccess', payload: { table } });
    // },

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
      yield put({ type: 'oneEventFindSuccess', payload: { year } });
      const yearStart = yield select(state => state.expertTrajectory.startYear);
      const yearEnd = yield select(state => state.expertTrajectory.endYear);
      const table = yield select(state => state.expertTrajectory.table);
      const authors = yield select(state => state.expertTrajectory.authors);
      const authorImage = yield select(state => state.expertTrajectory.authorImage);
      const location = yield select(state => state.expertTrajectory.location);
      const yearIndex = year - yearStart;
      const data = [];
      const nextYearData = [];
      const geoCoordMap = doHeatGeoMap(location);
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
        if (yearIndex < (yearEnd - yearStart)) {
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

      if (yearIndex < (yearEnd - yearStart)) {
        for (const key in nextYear) {
          const onenode = { name: key, value: nextYear[key] }; // 实际数据中乘20应删去！
          nextYearData.push(onenode);
        }
      }

      data.sort(sortValue);
      nextYearData.sort(sortValue);
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

      Object.keys(authorImg).map((key) => {
        if (geoCoordMap[key][0] < (-30)) {
          authorImgWest[key] = authorImg[key];
        } else if (geoCoordMap[key][0] >= -30 && geoCoordMap[key][0] <= 70) {
          authorImgMid[key] = authorImg[key];
        } else if (geoCoordMap[key][0] > 70) {
          authorImgEast[key] = authorImg[key];
        }
      });

      yield put({
        type: 'getPerYearHeatDataSuccess',
        payload: {
          year,
          geoCoordMap,
          data,
          yearIndex,
          nextYearData,
          data1,
          data2,
          authorImgWest,
          authorImgMid,
          authorImgEast,
          author,
          author2
        },
      });
    },


  },

  reducers: {
    findTrajByIdSuccess(state, { payload: { data } }) {
      return { ...state, trajData: data };
    },


    findTrajsByRosterIdSuccess(state, { payload: { data } }) {
      console.log(data);
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      return { ...state, heatData: data };
    },

    /***********************************************************************
     *
     * 上面是验证过的函数
     *
     * **********************************************************************
     */

    getPerYearHeatDataSuccess(state, { payload: { year, geoCoordMap, data, yearIndex, nextYearData, data1, data2, authorImgWest, authorImgMid, authorImgEast, author, author2 } }) {
      const yearHeat = state.eachYearHeat;
      yearHeat[year] = {};
      yearHeat[year].data = data;
      yearHeat[year].geoCoordMap = geoCoordMap;
      yearHeat[year].yearIndex = yearIndex;
      yearHeat[year].nextYearData = nextYearData;
      yearHeat[year].data1 = data1;
      yearHeat[year].data2 = data2;
      yearHeat[year].authorImgWest = authorImgWest;
      yearHeat[year].authorImgMid = authorImgMid;
      yearHeat[year].authorImgEast = authorImgEast;
      yearHeat[year].author = author;
      yearHeat[year].author2 = author2;
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

    heatFindSuccess(state, { payload: { heatData, location, startYear, authorImage, endYear, table, authors, locationName, hindex } }) {
      // console.log('startYear', startYear);
      // const location = heatData.locations;
      // const startYear = heatData.startYear;
      // const endYear = heatData.endYear;
      // const table = heatData.table;
      // const authors = heatData.authors;
      // const authorImage = heatData.authorImage;
      // const locationName = heatData.locationName;
      // const hindex = heatData.h_index;
      // console.log('authors', authors);
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

    eventFindSuccess(state, { payload: { data } }) {
      data = data.data;
      const allData = [];
      for (let i = 0; i < data.length; i += 1) {
        const tempData = {};
        const year = parseInt(Object.keys(data[i])[0]);
        tempData.year = year;
        tempData.events = data[i][year];
        allData.push(tempData);
      }
      return { ...state, allMessage: allData };
      // return { ...state, allMessage: data };
    },

    oneEventFindSuccess(state, { payload: { year } }) {
      const allYearMesRaw = state.allMessage;
      const allYearMes = {};
      for (let i = 0; i < allYearMesRaw.length; i += 1) {
        allYearMes[allYearMesRaw[i].year] = allYearMesRaw[i].events;
      }
      const newMessage = state.yearMessage;
      newMessage.push({
        year,
        events: allYearMes[year],
      });
      return { ...state, yearMessage: newMessage };
    },

    // hindexSuccess(state, { payload: { hindex } }) {
    //   return {
    //     ...state,
    //     hindex,
    //   };
    // },
    //
    // aidSuccess(state, { payload: { authors, startYear, locationName } }) {
    //   return {
    //     ...state,
    //     authors,
    //     startYear,
    //     locationName,
    //   };
    // },
    //
    // tableSuccess(state, { payload: { table } }) {
    //   return {
    //     ...state,
    //     table,
    //   };
    // },

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

function doHeatGeoMap(location) { // 存储经纬度 geoCoordMap = {123:[116,40]}
  const geoCoordMap = {};
  for (let i = 1; i < location.length; i += 1) {
    geoCoordMap[i] = location[i];
  }
  console.log('geo', geoCoordMap);
  return geoCoordMap;
}

function sortValue(a, b) {
  return b.value - a.value;
}
