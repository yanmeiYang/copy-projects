/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from '../services/cross-heat-service';

export default {

  namespace: 'crossHeat',
  state: {
    candidateOne: null,
    candidateTwo: null,
    queryOne: null,
    queryTwo: null,
    mostScholars: null,
    decareID: null,
    crossTree: null,
    crossInfo: null,
    modalInfo: null,
    domainAllInfo: null,
    staticInfo: null,
    domainMinInfo: null,
    pageInfo: null,
    experts: [],
    pubs: [],
    taskList: [],
    suggest: [],
    predict: null,
    autoDomainInfo: [],
    exportList: [],
    exportPubsList: [],
    exportAuthorsList: [],
  },

  effects: {
    *getDiscipline({ payload }, { call, put }) {
      const { id, area, k, depth } = payload;
      const data = yield call(crossHeatService.getDiscipline, area, k, depth);
      yield put({ type: 'getDisciplineSuccess', payload: { data, id } });
    },
    *getCrossPredict({ payload }, { call, put }) {
      const data = yield call(crossHeatService.getCrossPredict, payload);
      yield put({ type: 'getCrossPredictSuccess', payload: { data } });
    },
    *getDomainPub({ payload }, { call, put }) {
      const data = yield call(crossHeatService.getDomainPub, payload);
      yield put({ type: 'getDomainPubSuccess', payload: { data } });
    },
    *getDomainExpert({ payload }, { call, put }) {
      const data = yield call(crossHeatService.getDomainExpert, payload);
      yield put({ type: 'getDomainExpertSuccess', payload: { data } });
    },
    *getSuggest({ payload }, { call, put }) {
      const { query } = payload;
      const data = yield call(crossHeatService.getSuggest, query);
      yield put({ type: 'getSuggestSuccess', payload: { data } });
    },

    *addCrossField({ payload }, { call, put }) {
      const data = yield call(crossHeatService.addCrossField, payload);
      yield put({ type: 'addCrossFieldSuccess', payload: { data } });
    },

    *getCrossFieldById({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(crossHeatService.getCrossFieldById, id);
      yield put({ type: 'getCrossTreeSuccess', payload: { data } });
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
    *getAggregate({ payload }, { call, put }) {
      const { method } = payload;
      const data = yield call(crossHeatService.getAggregate, payload);
      yield put({ type: 'getAggregateSuccess', payload: { method, data } });
    },

    *getPageInfo({ payload }, { call, put }) {
      const { method } = payload;
      const data = yield call(crossHeatService.getAggregate, payload);
      yield put({ type: 'getPageInfoSuccess', payload: { method, data } });
    },

    *getAutoDomainInfo({ payload }, { call, put, all }) {
      const { yearDomainInfo } = payload;
      const autoDomainInfo = yield all(yearDomainInfo.map((item) => {
        return call(crossHeatService.getAggregate, item);
      }));
      yield put({ type: 'getAutoDomainInfoSuccess', payload: { autoDomainInfo } });
    },

    *getExportInfo({ payload }, { call, put, all }) {
      const { exportList } = payload;
      const exportInfo = yield all(exportList.map((item) => {
        return call(crossHeatService.getAggregate, item);
      }));
      yield put({ type: 'getExportInfoSuccess', payload: { exportInfo } });
    },

    *getPubListInfo({ payload }, { call, put, all }) {
      const { idInfo } = payload;
      const pubInfo = yield all(idInfo.map((item) => {
        return call(crossHeatService.getDomainPub, item);
      }));
      yield put({ type: 'getPubInfoSuccess', payload: { pubInfo } });
    },

    *getAuthorListInfo({ payload }, { call, put, all }) {
      const { idInfo } = payload;
      const authorInfo = yield all(idInfo.map((item) => {
        return call(crossHeatService.getDomainExpert, item);
      }));
      yield put({ type: 'getAuthorInfoSuccess', payload: { authorInfo } });
    },

  },

  reducers: {
    getPageInfoSuccess(state, { payload: { data } }){
      console.log(data);
      return { ...state, pageInfo: data.data };

    },
    getPubInfoSuccess(state, { payload: { pubInfo } }) {
      const exportPubsList = {};
      pubInfo.map((info) => {
        info.data.pubs.map((item) => {
          exportPubsList[item.id] = item;
          return true;
        });
        return true;
      });
      return { ...state, exportPubsList };
    },
    getAuthorInfoSuccess(state, { payload: { authorInfo } }) {
      const exportAuthorsList = {};
      authorInfo.map((info) => {
        info.data.persons.map((item) => {
          exportAuthorsList[item.id] = item;
          return true;
        });
        return true;
      });
      return { ...state, exportAuthorsList };
    },
    getExportInfoSuccess(state, { payload: { exportInfo } }) {
      const exportList = [];
      exportInfo.map((item) => {
        exportList.push(item.data);
        return true;
      });
      return { ...state, exportList };
    },

    getAggregateSuccess(state, { payload: { method, data } }) {
      if (method === 'overview') {
        return { ...state, crossInfo: data.data };
      }
      if (method === 'detail') {
        return { ...state, modalInfo: data.data, experts: [], pubs: [] };
      }
      if (method === 'predict') {
        return { ...state, predict: data.data };
      }

      return { ...state };
    },
    addCrossFieldSuccess(state, { payload: { data } }) {
      return { ...state, decareID: data.data._id };
    },

    getCrossTreeSuccess(state, { payload: { data } }) {
      const queryTree2 = data.data._2;
      const queryTree1 = data.data._1;
      return { ...state, crossTree: { queryTree1, queryTree2 } };
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
    getDisciplineSuccess(state, { payload: { data, id } }) {
      if (id === 'queryOne') {
        return { ...state, queryOne: data.data };
      }
      if (id === 'queryTwo') {
        return { ...state, queryTwo: data.data };
      }
      if (id === 'candidateOne') {
        return { ...state, candidateOne: data.data };
      }
      if (id === 'candidateTwo') {
        return { ...state, candidateTwo: data.data };
      }
    },
    createDisciplineSuccess(state, { payload: { data } }) {
      return { ...state, decareID: data.data._id };
    },

    getDomainInfoSuccess(state, { payload: { data } }) {
      return { ...state, crossInfo: data.data, experts: null, pubs: [] };
    },
    getDomainExpertSuccess(state, { payload: { data } }) {
      return { ...state, experts: data.data.persons };
    },
    getDomainPubSuccess(state, { payload: { data } }) {
      return { ...state, pubs: data.data.pubs };
    },
    getSuggestSuccess(state, { payload: { data } }) {
      return { ...state, suggest: data.data.phrase };
    },
    getCrossPredictSuccess(state, { payload: { data } }) {
      return { ...state, predict: data.data };
    },
    getAutoDomainInfoSuccess(state, { payload: { autoDomainInfo } }) {
      const autoList = [];
      autoDomainInfo.map((item) => {
        autoList.push(item.data);
        return true;
      });
      return { ...state, autoDomainInfo: autoList };
    },


  },
};
