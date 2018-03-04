/**
 * Created by ranyanchuan on 2017/9/12.
 */
import * as crossHeatService from 'services/cross-heat-service';

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
    topInfo: [],
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
      const { method, dt } = payload;
      const data = yield call(crossHeatService.getAggregate, payload);
      yield put({ type: 'getAggregateSuccess', payload: { method, data, dt } });
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
      yield put({
        type: 'getAutoDomainInfoSuccess', payload: { autoDomainInfo, yearDomainInfo },
      });
    },
    *getTopInfo({ payload }, { call, put, all }) { //获取导出页面info
      const { topDetailList, topHistoryList } = payload;
      const topDetailInfo = yield all(topDetailList.map((item) => {
        return call(crossHeatService.getAggregate, item);
      }));
      const topHistoryInfo = yield all(topHistoryList.map((item) => {
        return call(crossHeatService.getAggregate, item);
      }));
      const authorIds = [];
      const pubIds = [];
      for (const item of topDetailInfo) {
        authorIds.push(item.data.authors.top10.slice(0, 5));
        pubIds.push(item.data.pubs.top10.slice(0, 5));
      }
      const authorInfo = yield all(authorIds.map((item) => {
        return call(crossHeatService.getDomainExpert, { ids: item });
      }));

      const pubInfo = yield all(pubIds.map((item) => {
        return call(crossHeatService.getDomainPub, { ids: item });
      }));
      yield put({
        type: 'getTopInfoSuccess',
        payload: { topDetailInfo, topHistoryInfo, authorInfo, pubInfo },
      });
    },
  },

  reducers: {
    getTopInfoSuccess(state, { payload: { topDetailInfo, topHistoryInfo, authorInfo, pubInfo } }) {
      const dList = topDetailInfo.map(item => item.data);
      const cList = topDetailInfo.map(item => crossHeatService.changeContrast(item.data));
      const hList = topHistoryInfo.map(item => item.data[0].metaData);
      const kList = topHistoryInfo.map(item => item.data[0].token);
      const aList = authorInfo.map(item => item.data.persons);
      const pList = pubInfo.map(item => item.data.pubs);
      const topInfo = dList.map((item, i) => {
        return {
          contrast: cList[i],
          detail: item,
          history: hList[i],
          author: aList[i],
          pub: pList[i],
          key: kList[i].replace(',', ' & '),
        };
      });
      return { ...state, topInfo };
    },
    getPageInfoSuccess(state, { payload: { data } }) {
      return { ...state, pageInfo: data.data };
    },
    getAggregateSuccess(state, { payload: { method, data, dt } }) {
      if (method === 'overview') {
        const crossInfo = crossHeatService.domainChange(data.data, method);
        crossInfo.top = crossHeatService.getTop(data.data.data, dt.crossingFields);
        return { ...state, crossInfo };
      }
      if (method === 'detail') {
        const modalInfo = data.data;
        modalInfo.contrast = crossHeatService.changeContrast(data.data);
        return { ...state, modalInfo, experts: [], pubs: [] };
      }
      if (method === 'predict') {
        const predict = crossHeatService.domainChange(data.data, method);
        predict.top = crossHeatService.getTop(data.data, dt.crossingFields);
        return { ...state, predict };
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
      return { ...state, crossTree: crossHeatService.getCrossFieldNode(queryTree1, queryTree2) };
    },
    getTaskListSuccess(state, { payload: { data } }) {
      return { ...state, taskList: data.data };
    },
    delTaskListSuccess(state, { payload: { data, id } }) {
      if (data.success) {
        const taskList = state.taskList.filter(item => item._id !== id);
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
        for (const item of data[1].data.ref) {
          tempList.push({ name: item.name, children: [] });
        }
        const queryOne = { name: query, children: tempList.slice(0, 20) };
        const candidateOne = { name: query, children: tempList.slice(20, 40) };
        return { ...state, queryOne, candidateOne, sourceOne: source };
      }
      if (id === 'queryTwo') {
        for (const item of data[1].data.ref) {
          tempList.push({ name: item.name, children: [] });
        }
        const queryTwo = { name: query, children: tempList.slice(0, 20) };
        const candidateTwo = { name: query, children: tempList.slice(20, 40) };
        return { ...state, queryTwo, candidateTwo, sourceTwo: source };
      }
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
    getAutoDomainInfoSuccess(state, { payload: { autoDomainInfo, yearDomainInfo } }) {
      const autoList = [];
      const crossNode = yearDomainInfo[0].dt.crossingFields;
      for (const item of autoDomainInfo) {
        const crossInfo = crossHeatService.domainChange(item.data, 'overview');
        crossInfo.top = crossHeatService.getTop(item.data.data, crossNode);
        autoList.push(crossInfo);
      }
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

