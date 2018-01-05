/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from '../services/cross-heat-service';

export default {

  namespace: 'crossHeat',
  state: {
    sourceOne: 'wiki',
    sourceTwo: 'wiki',
    queryOne: null,
    queryTwo: null,
    candidateOne: null,
    candidateTwo: null,
    mostScholars: null,
    decareID: null,
    crossTree: null,
    crossInfo: null,
    modalInfo: null,
    domainAllInfo: null,
    staticInfo: null,
    domainMinInfo: null,
    history: null,
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
    *getDiscipline({ payload }, { call, put, all }) {
      const { wiki, id, source, query } = payload;
      const data = yield all(wiki.map((item) => {
        return call(crossHeatService.getDiscipline, item);
      }));
      yield put({ type: 'getDisciplineSuccess', payload: { data, id, source, query } });
    },
    *getACMDiscipline({ payload }, { call, put, all }) {
      const { acm, id, query, source } = payload;
      const data = yield all(acm.map((item) => {
        return call(crossHeatService.getACMDiscipline, item);
      }));
      yield put({ type: 'getACMDisciplineSuccess', payload: { data, id, query, source } });
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
    getPageInfoSuccess(state, { payload: { data } }) {
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
      if (method === 'meta') {
        return { ...state, history: data.data };
      }
      return { ...state };
    },
    addCrossFieldSuccess(state, { payload: { data } }) {
      return { ...state, decareID: data.data._id };
    },

    getCrossTreeSuccess(state, { payload: { data } }) {
      const queryTree2 = data.data._2;
      const queryTree1 = data.data._1;
      const completeStatus = data.data.completed === data.data.total;
      return { ...state, crossTree: { queryTree1, queryTree2, completeStatus } };
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
    getDisciplineSuccess(state, { payload: { data, id, source, query } }) {
      //  将数据打平
      const nodeList = getNodeChildren(data[0].data, []);
      const candidate = { name: query, children: getNodeChildren(data[1].data, []) };
      const area = { name: query, children: nodeList.slice(1, 21) };
      if (id === 'queryOne') {
        return { ...state, queryOne: area, candidateOne: candidate, sourceOne: source };
      }
      if (id === 'queryTwo') {
        return { ...state, queryTwo: area, candidateTwo: candidate, sourceTwo: source };
      }
    },

    getACMDisciplineSuccess(state, { payload: { data, id, query, source } }) {
      const tempList = [];
      if (id === 'queryOne') {
        data[1].data.ref.map((item) => {
          tempList.push({ name: item.name, children: [] });
          return true;
        })
        const queryOne = { name: query, children: tempList.slice(0, 20) };
        const candidateOne = { name: query, children: tempList.slice(20, 40) };
        return { ...state, queryOne, candidateOne, sourceOne: source };
      }
      if (id === 'queryTwo') {
        data[1].data.ref.map((item) => {
          tempList.push({ name: item.name, children: [] });
          return true;
        })
        const queryTwo = { name: query, children: tempList.slice(0, 20) };
        const candidateTwo = { name: query, children: tempList.slice(20, 40) };
        return { ...state, queryTwo, candidateTwo, sourceTwo: source };
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

function getNodeChildren(tree, children) {
  children.push({ name: tree.name, children: [] });
  if (tree.children && tree.children.length > 0) {
    tree.children.map(item => getNodeChildren(item, children));
  }
  return children;
}

