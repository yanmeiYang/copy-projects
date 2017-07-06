/**
 * Created by yangyanmei on 17/6/16.
 */
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import * as seminarService from '../../services/seminar';

export default {
  namespace: 'statistics',
  state: {
    activity: [],
    author: [],
  },
  subscriptions: {
    setup(){
    }
  },

  effects: {
    *getStatsOfCcfActivities({ payload }, { call, put }){
      const { data } = yield call(seminarService.getStatsOfCcfActivities);
      yield put({ type: 'getStatsOfCcfActivitiesSuccess', payload: data })
    },
  },
  reducers: {
    getStatsOfCcfActivitiesSuccess(state, { payload: data }){
      console.log(data);
      return { ...state, activity: data.stats.activity, author: data.stats.author }
    },
  },
}
