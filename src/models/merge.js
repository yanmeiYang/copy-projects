/**
 * Created by yangyanmei on 17/10/17.
 */
import { sysconfig } from 'systems';
import bridge from 'utils/next-bridge';
import * as personService from 'services/person';
import * as mergeService from 'services/merge';


// TODO Change this, copied from search.js.

export default {

  namespace: 'merge',

  state: {
    checkedPersons: [], // 目前没用到
    checkedPersonIds: [],
    currentPerson: [],
    mergeStatus: null,


    results: [],

    offset: 0,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: sysconfig.MainListSize,
      total: null,
    },

    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',

  },

  subscriptions: {
    setup() {},
  },

  effects: {
    * searchPerson({ payload }, { call, put }) {
      const { query, offset, size, personId } = payload;
      const data = yield call(mergeService.searchPerson, query, offset, size, personId);

      if (data.succeed) {
        // console.log('>>>>------ to next API');
        yield put({ type: 'nextSearchPersonSuccess', payload: { data } });
      } else if (data.data && data.data.result) {
        // console.log('>>>>------ to old API');
        yield put({ type: 'searchPersonSuccess', payload: { data: data.data, query } });
      } else {
        throw new Error('Result Not Available');
      }
    },

    *getCurrentPerson({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.getPerson, personId);
      yield put({ type: 'getPersonSuccess', payload: { data } });
    },

    *tryToDoMerge({ payload }, { call, put }) {
      const { id, checkedPersonIds } = payload;
      const mergeIds = { r: [] };
      checkedPersonIds.map(item => mergeIds.r.push({ i: item }));
      const data = yield call(mergeService.tryToDoMerge, id, mergeIds);
      if (data.data.status) {
        yield put({ type: 'mergeSuccess', payload: { data: data.data.status } });
      }
    },
  },

  reducers: {
    updateCheckedPerson(state, { payload: { data, checkStatus } }) {
      if (checkStatus) {
        state.checkedPersons.push(data);
        state.checkedPersonIds.push(data.id);
      } else if (!checkStatus) {
        state.checkedPersons =
          state.checkedPersons.filter(item => item.id !== data.id);
        state.checkedPersonIds =
          state.checkedPersonIds.filter(item => item !== data.id);
      }
      return {
        ...state,
        checkedPersons: state.checkedPersons,
        checkedPersonIds: state.checkedPersonIds,
      };
    },

    emptyCheckedPersons(state) {
      return { ...state, checkedPersons: [], checkedPersonIds: [] };
    },

    getPersonSuccess(state, { payload: { data } }) {
      return { ...state, currentPerson: bridge.toNextPersons([data.data]) };
    },

    searchPersonSuccess(state, { payload: { data } }) {
      if (!data) {
        return state;
      }
      const { result } = data;
      const currentTotal = data.total;
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      // console.log('::', toNextPersons(result));
      return {
        ...state,
        results: bridge.toNextPersons(result),
        pagination: { pageSize: state.pagination.pageSize, total: currentTotal, current },
      };
    },

    nextSearchPersonSuccess(state, { payload: { data } }) {
      if (!data) {
        return state;
      }
      const { succeed, message, total, offset, size, items, aggregation } = data;
      if (!succeed) {
        throw new Error(message);
      }
      const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
      return {
        ...state,
        results: items,
        pagination: { pageSize: state.pagination.pageSize, total, current },
        aggs: aggregation,
      };
    },

    mergeSuccess(state, { payload: { data } }) {
      return { ...state, mergeStatus: data };
    },

  },

};
