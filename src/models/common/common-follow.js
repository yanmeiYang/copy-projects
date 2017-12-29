import { Map } from 'immutable';
import { config } from 'utils';
import * as followService from 'services/follow-service';


export default {
  namespace: 'commonFollow',

  state: {
    followMap: null, //{aid : [follow]}
  },

  subscriptions: {},

  effects: {
    // 增加follow tag
    // * add({ payload }, { call, put }) {
    //   const { followId, follow } = payload;
    //   if (!followId || !follow) {
    //     return false;
    //   }
    //   const data = yield call(service, payload);
    //   if (data.success && data.data && data.data.succeed) {
    //     return true;
    //   }
    //   return false;
    // },
    //
    // * remove({ payload }, { call, put }) {
    //   const { followId, follow } = payload;
    //   if (!followId || !follow) {
    //     return false;
    //   }
    //   const data = yield call(service, payload);
    //   if (data.success && data.data && data.data.succeed) {
    //     return true;
    //   }
    //   return false;
    // },

    * fetchFollowStatus({ payload }, { call, put }) {
      const { success, data } = yield call(followService.fetchLabelsByIds, payload);
      if (success && data) {
        let followMap = Map();
        if (data && data.items && data.items.length > 0) {
          followMap = followMap.withMutations((map) => {
            for (const item of data.items) {
              const tags = item && item.dims && item.dims.systag;
              if (tags && tags.length > 0) {
                map.set(item.id, tags);
              }
            }
          });
        }
        console.log('****', followMap);
        yield put({ type: 'fetchFollowStatusSuccess', payload: { followMap } });
      } else {
        console.error('Error when calling things....');
      }
    },
  },
  reducers: {
    addSuccess(state, { payload: { follow } }) {
      const newFollow = [...(state.follow || []), follow];
      return { ...state, follow: newFollow };
    },
    fetchFollowStatusSuccess(state, { payload: { followMap } }) {
      console.log('****', followMap);
      return { ...state, followMap };
    },
  },
}
