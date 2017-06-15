import { request, config } from '../utils';

const { api } = config;

export async function getPerson(id) {
  // TODO Extract util to automatically replace parameters.
  // TODO Make this transparency to developers.
  return request(api.personProfile.replace(':id', id), {
    method: 'GET',
  });
}

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

export function getProfileUrl(name, id) {
  let str = '';
  if (name) {
    str = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  // return `/person/${str}/${id}`;
  return `/person/${id}`;
}

export function getAMinerProfileUrl(name, id) {
  let str = '';
  if (name) {
    str = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  // return `/person/${str}/${id}`;
  return `${config.basePageURL}/profile/${str}/${id}`;
}

/** Visualization Data */
export async function getInterestVisData(personId) {
  return request(api.interests.replace(':id', personId));
}

export function listPersonByIds(ids) {
  return request('https://api.aminer.org/api/person/batch-list', {
      method: 'PUT',
      body: JSON.stringify({
        ids: ids,
      }),
    });
}
