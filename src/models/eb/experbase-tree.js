import { fromJS, Map } from 'immutable';
import { createHiObj } from 'utils/hiobj';
import * as magOrg from 'services/magOrg';
import * as ebService from 'services/expert-base';
import { isEqual } from 'lodash';
import hierarchy from 'helper/hierarchy';

export default {
  namespace: 'expertbaseTree',

  state: Map({
    treeData: null, // Hiobj instance.
    treeIndex: null, // index.
  }),

  effects: {

    * getTreeData({ payload }, { call, put }) {
      const data = yield call(ebService.getExpertBaseTreeData);
      if (data.data.succeed) {
        const items = data.data.items;
        yield put({ type: 'getTreeDataSuccess', payload: { items } });
      }
    },

    * getExpertBases({ payload }, { call, put }) {
      const { ids } = payload;
      const data = yield call(ebService.getExpertBases, payload);
      if (data.data.succeed) {
        return data.data.items;
      }
      return null;
    },

    * createExpertBase({ payload }, { call }) {
      // TODO 很多数据
      console.log('data', payload)
      const { data } = yield call(ebService.createExpertBase, payload);
      return data;
    },

    * UpdateExperBaseByID({ payload }, { select, call, put }) {
      const pdata = yield call(ebService.UpdateExperBaseByID, payload);
      return pdata.data;
    },

    * DeleteExperBaseByID({ payload }, { call }) {
      const { data } = yield call(ebService.DeleteExperBaseByID, payload);
      return data;
    },

    * getExperBaseByID({ payload }, { call }) {
      const { data } = yield call(ebService.getExpertBases, payload);
      return data.items[0];
    },

    * MoveExperBaseByID({ payload }, { call }) {
      const { id, parentsId } = payload;
      const data = { id, 'to': parentsId };
      const newData = yield call(ebService.MoveExperBaseByID, data);
      return newData.data;
    },

    //++++++++++++++++++++++++++++++++++  old  ++++++++++++++++++++++++++++++++++++++++


    //   // 其实和获取org是一个api，但是不能使用一个，会造成model的state改变，所以这里复制一个

    //   // 这个updata不是真的。是假装改父集的，后面会改
    //
    //   // 这个是真的更新api

    //   * deleteInitDate({ payload }, { select, call, put }) {
    //     const { ids } = payload;
    //     const state = yield select(state => state.magOrg);
    //     const initData = state.get('initData');
    //     initData.forEach((item, index) => {
    //       if (item.id === ids[0]) {
    //         initData.splice(index, 1);
    //       }
    //     });
    //     yield put({ type: 'getOrganizationByIDsSuccess', payload: initData });
    //   },
    //   * addInfoToLocal({ payload }, { select, put }) {
    //     const { data } = payload;
    //     const state = yield select(state => state.magOrg);
    //     const initData = state.get('initData');
    //     initData.push(data);
    //     yield put({ type: 'addInfoToLocalSuccess', payload: initData });
    //   },
  },
  reducers: {
    getTreeDataSuccess(state, { payload }) {
      const { items } = payload;
      const hi = hierarchy.init(items);

      return state.withMutations((map) => {
        map.set('treeData', hi.data);
        map.set('treeIndex', hi.index);
      });
    },
    //   addInfoToLocalSuccess(state, { initData }) {
    //     const data = createHiObj(initData);
    //     const newState = state.withMutations((map) => {
    //       map.set('allOrgs', data.getData());
    //       map.set('initData', initData);
    //     });
    //     return newState;
    //   },
  },
};
