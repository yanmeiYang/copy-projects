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

    * fetchPersonLabels({ payload }, { call, put }) {
      const { ids } = payload;
      console.log('****', ids);
      let tagsMap = Map();
      tagsMap = tagsMap.withMutations((map) => {
        for (const id of ids) {
          map.set(id, [id]);
        }
      });
      console.log('****', tagsMap);
      yield put({ type: 'fetchPersonLabelsSuccess', payload: { tagsMap } });

      // const { targetId, tag } = payload;
      // if (!targetId || !tag) {
      //   return false;
      // }
      // const data = yield call(labelService.addLabelToEntity, payload);
      // if (data.success && data.data && data.data.succeed) {
      //   return true;
      //   yield put({ type: 'addSuccess', payload: { tag } });
      // }
      // return false;
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
