/**
 * Bo Gao on 2017-10-27
 */
import { config } from 'utils';
import * as bridge from 'utils/next-bridge';
import * as labelService from 'services/label-service';

export default {
  namespace: 'commonLabels',

  state: {
    tagMap: {},
  },

  subscriptions: {},

  effects: {
    // In Component Effects. Hahahaha
    * add({ payload }, { call, put }) {
      console.log(payload);
      const { targetId, tag } = payload;
      if (!targetId || !tag) {
        return false;
      }
      const data = yield call(labelService.addLabelToEntity, payload);
      if (data.success && data.data && data.data.succeed) {
        return true;
        // yield put({ type: 'addSuccess', payload: { tag } });
      }
      return false;
    },
  },

  reducers: {
    addSuccess(state, { payload: { tag } }) {
      const newTags = [...(state.tags || []), tag];
      return { ...state, tags: newTags };
    },
  },

};
