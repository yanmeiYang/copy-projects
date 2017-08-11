/**
 * Created by yangyanmei on 17/6/29.
 */
import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api, source } = config;

export async function createUser(email, first_name, gender, last_name, position, sub, src) {
  const user = {
    email,
    first_name,
    gender,
    last_name,
    position,
    sub,
    src: source,
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
  let setLabel;
  if (label === source) {
    setLabel = label;
  } else {
    setLabel = `${source}_${label}`;
  }
  const data = {
    uid,
    label: setLabel,
  };

  return request(api.invoke, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function revoke(uid, label) {
  const data = {
    uid,
    label: `${source}_${label}`,
  };
  return request(api.revoke, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listUsersByRole(offset, size) {
  return request(api.listUsersByRole.replace(':role', source).replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}

export async function forgot(params) {
  return request(api.forgot, {
    method: 'POST',
    body: JSON.stringify({ ...params, src: sysconfig.UserAuthSystem }),
  });
}

export async function retrieve(data) {
  return request(api.retrieve, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProfile(id, name) {
  // f的取值可以是 "addr", "fname", "lname", "name", "gender", "org", "sub", "title", "tags"
  const data = { m: [{ f: 'name', v: name }] };
  return request(api.updateProfile.replace(':id', id), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function login(data) {
  return request(api.userLogin, {
    method: 'post',
    body: JSON.stringify({
      ...data,
      persist: true,
      src: sysconfig.UserAuthSystem,
    }),
  });
}
