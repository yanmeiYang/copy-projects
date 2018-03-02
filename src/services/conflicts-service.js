import { request, nextAPI, config } from 'utils';
import { Action, apiBuilder, F } from 'utils/next-api-builder';

export async function fetchPersonInfo(payload) {
  return nextAPI({ data: payload });
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
