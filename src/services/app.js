import { request, config } from '../utils';

const { api } = config;
const { currentUser, userLogout, userLogin } = api;

export async function login(params) {
  return request(userLogin, {
    method: 'post',
    data: params,
  });
}

export async function logout() {
  return request(userLogout, {
    method: 'post',
  });
}

export async function getCurrentUserInfo(params) {
  return request(currentUser, {
    method: 'get',
    data: params,
  });
}
