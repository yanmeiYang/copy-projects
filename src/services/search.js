import { request, config } from '../utils';

const { api } = config;

export async function searchPerson(query, offset, size) {
  return request(api.searchPersonInBase.replace(':ebid', '58ddbc229ed5db001ceac2a4'), {
    method: 'GET',
    data: {
      term: query,
      offset,
      size,
    },
  });
}

export async function searchPersonAgg(query, offset, size) {
  const data = {
    term: query,
    offset,
    size,
  };
  console.log('haha');
  return request(api.searchPersonInBaseAgg.replace(':ebid', '58ddbc229ed5db001ceac2a4'), {
    method: 'GET',
    data,
  });
}

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

