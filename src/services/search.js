import { request, config } from '../utils';

const { api } = config;

export async function searchPerson(query, offset, size) {
  return request({
    url: api.searchPerson,
    method: 'GET',
    data: {
      query,
      offset,
      size,
    },
  });
}

export async function getSeminars(offset, size) {
  console.log(api.getSeminars.replace(':offset', offset).replace(':size', size));
  return request({
    url: api.getSeminars.replace(':offset', offset).replace(':size', size),
  });
}

export async function getRoster() {
  return request({
    url: api.getRoster,
  })

}
