import pathToRegexp from 'path-to-regexp';
import * as personService from '../services/person';

export default {

  namespace: 'aminerPerson',

  state: {
    personId: '',
    profile: {},
    skillsUp: {},
    skillsDown: {},
    skillsModal: {},
    results: [],
    avgScores: [],
    hideActivityMoreBtn: false,
    offset: 0,
    query: null,
    isMotion: localStorage.getItem('antdAdminUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 30,
      total: null,
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen((location) => {
        const match = pathToRegexp('/p/:id').exec(location.pathname);
        if (match) {
          const personId = decodeURIComponent(match[1]);
          // console.log('personId is :', personId);
          dispatch({ type: 'getPerson', payload: { personId } });
          dispatch({ type: 'getActivityAvgScoresByPersonId', payload: { id: personId } });
          // dispatch({ type: 'setParams', payload: { personId } });
        }
      });
    },
  },

  effects: {
    *getPerson({ payload }, { call, put }) {  // eslint-disable-line
      // console.log('effects: getPerson', payload);
      const { personId } = payload;
      const data = yield call(personService.getPerson, personId);
      yield put({ type: 'getPersonSuccess', payload: { data } });
    },
    *getActivityAvgScoresByPersonId({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(personService.getActivityAvgScoresByPersonId, id);
      yield put({ type: 'getActivityAvgScoresByPersonIdSuccess', payload: { data } });
    },
    //this is used in the new aminer PersonPage--Tabzone--Skills
    *getPersonSkillsByParams({ payload }, { call, put, all }) {
      const { paramsUp, paramsDown, paramsModal } = payload;
      const [dataUp, dataDown, dataModal] = yield all([
        call(personService.getPersonSkills, paramsUp),
        call(personService.getPersonSkills, paramsDown),
        call(personService.getPersonSkills, paramsModal),
      ]);
      const data = { dataUp, dataDown, dataModal };
      yield put({ type: 'getPersonSkillsByParamsSuccess', payload: { data } });
    },
  },

  reducers: {
    // setParams(state, { payload: { query, offset, size } }) {
    //   console.log('reducers:setParams ');
    //   return { ...state, query, offset, pagination: { pageSize: size } };
    // },

    /* update person profile info. */

    getPersonSuccess(state, { payload: { data } }) {
      // console.log('reducers:getPersonSuccess', data.data);
      return { ...state, profile: data.data };
    },

    getActivityAvgScoresByPersonIdSuccess(state, { payload: { data } }) {
      return { ...state, avgScores: data.indices };
    },

    getPersonSkillsByParamsSuccess(state, { payload: { data } }) {
      console.log('getSkillssuccess');
      const { dataUp, dataDown, dataModal } = data;
      return { ...state, skillsUp: dataUp.data, skillsDown: dataDown.data, skillsModal: dataModal.data };
    },
  },

};