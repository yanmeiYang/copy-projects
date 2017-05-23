import { request, config } from '../utils';
const { api } = config;

export async function searchPerson(query, offset, size) {
  console.log(api.searchPerson, query);
  return request({
    url: api.searchPerson,
    method: 'GET',
    data: {
      query,
      offset,
      size,
    }
  });
}
