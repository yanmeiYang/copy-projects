import { request, config } from '../../src/utils/index';

const { api } = config;

export async function query(params) {
  return request(
    {
      url: api.users,
      method: 'get',
      data: params,
    });
}
