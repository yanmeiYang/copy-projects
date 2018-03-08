/* eslint-disable quote-props */
import { Map } from 'immutable';
import { createHiObj } from 'utils/hiobj';
import * as magOrg from 'services/magOrg';
import { isEqual } from 'lodash';
import { Maps } from 'utils/immutablejs-helpers';

export default {
  namespace: 'magOrg',
  state: Map({
    allOrgs: null,
    initData: null,
  }),
  effects: {
    // 读取org列表
    * getOrganizationByIDs({ payload }, { call, put }) {
      // const { ids, organization } = payload;
      const data = yield call(magOrg.getOrganizationByIDs, payload);
      if (data.data.succeed) {
        yield put({ type: 'getOrganizationByIDsSuccess', payload: data.data.items });
      }
    },
    * organizationCreate({ payload }, { call }) {
      // TODO 很多数据
      const { data } = payload;
      const newData = {
        'opts': [{
          'operator': 'upsert',
          'fields': [
            {
              'field': 'parents',
              'value': data.parents,
            },
            {
              'field': 'name',
              'value': data.name,
            },
            {
              'field': 'name_zh',
              'value': data.name_zh,
            },
            {
              'field': 'desc',
              'value': data.desc,
            },
            {
              'field': 'desc_zh',
              'value': data.desc_zh,
            },
            {
              'field': 'is_public',
              'value': data.isPublic,
            },
          ],
        }],
      };
      const pdata = yield call(magOrg.OrganizationCreate, newData);
      return pdata.data;
    },
    * organizationDelete({ payload }, { call }) {
      const { ids } = payload;
      const data = yield call(magOrg.OrganizationDelete, ids);
      return data.data;
    },
    // 其实和获取org是一个api，但是不能使用一个，会造成model的state改变，所以这里复制一个
    * getOrgByID({ payload }, { call }) {
      const data = yield call(magOrg.getOrganizationByIDs, payload);
      return data.data.items[0];
    },
    // 这个updata不是真的。是假装改父集的，后面会改
    * MoveOrganizationByID({ payload }, { call }) {
      const { ids, parentsId } = payload;
      const data = {
        'id': ids[0],
        'to': parentsId[0],
      };
      const newdata = yield call(magOrg.MoveOrganizationByID, data);
      return newdata.data;
    },
    // 这个是真的更新api
    * updateOrganizationByID({ payload }, { call }) {
      const { fatherId, data } = payload;
      const newData = {
        // 'ids': fatherId,
        'opts': [{
          'operator': 'upsert',
          'fields': [
            {
              'field': 'id',
              'value': fatherId[0],
            },
            {
              'field': 'name',
              'value': data.name,
            },
            {
              'field': 'name_zh',
              'value': data.name_zh,
            },
            {
              'field': 'desc',
              'value': data.desc,
            },
            {
              'field': 'desc_zh',
              'value': data.desc_zh,
            },
            {
              'field': 'is_public',
              'value': data.isPublic,
            },
          ],
        }],
      };
      const pdata = yield call(magOrg.UpdateOrganizationByID, newData);
      return pdata.data;
    },
    * deleteInitDate({ payload }, { select, call, put }) {
      const { ids } = payload;
      const state = yield select(state => state.magOrg);
      const initData = state.get('initData');
      initData.forEach((item, index) => {
        if (item.id === ids[0]) {
          initData.splice(index, 1);
        }
      });
      yield put({ type: 'getOrganizationByIDsSuccess', payload: initData });
    },
  },
  reducers: {
    getOrganizationByIDsSuccess(state, { payload }) {
      const data = createHiObj(payload);
      const newState = state.withMutations((map) => {
        map.set('allOrgs', data.getData());
        map.set('initData', payload);
      });
      return newState;
    },
  },
};
