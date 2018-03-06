import { Map } from 'immutable';
import { config } from 'utils';
import { sysconfig } from 'systems';
import { isEqual } from 'lodash';
import * as bridge from 'utils/next-bridge';
import * as ConflictsService from 'services/coi-service';


export default {
  namespace: 'conflicts', // TODO change to coi

  state: Map({
    status: false,
    originTextLeft: '', // 原始数据
    originTextRight: '',
    personListLeft: [], // 处理后的json,
    personListRight: [],
    personInfoLeft: [], // api 返回的数据
    personInfoRight: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: sysconfig.MainListSize,
      total: null,
    },
    realtion: [], // 处理完的所有关系数组
  }),

  subscriptions: {},
  effects: {
    * fetchPersonInfo({ payload }, { select, call, put }) {
      const { personList, cId, originText } = payload;
      // TODO 这里不知道做不做，一上来如果知道id是否填入，估计要做，先备注，和update方法类似
      const state = yield select(state => state.conflicts);
      let personArray;
      if (cId === 'right') {
        personArray = state.get('personListRight');
      } else {
        personArray = state.get('personListLeft');
      }
      const realDate = [];
      const haveIdPerson = [];
      const personMap = {};
      const haveIdIndex = [];
      const noIdIndex = [];
      personArray.forEach((item) => {
        personMap[item.id] = item;
      });
      personList.forEach((item, index) => {
        if (item.id) {
          if (!personMap[item.id]) {
            haveIdPerson.push(item);
            haveIdIndex.push(index);
          }
        } else {
          realDate.push(item);
          noIdIndex.push(index);
        }
      });
      const allIndexArray = [];
      haveIdIndex.forEach((item) => {
        allIndexArray.push(item);
      });
      noIdIndex.forEach((item) => {
        allIndexArray.push(item);
      });
      const persons = realDate.map((person) => {
        const data = {
          action: 'search.search',
          parameters: {
            advquery: {
              texts: [
                {
                  source: 'name',
                  text: person.name,
                },
                {
                  source: 'org',
                  text: person.org,
                }],
            },
            offset: 0,
            size: 1,
            searchType: 'SimilarPerson',
          },
          schema: {
            person: ['id', 'name', 'name_zh', 'profile.affiliation', 'avatar',
              'profile.affiliation_zh', 'profile.position', 'profile.position_zh',
              { indices: ['hindex', 'pubs', 'citations'] }],
          },
        };
        return data;
      });
      let haveIdData;
      let newHaveIdData;
      let newData;
      const personInfoMap = [];
      if (haveIdPerson.length > 0) {
        haveIdData = yield call(ConflictsService.fetchPersonById, haveIdPerson);
      }
      if (realDate.length > 0) {
        newData = yield call(ConflictsService.fetchPersonInfo, persons);
      }
      if (realDate.length === 0 && haveIdPerson.length === 0) {
        yield put({ type: 'noRequest', payload: { personList, cId, originText } });
      }

      if (haveIdPerson.length > 0) {
        if (haveIdData) {
          if (haveIdData.data && haveIdData.data.items) {
            newHaveIdData = haveIdData.data.items;
          }
          newHaveIdData.forEach((data) => {
            personInfoMap.push([data]);
          });
        }
      }


      const data = newData ? newData.data : false;
      if (data) {
        let items = [data];
        if (realDate.length > 1) {
          items = data.data;
        }
        items.forEach((item) => {
          if (item.items) {
            personInfoMap.push(item.items);
          }
        });
      }
      if (personInfoMap.length > 0) {
        yield put({
          type: 'fetchPersonInfoSuccess',
          payload: { personInfoMap, personList, cId, originText, allIndexArray },
        });
      }
    },
    // 粗查
    * getPersonInfo({ payload }, { select, call, put }) {
      const { userNameLeft, userNameRight, personListLeft, personListRight, coyear } = payload;
      let personInfoLeft;
      let personInfoRight;
      if (personListLeft.length > 0 && personListRight.length > 0) {
        personInfoLeft = yield call(ConflictsService.getPersonInfo, personListLeft);
        personInfoRight = yield call(ConflictsService.getPersonInfo, personListRight);
      }
      let personArrayLeft;
      let personArrayRight;
      if (personInfoLeft) {
        const newPersonInfoLeft = bridge.resultToArray(personInfoLeft);
        personArrayLeft = newPersonInfoLeft.map((person) => {
          if (person.items) {
            return person.items;
          } else {
            return [];
          }
        });
      }
      if (personInfoRight) {
        const newPersonInfoRight = bridge.resultToArray(personInfoRight);
        personArrayRight = newPersonInfoRight.map((person) => {
          if (person.items) {
            return person.items;
          } else {
            return [];
          }
        });
      }
      // TODO 处理人的方法 形成二维数组
      const tPersonArrayLeft = ConflictsService.filterPaperAff(personArrayLeft);
      const ePersonArrayLeft = ConflictsService.compareName(personListLeft, tPersonArrayLeft);
      const tPersonArrayRight = ConflictsService.filterPaperAff(personArrayRight);
      const ePersonArrayRight = ConflictsService.compareName(personListRight, tPersonArrayRight);
      const newPersonArrayLeft = ConflictsService.getNameAndId(ePersonArrayLeft);
      const newPersonArrayRight = ConflictsService.getNameAndId(ePersonArrayRight);
      yield put({
        type: 'getPersonInfoSuccess',
        payload: {
          userNameLeft, userNameRight, newPersonArrayLeft,
          newPersonArrayRight, ePersonArrayLeft, ePersonArrayRight,
        },
      });
      yield put({
        type: 'getRelation',
        payload: { coyear },
      });
    },
    * replacePerson({ payload }, { select, call }) {
      const { offset, size, name, org } = payload;
      const { data } = yield call(ConflictsService.replacePerson, name, org, offset, size);
      return data;
    },
    * replaceInfo({ payload }, { select, put }) {
      const { personInfo, index, cId } = payload;
      const state = yield select(state => state.conflicts);
      let newPersonInfo = state.get('personInfoRight');
      if (cId === 'left') {
        newPersonInfo = state.get('personInfoLeft');
      }
      newPersonInfo[index] = [personInfo];
      yield put({
        type: 'replaceInfoSuccess',
        payload: { newPersonInfo, cId, index },
      });
    },
    * getRelation({ payload }, { select, call, put }) {
      const { year } = payload;
      const state = yield select(state => state.conflicts);
      const personListLeft = state.get('personListLeft');
      const personListRight = state.get('personListRight');
      const personInfoLeft = state.get('personInfoLeft');
      const personInfoRight = state.get('personInfoRight');
      // 形成两侧person id的数组
      const personIdLeft = personListLeft.map((person) => {
        return person.id;
      });
      const personIdRight = personListRight.map((person) => {
        return person.id;
      });
      // 形成两侧person Map，key：id，value：person
      const personInfoLeftMap = {};
      const personInfoRightMap = {};
      personInfoLeft.forEach((item) => {
        personInfoLeftMap[item[0].id] = item[0];
      });
      personInfoRight.forEach((item) => {
        personInfoRightMap[item[0].id] = item[0];
      });
      const relationArray = [];
      // TODO 接入三个api
      let coauthor;
      let teacher;
      let affiliation;
      if (personIdLeft.length > 0 && personIdRight.length > 0) {
        coauthor = yield call(ConflictsService.coauthor, personIdLeft, personIdRight, year);
        teacher = yield call(ConflictsService.teacher, personIdLeft, personIdRight);
        affiliation = yield call(ConflictsService.affiliation, personIdLeft, personIdRight);
      }

      // 处理coanthor 数据方法
      if (coauthor && coauthor.data) {
        let newData = [coauthor.data];
        if (coauthor.data.data) {
          newData = coauthor.data.data;
        }
        newData.forEach((data, index) => {
          if (data.items) {
            const leftPersonName = personInfoLeftMap[personIdLeft[index]];
            const name1 = leftPersonName.name_zh || leftPersonName.name;
            data.items.forEach((item) => {
              const relation = {
                name1,
                name2: item.name_zh || item.name,
                type: 'coauthor',
                count: item.count,
                year,
              };
              relationArray.push(relation);
            });
          }
        });
      }
      // 处理teacher
      if (teacher && teacher.data && teacher.data.data) {
        const { data } = teacher.data;
        data.forEach((item) => {
          if (item.items) {
            const { items } = item;
            items.forEach((newItem) => {
              let name1;
              let name2;
              let type = '老师';
              if (newItem.related_persons) {
                if (personInfoLeftMap[newItem.id] &&
                  personInfoRightMap[newItem.related_persons[0].r_id]) {
                  name1 = personInfoLeftMap[newItem.id].name_zh ||
                    personInfoLeftMap[newItem.id].name;
                  name2 = personInfoRightMap[newItem.related_persons[0].r_id].name_zh ||
                    personInfoRightMap[newItem.related_persons[0].r_id].name;
                } else {
                  name2 = personInfoRightMap[newItem.id].name_zh ||
                    personInfoRightMap[newItem.id].name;
                  name1 = personInfoLeftMap[newItem.related_persons[0].r_id].name_zh ||
                    personInfoLeftMap[newItem.related_persons[0].r_id].name;
                  type = '学生';
                }
                const relation = {
                  name1,
                  name2,
                  type, // newItem.related_persons[0].relations[0].type,
                };
                relationArray.push(relation);
              }
            });
          }
        });
      }
      // 处理aff
      if (affiliation && affiliation.data) {
        const { items } = affiliation.data;
        if (items) {
          items.forEach((item) => {
            const name1 = personInfoLeftMap[item.fisrt_person.id].name_zh ||
              personInfoLeftMap[item.fisrt_person.id].name;
            const name2 = personInfoRightMap[item.second_person.id].name_zh ||
              personInfoRightMap[item.second_person.id].name;
            const affiliation1 = item.fisrt_person.affiliation_zh ||
              item.fisrt_person.affiliation;
            const affiliation2 = item.second_person.affiliation_zh ||
              item.second_person.affiliation;
            const rate = Math.round(parseFloat(item.similarity) * 100);
            const relation = {
              name1,
              name2,
              type: 'affiliation',
              similarity: `${rate}%`,
              affiliation1,
              affiliation2,
            };
            relationArray.push(relation);
          });
        }
      }
      yield put({ type: 'getRelationSuccess', payload: { relationArray } });
    },
    * deletePerson({ payload }, { select, put }) {
      const { index, cId } = payload;
      const state = yield select(state => state.conflicts);
      const personListLeft = state.get('personListLeft');
      const personListRight = state.get('personListRight');
      const personInfoLeft = state.get('personInfoLeft');
      const personInfoRight = state.get('personInfoRight');
      if (cId === 'left') {
        personListLeft.splice(index, 1);
        personInfoLeft.splice(index, 1);
      } else {
        personListRight.splice(index, 1);
        personInfoRight.splice(index, 1);
      }
      yield put({
        type: 'deletePersonSuccess',
        payload: { personListLeft, personListRight, personInfoLeft, personInfoRight },
      });
    },
  },
  reducers: {
    fetchPersonInfoSuccess(state, {
      payload: {
        personInfoMap, cId,
        personList, originText, allIndexArray,
      },
    }) {
      let personListKey = 'personListRight';
      let originTextKey = 'originTextRight';
      let personInfo = 'personInfoRight';
      if (cId === 'left') {
        personListKey = 'personListLeft';
        originTextKey = 'originTextLeft';
        personInfo = 'personInfoLeft';
      }
      const personInfoArray = state.get(personInfo);
      if (allIndexArray.length > 0) {
        allIndexArray.forEach((item, index) => {
          personInfoArray.splice(item, 0, personInfoMap[index]);
        });
      }
      const newPersonInfoMap = {};
      personInfoArray.forEach((item) => {
        newPersonInfoMap[item[0].id] = item;
      });
      const newPersonList = personList.map((person, index) => {
        const data = {
          name: person.name,
          org: person.org,
          id: personInfoArray[index].length > 0 ? personInfoArray[index][0].id : '',
        };
        return data;
      });
      const newPersonInfo = newPersonList.map((person) => {
        return newPersonInfoMap[person.id];
      });
      const newState = state.withMutations((map) => {
        const status = state.get('status');
        map.set('status', !status);
        map.set(personListKey, newPersonList);
        map.set(originTextKey, originText);
        map.set(personInfo, newPersonInfo);
      });
      return newState;
    },
    noRequest(state, { payload: { personInfoMap, cId, personList, originText } }) {
      let personListKey = 'personListRight';
      let originTextKey = 'originTextRight';
      let personInfo = 'personInfoRight';
      if (cId === 'left') {
        personListKey = 'personListLeft';
        originTextKey = 'originTextLeft';
        personInfo = 'personInfoLeft';
      }
      const personInfoArray = state.get(personInfo);
      const newPersonInfoMap = {};
      personInfoArray.forEach((item) => {
        newPersonInfoMap[item[0].id] = item;
      });
      const newPersonInfo = personList.map((person) => {
        return newPersonInfoMap[person.id];
      });
      const newState = state.withMutations((map) => {
        const status = state.get('status');
        map.set('status', !status);
        map.set(personListKey, personList);
        map.set(originTextKey, originText);
        map.set(personInfo, newPersonInfo);
      });
      return newState;
    },
    replaceInfoSuccess(state, { payload: { newPersonInfo, cId, index } }) {
      let personData = 'personListLeft';
      let personInfo = 'personInfoLeft';
      if (cId === 'right') {
        personData = 'personListRight';
        personInfo = 'personInfoRight';
      }
      const personListDate = state.get(personData);
      personListDate[index].id = newPersonInfo[index][0].id;
      const newState = state.withMutations((map) => {
        map.update(personInfo, value => newPersonInfo);
        map.update(personData, value => personListDate);
      });

      return newState;
    },

    updatePaginationParams(state, { payload: { offset, total } }) {
      const current = Math.floor(offset / sysconfig.MainListSize) + 1;
      const newPagination = state.get('pagination');
      newPagination.total = total;
      newPagination.offset = offset;
      newPagination.current = current;

      const newState = state.withMutations((map) => {
        map.update('pagination', value => newPagination);
      });
      return newState;
    },

    updatePersonList(state, { payload: { name, org, cId, index } }) {
      let personData = 'personListLeft';
      if (cId === 'right') {
        personData = 'personListRight';
      }
      const personListDate = state.get(personData);
      personListDate[index].name = name;
      personListDate[index].org = org;
      const newState = state.withMutations((map) => {
        map.update(personData, value => personListDate);
      });
      return newState;
    },

    getRelationSuccess(state, { payload: { relationArray } }) {
      state.set('relation', relationArray);
      console.log('newstate', state.get('originTextLeft'));
      return state.set('relation', relationArray);
    },
    getPersonInfoSuccess(state, {
      payload: {
        userNameLeft, userNameRight, newPersonArrayLeft,
        newPersonArrayRight, ePersonArrayLeft, ePersonArrayRight,
      },
    }) {
      const newState = state.withMutations((map) => {
        map.set('originTextLeft', userNameLeft);
        map.set('originTextRight', userNameRight);
        map.set('personListLeft', newPersonArrayLeft);
        map.set('personListRight', newPersonArrayRight);
        map.set('personInfoLeft', ePersonArrayLeft);
        map.set('personInfoRight', ePersonArrayRight);
      });
      return newState;
    },
    deletePersonSuccess(state, {
      payload: {
        personListLeft, personListRight,
        personInfoLeft, personInfoRight,
      },
    }) {
      const newState = state.withMutations((map) => {
        map.set(personListLeft);
        map.set(personListRight);
        map.set(personInfoLeft);
        map.set(personInfoRight);
      });
      return newState;
    },
  },
};

