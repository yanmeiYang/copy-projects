/**
 * Created by yangyanmei on 17/6/29.
 */
import { request, config } from '../utils';
const { api } = config;

export async function createUser(email, first_name, gender, last_name, position, sub) {
  const user = {
    email: email,
    first_name: first_name,
    gender: gender,
    last_name: last_name,
    position: position,
    sub: sub
  };
  return request(api.signup, {
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export async function checkEmail(email) {
  return request(api.checkEmail.replace(':email', email), {
    method: 'GET',
  })
}


export async function invoke(uid, label) {
  const data = {
    uid: uid,
    label: label
  };
  return request(api.invoke, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
export async function revoke(uid, label) {
  const data = {
    uid: uid,
    label: label
  };
  return request(api.revoke, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function listUsersByRole(role, offset, size) {
  return request(api.listUsersByRole.replace(':role', role).replace(':offset', offset).replace(':size', size), {
    method: 'GET'
  })
}

export async function forgot(params) {
  return request(api.forgot,{
    method: 'POST',
    body: JSON.stringify(params)
  })
}
