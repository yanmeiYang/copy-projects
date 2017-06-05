import { request, config } from '../utils';

const { api } = config;
const { userLogin } = api;

export async function login(data) {
  data.persist = true;
  return request(userLogin, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
