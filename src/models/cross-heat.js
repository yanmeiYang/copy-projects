/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from '../services/cross-heat-service';

export default {

  namespace: 'crossHeat',
  state: {
    queryOne: null,
    queryTwo: null,
    mostScholars: null,
    decareID: null,
    crossTree: null,
    crossInfo: null,
    modalInfo: null,
    domainAllInfo: null,
    domainMinInfo: null,
    experts: [],
    pubs: [],
    taskList: [],
    suggest: [],

  },

  effects: {
    *getDiscipline({ payload }, { call, put }) {
      const { id, area, k, depth } = payload;
      const data = yield call(crossHeatService.getDiscipline, area, k, depth);
      yield put({ type: 'getDisciplineSuccess', payload: { data, id } });
    },

    *delDiscipline({ payload }, { call, put }) {
      const { parents, children, postive } = payload;
      // 不管用户是否删除成功，前端都要删除
      // yield put({ type: 'delDisciplineSuccess', payload: { data } });
      const data = yield call(crossHeatService.delDiscipline, parents, children, postive);
    },

    *createDiscipline({ payload }, { call, put }) {
      const data = yield call(crossHeatService.createDiscipline, payload);
      yield put({ type: 'createDisciplineSuccess', payload: { data } });
    },
    *getCrossTree({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(crossHeatService.getCrossTree, id);
      yield put({ type: 'getCrossTreeSuccess', payload: { data } });
    },
    *getDomainInfo({ payload }, { call, put }) {
      const { begin, end, dt } = payload;
      const data = yield call(crossHeatService.getDomainiInfo, begin, end, dt);
      yield put({ type: 'getDomainInfoSuccess', payload: { data } });
    },
    *getDomainAllInfo({ payload }, { call, put }) {
      const data = yield call(crossHeatService.getDomainAllInfo, payload);
      yield put({ type: 'getDomainAllInfoSuccess', payload: { data } });
    },
    *getDomainMinInfo({ payload }, { call, put }) {
      yield put({ type: 'delExpPubSuccess', payload: { data } });
      const data = yield call(crossHeatService.getDomainAllInfo, payload);
      yield put({ type: 'getDomainMinInfoSuccess', payload: { data } });
    },
    *getDomainPub({ payload }, { call, put }) {
      const { ids } = payload;
      const data = [];
      for (const id of ids) {
        const dt = yield call(crossHeatService.getDomainPub, id);
        data.push(dt.data);
      }
      yield put({ type: 'getDomainPubSuccess', payload: { data } });
    },
    *getDomainExpert({ payload }, { call, put }) {
      const data = yield call(crossHeatService.getDomainExpert, payload);
      yield put({ type: 'getDomainExpertSuccess', payload: { data } });
    },
    *getTaskList({ payload }, { call, put }) {
      const { offset, size } = payload;
      const data = yield call(crossHeatService.getTaskList, offset, size);
      yield put({ type: 'getTaskListSuccess', payload: { data } });
    },
    *delTaskList({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(crossHeatService.delTaskList, id);
      yield put({ type: 'delTaskListSuccess', payload: { data, id } });
    },
    *getSuggest({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(crossHeatService.getSuggest, query);
      yield put({ type: 'getSuggestSuccess', payload: { data } });
    },

  },

  reducers: {
    getDisciplineSuccess(state, { payload: { data, id } }) {
      if (id === 'queryOne') {
        return { ...state, queryOne: data.data };
      } else {
        return { ...state, queryTwo: data.data };
      }
    },
    createDisciplineSuccess(state, { payload: { data } }) {
      return { ...state, decareID: data.data._id };
    },
    getCrossTreeSuccess(state, { payload: { data } }) {
      return { ...state, crossTree: data.data };
    },
    getDomainInfoSuccess(state, { payload: { data } }) {
      return { ...state, crossInfo: data.data, experts: null, pubs: [] };
    },
    getDomainExpertSuccess(state, { payload: { data } }) {
      return { ...state, experts: data.data.persons };
    },
    getDomainAllInfoSuccess(state, { payload: { data } }) {
      return { ...state, domainAllInfo: data.data };
    },
    getDomainMinInfoSuccess(state, { payload: { data } }) {
      return { ...state, domainMinInfo: data.data };
    },
    getDomainPubSuccess(state, { payload: { data } }) {
      return { ...state, pubs: data };
    },
    getTaskListSuccess(state, { payload: { data } }) {
      return { ...state, taskList: data.data };
    },
    delTaskListSuccess(state, { payload: { data, id } }) {
      if (data.success) {
        const taskList = state.taskList.filter((item) => {
          return item._id !== id;
        });
        return { ...state, taskList };
      } else {
        return { ...state };
      }
    },
    getSuggestSuccess(state, { payload: { data } }){
      return { ...state, suggest: data.data.phrase };
    },
    delExpPubSuccess(state, { payload: { data } }){
      return { ...state, experts: [], pubs: [] };
    },
  },
};
