/**
 * Bo Gao on 2017-10-27
 */
import { Map } from 'immutable';
import { config } from 'utils';
import * as bridge from 'utils/next-bridge';
import * as labelService from 'services/label-service';

export default {
  namespace: 'commonLabels',

  state: {

    tagsMap: null, // {aid : [tags]}
  },

  subscriptions: {},

  effects: {
    // In Component Effects. Hahahaha
    * add({ payload }, { call, put }) {
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

    * remove({ payload }, { call, put }) {
      const { targetId, tag } = payload;
      if (!targetId || !tag) {
        return false;
      }
      const data = yield call(labelService.removeLabelFromEntity, payload);
      if (data.success && data.data && data.data.succeed) {
        return true;
        // yield put({ type: 'addSuccess', payload: { tag } });
      }
      return false;
    },

    * fetchPersonLabels({ payload }, { call, put }) {
      const newPayload = payload;
      const { success, data } = yield call(labelService.fetchLabelsByIds, newPayload);
      if (success && data) {
        console.log('****>>>>', data);
        let tagsMap = Map();
        if (data && data.items && data.items.length > 0) {
          tagsMap = tagsMap.withMutations((map) => {
            for (const item of data.items) {
              const tags = item && item.dims && item.dims.systag;
              if (tags && tags.length > 0) {
                map.set(item.id, tags);
              }
            }
          });
        }
        console.log('****', tagsMap);
        yield put({ type: 'fetchPersonLabelsSuccess', payload: { tagsMap } });
      } else {
        console.error('Error when calling things....');
      }
    },
  },

  reducers: {
    addSuccess(state, { payload: { tag } }) {
      const newTags = [...(state.tags || []), tag];
      return { ...state, tags: newTags };
    },

    fetchPersonLabelsSuccess(state, { payload: { tagsMap } }) {
      console.log('****', tagsMap);
      return { ...state, tagsMap };
    },
  },

};
