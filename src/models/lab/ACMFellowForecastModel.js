/**
 *  Created by BoGao on 2017-12-19;
 */
import pathToRegexp from 'path-to-regexp';
import { wget } from 'services/util-service';
import * as personService from 'services/person';
import * as pubService from 'services/publication';
import * as searchService from 'services/search';
import bridge from "utils/next-bridge";
import { Map } from 'immutable';

const LSKEY = 'ACMFelowForecaseCache';

const TEMP_LOCAL_ACMFORECAST_DATA = '/lab/acm_fellow_forecast.json';
const TEMP_LOCAL_ACMFORECAST_DATA_ACMIDS = '/lab/acm_fellow_forecast_already_acm_ids.json';

let cachedData;
const acmFellowIdSet = new Set();
const ACMFellowEB = '59d7bb7e9ed5dbe450e6b275';
// stop null null, &Na;, J. Zhang, Y. Liu, Et Al,
const stoplist = ['5633603145cedb339a973bf8', '544897c4dabfae87b7e4a2de',
  '53f66247dabfaebd90189718', '5432960adabfaeb54215f5a2',
  '5434e4cbdabfaebba58797a7',
  '53f7b04fdabfae90ec1148c1', // Y. Zhang, hidden
  '5433c99ddabfaeb4c6acf42d', // J. Li, hidden
  // #paper > 1000 的:
  '54409f34dabfae805a6df627', // L. Zhang
  '5433fb16dabfaeb4c6ad8834', // Y. Li
  '53f58f25dabfaedb01f8047b', // Xiaodong Wang
  '53f48d58dabfaea7cd1d2326', //  Jie Chen
  '53f4e564dabfaefd3c77b42c', //  Xin Li
  '53f46189dabfaee43ece357a', //  S. Yamada
];

export default {

  namespace: 'acmforecast',

  state: {
    // data: null,
    persons: null,
    pubsMap: null,

    sort: '', // sort by [score_sum, h, t, c]
    total: 0,
  },

  subscriptions: {},

  effects: {
    * getACMFellowForecast({ payload }, { call, put, all }) {
      const { offset = 0, size = 20, sort = 'score_sum' } = payload || {};
      // sort: score_sum, score_h, score_t,score_c;
      const start = new Date().getTime();
      if (!cachedData) {
        const [data, acmIds] = yield all([
          call(wget, TEMP_LOCAL_ACMFORECAST_DATA),
          call(wget, TEMP_LOCAL_ACMFORECAST_DATA_ACMIDS),
        ]);
        if (data && acmIds) {
          // TODO save additional data into states.
          for (const id of acmIds) {
            acmFellowIdSet.add(id);
          }
          for (const id of stoplist) {
            acmFellowIdSet.add(id);
          }
          const processed = preprocessData(data.data, sort);
          cachedData = processed;
          yield put({ type: 'set', payload: { total: cachedData.length } });
        }
      }

      console.log('$ Benchmark: Load data', (new Date().getTime() - start) / 1000);

      // get ids
      const onePage = cachedData.slice(offset, offset + size);
      const [ids, pids] = [[], []];
      for (const item of onePage) {
        if (item) {
          ids.push(item.id);
          if (item.two_top_cited_paper && item.two_top_cited_paper.length > 0) {
            pids.push(...item.two_top_cited_paper);
          }
        }
      }
      // const ids = onePage && onePage.map(item => item.id);

      // get profiles
      const [data, pdata] = yield all([
        call(personService.listPersonByIds, ids),
        call(pubService.getPubsByIds, { ids: pids }),
      ]);
      if (data && data.success) {
        const persons = bridge.toNextPersons(data.data.persons);
        // set data back;
        for (let i = 0; i < persons.length; i += 1) {
          const d = persons[i];
          if (d) {
            d.attached = onePage[i];
            // if (d && d.indices && d.indices.pubs > 1000) {
            //   console.log('---', d.id, d.name, d.indices);
            // }
          }
        }
        yield put({ type: 'getPersonSuccess', payload: { persons } });
      }
      // for papers.
      if (pdata && pdata.success) {
        const { pubs } = pdata.data;
        let pubsMap = Map();
        if (pubs && pubs.length > 0) {
          pubsMap = pubsMap.withMutations((map) => {
            for (const pub of pubs) {
              map.set(pub.id, pub);
            }
          });
        }
        yield put({ type: 'set', payload: { pubsMap } });
      }
    },

  },

  reducers: {
    set(state, { payload }) {
      return { ...state, ...payload };
    },

    setPagerInfo(state, { payload: { data } }) {
      return { ...state, data };
    },

    getPersonSuccess(state, { payload: { persons } }) {
      return { ...state, persons };
    },
  },

};

const preprocessData = (data, byScore) => {
  if (data) {
    const filtered = data.filter(item => item
      && !acmFellowIdSet.has(item.id)
      && item.score
      && (item.score.score_h >= 2 || item.score.score_c >= 3 || item.score.score_t >= 2),
    );
    filtered.sort((a, b) => {
      if (!a || !a.score || !a.score[byScore]) {
        return -1;
      }
      if (!b || !b.score || !b.score[byScore]) {
        return 1;
      }
      if (a.score[byScore] < b.score[byScore]) {
        return 1;
      } else if (a.score[byScore] > b.score[byScore]) {
        return -1;
      } else {
        return 0;
      }
    });
    return filtered;
  }
  return data;
};
