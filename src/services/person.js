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

