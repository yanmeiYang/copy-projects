import * as expertBaseService from 'services/expert-base';
import * as tobProfileService from 'services/2b-profile';

const JOINBYDOT = '.';

export default {

  namespace: 'personComments',

  state: {
    tobProfileMap: {},
  },

  subscriptions: {},

  effects: {
    * getTobProfileList({ payload }, { call, put }) {
      const { persons } = payload;
      const ids = [];
      for (const person of persons) {
        ids.push(person.id);
      }
      const { data } = yield call(expertBaseService.getToBProfileByAid, ids.join(JOINBYDOT));
      yield put({ type: 'commentToMap', payload: { data } });
    },

    * createComment({ payload }, { call, put, select }) {
      const { person, uid, user_name, comment } = payload;
      const aid = person.id;
      // 创建新增加的comment
      const tempComment = [{
        create_user: { time: Date.parse(new Date()), name: user_name, uid },
        comment,
      }];

      const tobProfileMap = yield select(state => state.personComments.tobProfileMap);
      const tbp = tobProfileMap.get(aid);
      // 判断用户是否在tobprofile，不在则创建，否则更新extra
      if (tbp && tbp.id) {
        // 获取现有的tobprofile中的comments
        const existComments = (tbp.extra && tbp.extra.comments) || [];
        const newComments = existComments.concat(tempComment);
        const newExtra = { ...(tbp.extra || {}), comments: newComments };
        // 更新extra中comment
        // updateToBProfileExtra 需要传的是id，而不是aid
        const updateFeedBack = yield call(expertBaseService.updateToBProfileExtra, tbp.id, newExtra);
        if (updateFeedBack.data.status) {
          yield put({
            type: 'updateTobProfileSuccess',
            payload: { aid, newExtra },
          });
        } else {
          console.log('error');
        }
      } else {
        const newData = {
          sid: '', name: person.name || '', name_zh: person.name_zh || '',
          gender: 0, aff: '', email: [], aid, type: 'c', extra: { comments: tempComment },
        };
        // 插入一条tobProfile
        const createTobProfile = yield call(tobProfileService.addProfileSuccess, newData);
        if (createTobProfile.data.status) {
          const { data } = yield call(expertBaseService.getToBProfileByAid, aid);
          if (data.status) {
            yield put({
              type: 'insertTobProfileSuccess',
              payload: { data: tobProfileMap.set(aid, data.data[0]) },
            });
          }
        } else {
          console.log('error');
        }
      }
    },

    * deleteTheComment({ payload }, { call, put, select }) {
      const { aid, index } = payload;
      const tobProfileMap = yield select(state => state.personComments.tobProfileMap);
      const tbp = tobProfileMap.get(aid);
      if (tbp && tbp.id) {
        const existComments = (tbp.extra && tbp.extra.comments) || [];
        const newComments = existComments.splice(index, 1);
        const newExtra = { ...(tbp.extra || {}), comments: existComments };
        const updateFeedBack = yield call(expertBaseService.updateToBProfileExtra, tbp.id, newExtra);
        if (updateFeedBack.data.status) {
          yield put({
            type: 'updateTobProfileSuccess',
            payload: { aid, newExtra },
          });
        } else {
          console.log('update error');
        }
      } else {
        console.log('error');
      }

    },

  },


  reducers: {
    commentToMap(state, { payload: { data } }) {
      const tempComments = new Map();
      for (const tobProfile of data.data) {
        tempComments.set(tobProfile.aid, tobProfile);
      }
      return { ...state, tobProfileMap: tempComments };
    },

    updateTobProfileSuccess(state, { payload: { aid, newExtra } }) {
      state.tobProfileMap.get(aid).extra = newExtra;
      return { ...state, tobProfileMap: state.tobProfileMap };
    },

    insertTobProfileSuccess(state, { payload: { data } }) {
      return { ...state, tobProfileMap: data };
    },

  },

};
