/**
 * Created by yangyanmei on 17/6/29.
 */
import { request, config } from '../utils';
const { api } = config;

export async function createUser(email, first_name, gender, last_name, position, sub, src) {
  const user = {
    email,
    first_name,
    gender,
    last_name,
    position,
    sub,
    src,
  };
  return request(api.signup, {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function checkEmail(src, email) {
  return request(api.checkEmail.replace(':src', src).replace(':email', email), {
    method: 'GET',
  });
}


export async function invoke(uid, label) {
  const data = {
    uid,
    label,
  };
  return request(api.invoke, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
export async function revoke(uid, label) {
  const data = {
    uid,
    label,
  };
  return request(api.revoke, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listUsersByRole(role, offset, size) {
  return request(api.listUsersByRole.replace(':role', role).replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}

export async function forgot(params) {
  return request(api.forgot, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function retrieve(data) {
  return request(api.retrieve, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
