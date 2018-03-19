import { fromJS, Map, List } from 'immutable';
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

    updateNode(state, { payload }) {
      const { node } = payload;
      let path = hierarchy.findPath(state.get('treeData'), state.get('treeIndex'), node.id);
      if (path == null) {
        console.error('can\' find [%s] in tree.', node.id);
        return state;
      }
      path = ['treeData', ...path, '__replace_me__'];
      const replaceIdx = path.length - 1;
      // update values.
      return state.withMutations((map) => {
        Object.keys(node).map((key) => {
          if (key !== 'id') {
            path[replaceIdx] = key;
            map.setIn(path, node[key]);
          }
          return null;
        });
      });
    },

    addNode(state, { payload }) {
      const { node, id } = payload;
      let path = hierarchy.findPath(state.get('treeData'), state.get('treeIndex'), id);
      if (path == null) {
        console.error('can\' find [%s] in tree.', node.id);
        return state;
      }
      path = ['treeData', ...path, 'childs'];
      // update values.
      return state.withMutations((map) => {
        map.updateIn(path, ((childs) => {
          if(childs){
            return  childs.push(fromJS(node))
          } else {
            childs = List();
            return childs.push(fromJS(node))
          }

        }));
      });
    },

    deleteNode(state, { payload }) {
      const { id } = payload;
      let path = hierarchy.findPath(state.get('treeData'), state.get('treeIndex'), id);
      if (path == null) {
        console.error('can\' find [%s] in tree.', id);
        return state;
      }
      path = ['treeData', ...path];
      // update values.
      return state.withMutations((map) => {
        map.removeIn(path);
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
