import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;
const { userLogin } = api;

export async function login(data) {
  data.persist = true;
  data.src = sysconfig.UserAuthSystem;
  return request(userLogin, {
    method: 'post',
    body: JSON.stringify(data),
  });
}
