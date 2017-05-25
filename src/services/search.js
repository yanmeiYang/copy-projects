import { request, config } from '../utils';

const { api } = config;

export async function searchPerson(query, offset, size) {
  return request(api.searchPerson, {
    method: 'GET',
    data: {
      query,
      offset,
      size,
    },
  });
}

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}
