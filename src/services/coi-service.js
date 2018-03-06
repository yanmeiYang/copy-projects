import { request, nextAPI, config } from 'utils';
import { Action, apiBuilder, F } from 'utils/next-api-builder';

export async function fetchPersonInfo(payload) {
  return nextAPI({ data: payload });
}

export async function getPersonInfo(payload) {
  const data = payload.map((person) => {
    const item = {
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
        size: 20,
        searchType: 'SimilarPerson',
      },
      schema: {
        person: ['id', 'name', 'name_zh', 'profile.affiliation', 'avatar',
          'profile.affiliation_zh', 'profile.position', 'profile.position_zh',
          { indices: ['hindex', 'pubs', 'citations'] }],
      },
    };
    return item;
  });
  return nextAPI({ data });
}

export async function fetchPersonById(payload) {
  console.log('payload', payload);
  const ids = payload.map((person) => {
    return person.id;
  });
  const nextapi = apiBuilder.create(Action.search.search, 'search')
    .param({ ids })
    .schema({
      person: ['id', 'name', 'name_zh', 'avatar',
        { profile: ['position', 'affiliation'] },
        { indices: ['hindex', 'pubs', 'citations'] },
      ],
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function replacePerson(name, org, offset, size) {
  // const { selectPerson } = payload;
  const data = [{
    action: 'search.search',
    parameters: {
      advquery: {
        texts: [
          {
            source: 'name',
            text: name,
          },
          {
            source: 'org',
            text: org || '',
          }],
      },
      offset,
      size,
      searchType: 'SimilarPerson',
    },
    schema: {
      person: ['id', 'name', 'name_zh', 'profile.affiliation', 'avatar',
        'profile.affiliation_zh', 'profile.position', 'profile.position_zh',
        { indices: ['hindex', 'pubs', 'citations'] }],
    },
  }];

  return nextAPI({ data });
}

export async function coauthor(personIdLeft, personIdRight, year) {
  const conflictId = personIdLeft.map((person) => {
    const data = {
      action: 'dm_person.coauthor',
      parameters: {
        id: person,
        filtered_ids: personIdRight,
        years: parseInt(year),
        top: 10,
      },
    };
    return data;
  });
  return nextAPI({ data: conflictId });
}

export async function teacher(personIdLeft, personIdRight) {
  const data = [{
    action: 'person.GetRelation',
    parameters: {
      ids: personIdLeft,
      rids: personIdRight,
    },
  }, {
    action: 'person.GetRelation',
    parameters: {
      ids: personIdRight,
      rids: personIdLeft,
    },
  }];
  return nextAPI({ data });
}

export async function affiliation(personIdLeft, personIdRight) {
  const data = [{
    action: 'dm_person.SimilarAddress',
    parameters: {
      first_ids: personIdLeft,
      second_ids: personIdRight,
      similarity: 0,
    },
  }];
  return nextAPI({ data });
}


export function compareName(nameObjList, callNameObjList) {
  const endNameObjList = [];
  for (let i = 0; i < nameObjList.length; i++) {
    const nList = nameObjList[i].name.toLowerCase().split(' ');
    for (let j = 0; j < callNameObjList[i].length; j++) {
      const cList = callNameObjList[i][j].name.toLowerCase().split(' ');
      if (nList.length === 2 && nList[0] === cList[0] && nList[1] === cList[1]) {
        endNameObjList.push([callNameObjList[i][j]]);
      }
      if (nList.length === 3 && nList[0] === cList[0] && nList[2] === cList[2]) {
        endNameObjList.push([callNameObjList[i][j]]);
      }
      if (nList.length !== 2 && nList.length !== 3 && nList === cList) {
        endNameObjList.push([callNameObjList[i][j]]);
      }
    }
  }
  return endNameObjList;
}

export function filterPaperAff(callNameObjList) {
  const rList = [];
  for (const nameObj of callNameObjList) {
    const personList = [];
    for (const obj of nameObj) {
      if (obj.indices && obj.indices.pubs && obj.indices.pubs > 0 &&
        obj.profile && obj.profile.affiliation && obj.profile.affiliation !== '') {
        personList.push(obj);
      }
    }
    rList.push(personList);
  }
  return rList;
}

export function getNameAndId(personArray) {
  const nameAndId = personArray.map((person) => {
    const data = {
      name: person[0].name,
      id: person[0].id,
    };
    return data;
  });
  return nameAndId;
}

export function stringToJson(data) {
  const personList = [];
  const info = data.split('\n');
  for (const item of info) {
    if (item.trim() !== '') {
      const changeItem = item.trim().replace(/，/g, ',');
      const person = changeItem.split(',');
      const regex = /^[a-zA-Z0-9]{24}$/;
      let id = '';
      let name = '';
      let org = '';
      const pLenght = person.length;
      if (regex.test(person[0])) {
        if (pLenght >= 2) {
          id = person[0];
          name = person[1];
          const orgList = pLenght > 2 ? person.slice(2, pLenght) : [];
          org = orgList.join(',');
        }
      } else if (person[0] === '' && pLenght > 1) {
        name = person[1];
        const orgList = pLenght > 1 ? person.slice(2, pLenght) : [];
        org = orgList.join(',');
      } else {
        name = person[0];
        const orgList = pLenght > 1 ? person.slice(1, pLenght) : [];
        org = orgList.join(',');
      }
      // todo json数据格式处理
      if (name !== '') {
        personList.push({ name, org, id });
      }
    }
  }
  return personList;
};
