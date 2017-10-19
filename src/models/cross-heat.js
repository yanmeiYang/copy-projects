/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from '../services/cross-heat-service';

export default {

  namespace: 'crossHeat',
  state: {
    queryTree1: null,
    queryTree2: null,
    mostScholars: null,
    decareID: null,
    crossTree: null,
    domainList: null,
    modalInfo: null,
    domainAllInfo: null,
    experts: [],
    pubs: [],
    userQuerys: [],

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
      const { domain1, domain2, begin, end } = payload;
      const data = yield call(crossHeatService.getDomainAllInfo, domain1, domain2, begin, end);
      yield put({ type: 'getDomainAllInfoSuccess', payload: { data } });
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
    *getUserQuerys({ payload }, { call, put }) {
      const { offset, size } = payload;
      const data = yield call(crossHeatService.getUserQuerys, offset, size);
      yield put({ type: 'getUserQuerysSuccess', payload: { data } });
    },
    *delUserQuery({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(crossHeatService.delUserQuery, id);
      yield put({ type: 'delUserQuerySuccess', payload: { data } });
    },

  },

  reducers: {
    getDisciplineSuccess(state, { payload: { data, id } }) {
      if (id === 'queryTree1') {
        return { ...state, queryTree1: data.data };
      } else {
        return { ...state, queryTree2: data.data };
      }
    },
    createDisciplineSuccess(state, { payload: { data } }) {
      return { ...state, decareID: data.data.id };
    },
    getCrossTreeSuccess(state, { payload: { data } }) {
      return { ...state, crossTree: data.data };
    },
    getDomainInfoSuccess(state, { payload: { data } }) {
      return { ...state, domainList: data.data, experts: null, pubs: [] };
    },
    getDomainExpertSuccess(state, { payload: { data } }) {
      return { ...state, experts: data.data.persons };
    },
    getDomainAllInfoSuccess(state, { payload: { data } }) {
      return { ...state, domainAllInfo: data.data };
    },
    getDomainPubSuccess(state, { payload: { data } }) {
      return { ...state, pubs: data };
    },
    getUserQuerysSuccess(state, { payload: { data } }) {
      console.log(data);
      return { ...state, userQuerys: data.data };
    },
    delUserQuerySuccess(state, { payload: { data } }) {
      console.log(data);
      return { ...state };
    },
  },
};
