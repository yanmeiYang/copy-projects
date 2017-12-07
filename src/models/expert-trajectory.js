import * as searchService from 'services/search';
import * as traDataFindService from 'services/expert-trajectory-service';

export default {

  namespace: 'expertTrajectory',

  state: {
    trajData: {},
    results: [],
    heatData: {},
    loading: false,
  },

  subscriptions: {},

  effects: {
    * searchPerson({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(searchService.searchPerson, payload);
      yield put({ type: 'searchPersonSuccess', payload: { data } });
    },

    * findTrajById({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { personId, start, end } = payload; //注意是两边的名字要一致，否则错误
      const data = yield call(traDataFindService.findTrajPerson, personId, start, end);
      yield put({ type: 'findTrajByIdSuccess', payload: { data, end } });
    },

    * findTrajsByRosterId({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { rosterId, start, end, size } = payload;
      const data = yield call(traDataFindService.findTrajsHeat, rosterId, start, end, size);
      yield put({ type: 'findTrajsByRosterIdSuccess', payload: { data } });
    },

    * findTrajsHeatAdvance({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { name, offset, org, term, size } = payload;
      const data = yield call(
        traDataFindService.findTrajsHeatAdvance,
        name, offset, org, term, size,
      );
      yield put({ type: 'findTrajsHeatAdvanceSuccess', payload: { data } });
    },

  },

  reducers: {
    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },

    findTrajByIdSuccess(state, { payload: { data, end } }) {
      const pointData = []; //点的数据，其实和热度的数据是一样的
      const lineData = []; //线的数据
      const step = []; //播放的步骤
      let staData = {}; //统计数据

      const cities = [];
      const addresses = [];

      for (const c of data.data.cities) {
        cities[c.id] = c;
      }
      for (const key in data.data.addresses) {
        if (data.data.addresses) {
          addresses[key] = data.data.addresses[key];
        }
      }
      /**
       * 这里为了方便统计数据的改动，将数据传过去，再在后面进行整理
       * @type {{cities: Array, addresses: Array, trajectories: *}}
       */
      staData = { cities, addresses, trajectories: data.data.trajectories };
      for (const key in data.data.trajectories) {
        if (data.data.trajectories) {
          let previousD = [];
          const cityIn = []; //在哪个城市
          for (const d of data.data.trajectories[key]) {
            const [cYear, cPlaceId] = d; //年份和所在位置id
            const cCityId = addresses[cPlaceId].city_id;
            const cCityName = cities[cCityId].name;
            const cLat = addresses[cPlaceId].geo.lat.toFixed(2); //保留两位小数
            const cLng = addresses[cPlaceId].geo.lng.toFixed(2);
            /**
             * 第一个点的时候不管，只做记录不执行其他的操作
             */
            if (previousD.length !== 0) { //第一次的时候什么都不做，否则更新上一个点，push一条线
              const [pYear, pPlaceId] = previousD; //年份和所在位置id
              const pCityId = addresses[pPlaceId].city_id;
              const pCityName = cities[pCityId].name;
              const pLat = addresses[pPlaceId].geo.lat.toFixed(2); //保留两位小数
              const pLng = addresses[pPlaceId].geo.lng.toFixed(2);
              const curveness = 0.15 + (Math.random() * 0.1);
              const line = { coords: [[pLng, pLat], [cLng, cLat]], tooltip: {
                confine: true,
                formatter: () => {
                  return `<div font-size: 11px;padding-bottom: 7px;margin-bottom: 7px">When ${cYear}.<br />From ${pCityName} to ${cCityName}</div>`;
                },
              }, lineStyle: {
                normal: { curveness },
              } };
              /**
               * 更新点的时候有这样几种情况：
               * 1. 该点和上一个点一样（不管是机构、城市还是经纬度坐标一样）则不管，继续循环
               * 2. 该点和上一个点不一样，则：
               *    2.1 如果该点不存在则添加该点
               *    2.2 如果该点存在则更新该点
               * 3. 记得处理最后一个点
               */
              if (pCityId !== cCityId) { //地址不一样的情况,此处使用的是城市不一致
                lineData.push(line);
                let newStep;
                if (cCityId in cityIn) { //当前的点在不在，在的话push一个step
                  newStep = step.length === 0 ? 2 : step[step.length - 1]; //还是原来的点
                } else {
                  newStep = step.length === 0 ? 2 : (step[step.length - 1] + 1); //向后挪一个点
                }
                step.push(newStep);
                if (pCityId in cityIn) { //上一个已经点存在的情况
                  const point = cityIn[pCityId]; //更新点的信息
                  point.symbolSize += (cYear - pYear);
                  const names = point.name.split('\n');
                  if (names.length > 2) { //防止名字太长
                    point.name = `${names[0]}\n${names[1]}\n ... ${pYear}-${cYear}\n`;
                  } else {
                    point.name = `${names[0]}\n${names[1]}\n ${pYear}-${cYear}\n`;
                  }
                } else { //上一个点不存在的情况，添加上一个点
                  cityIn[pCityId] = [];
                  const weight = (cYear - pYear) + 1; //多加一年，否则为空
                  const name = `${pCityName}\n${pYear}-${cYear}\n`; //上一个点
                  const point = { name, value: [pLng, pLat], symbolSize: weight };
                  cityIn[pCityId] = point;
                  pointData.push(point); //push新加入的点
                }
                previousD = d;
              } //一样的时候不进行任何的操作
            } else { //第一个点的时候只记录不进行其他的操作
              previousD = d;
            }
          }
          /**
           * 循环结束的时候处理最后一个点
           * 最后一个点和当前的进行比较
           */
          const [lastYear, lastPlaceId] = previousD; //年份和所在位置id
          const lastCityId = addresses[lastPlaceId].city_id;
          const lastCityName = cities[lastCityId].name;
          const lastLat = addresses[lastPlaceId].geo.lat.toFixed(2); //保留两位小数
          const lastLng = addresses[lastPlaceId].geo.lng.toFixed(2);
          if (lastCityId in cityIn) { //同样判断是已经存在
            const point = cityIn[lastCityId]; //更新点的信息
            point.symbolSize += (end - lastYear); //end是我们查询的年份
            const names = point.name.split('\n');
            if (names.length > 2) { //防止名字太长
              point.name = `${names[0]}\n${names[1]}\n ... ${end}-${lastYear}\n`;
            } else {
              point.name = `${names[0]}\n${names[1]}\n ${end}-${lastYear}\n`;
            }
          } else {
            cityIn[lastCityId] = [];
            const weight = (end - lastYear) + 1; //多加一年，否则为空
            const name = `${lastCityName}\n${end}-${lastYear}\n`; //上一个点
            const point = { name, value: [lastLng, lastLat], symbolSize: weight };
            cityIn[lastCityId] = point;
            pointData.push(point); //push新加入的点
          }
        }
      }
      const trajData = { lineData, pointData, step, staData };
      return { ...state, trajData, loading: false };
    },


    findTrajsByRosterIdSuccess(state, { payload: { data } }) {
      console.log(data);
      return { ...state, heatData: data, loading: false };
    },

    searchPersonSuccess(state, { payload: { data } }) {
      const { result } = data;
      return {
        ...state,
        results: result,
        loading: false,
      };
    },

    findTrajsHeatAdvanceSuccess(state, { payload: { data } }) {
      return {
        ...state,
        heatData: data,
        loading: false,
      };
    },

  },
};
