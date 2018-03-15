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

    //   * organizationCreate({ payload }, { call }) {
    //     // TODO 很多数据
    //     const { data } = payload;
    //     const newData = {
    //       'opts': [{
    //         'operator': 'upsert',
    //         'fields': [
    //           {
    //             'field': 'parents',
    //             'value': data.parents,
    //           },
    //           {
    //             'field': 'name',
    //             'value': data.name,
    //           },
    //           {
    //             'field': 'name_zh',
    //             'value': data.name_zh,
    //           },
    //           {
    //             'field': 'desc',
    //             'value': data.desc,
    //           },
    //           {
    //             'field': 'desc_zh',
    //             'value': data.desc_zh,
    //           },
    //           {
    //             'field': 'is_public',
    //             'value': data.isPublic,
    //           },
    //         ],
    //       }],
    //     };
    //     const pdata = yield call(magOrg.OrganizationCreate, newData);
    //     return pdata.data;
    //   },
    //   * organizationDelete({ payload }, { call }) {
    //     const { ids } = payload;
    //     const data = yield call(magOrg.OrganizationDelete, ids);
    //     return data.data;
    //   },
    //   // 其实和获取org是一个api，但是不能使用一个，会造成model的state改变，所以这里复制一个
    //   * getOrgByID({ payload }, { call }) {
    //     const data = yield call(magOrg.getOrganizationByIDs, payload);
    //     return data.data.items[0];
    //   },
    //   // 这个updata不是真的。是假装改父集的，后面会改
    //   * MoveOrganizationByID({ payload }, { call }) {
    //     const { ids, parentsId } = payload;
    //     const data = {
    //       'id': ids[0],
    //       'to': parentsId[0],
    //     };
    //     const newdata = yield call(magOrg.MoveOrganizationByID, data);
    //     return newdata.data;
    //   },
    //   // 这个是真的更新api
    //   * updateOrganizationByID({ payload }, { select, call, put }) {
    //     const { fatherId, data } = payload;
    //     const newData = {
    //       // 'ids': fatherId,
    //       'opts': [{
    //         'operator': 'upsert',
    //         'fields': [
    //           {
    //             'field': 'id',
    //             'value': fatherId[0],
    //           },
    //           {
    //             'field': 'name',
    //             'value': data.name,
    //           },
    //           {
    //             'field': 'name_zh',
    //             'value': data.name_zh,
    //           },
    //           {
    //             'field': 'desc',
    //             'value': data.desc,
    //           },
    //           {
    //             'field': 'desc_zh',
    //             'value': data.desc_zh,
    //           },
    //           {
    //             'field': 'is_public',
    //             'value': data.isPublic,
    //           },
    //         ],
    //       }],
    //     };
    //     const pdata = yield call(magOrg.UpdateOrganizationByID, newData);
    //     if (pdata.data && pdata.data.succeed) {
    //       const state = yield select(state => state.magOrg);
    //       const initData = state.get('initData');
    //       console.log('initData', initData)
    //       initData.forEach((item) => {
    //         if (item.id === fatherId[0]) {
    //           item.name = data.name;
    //           item.name_zh = data.name_zh;
    //         }
    //       });
    //       yield put({ type: 'getOrganizationByIDsSuccess', payload: initData });
    //     } else {
    //       return pdata.data;
    //     }
    //   },
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
