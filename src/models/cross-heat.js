/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from '../services/cross-heat-service';
export default {

  namespace: 'crossHeat',
  state: {
    tree1: null,
    tree2: null,
  },

  effects: {
    *getDiscipline({ payload }, { call, put }) {
      console.log('-------------get---------------');
      console.log(payload);
      const { id, area, k, depth } = payload;
      const data = yield call(crossHeatService.getDiscipline, area, k, depth);
      yield put({ type: 'getDisciplineSuccess', payload: { data, id } });
    },

    *delDiscipline({ payload }, { call, put }) {
      console.log('------------del----------------');
      console.log(payload);
      const { parents, children, postive } = payload;
      // 不管用户是否删除成功，前端都要删除
      // yield put({ type: 'delDisciplineSuccess', payload: { data } });
      const data = yield call(crossHeatService.delDiscipline, parents, children, postive);
      console.log(data);
      console.log('=================');
    },
  },

  reducers: {
    getDisciplineSuccess(state, { payload: { data, id } }) {
      console.log(data);
      if (id === 'tree1') {
        return { ...state, tree1: data.data };
      } else {
        return { ...state, tree2: data.data };
      }
    },
  },

};
