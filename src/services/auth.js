/**
 * Created by yangyanmei on 17/6/29.
 */
import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

// export async function login(params) {
//   return request(api.userLogin, {
//     method: 'post',
//     data: params,
//   });
// }

export async function login(data) {
  const { src, ...newData } = data;
  newData.src = src || sysconfig.UserAuthSystem;
  newData.persist = true;
  return request(api.userLogin, {
    method: 'post',
    data: newData,
    // body: JSON.stringify({
    //   ...data,
    //   persist: true,
    //   src: data.src || sysconfig.UserAuthSystem,
    // }),
  });
}

export async function logout(optionalToken) {
  const options = { method: 'post' };
  if (optionalToken) {
    // override toke when call request.
    options.token = optionalToken;
  }
  return request(api.userLogout, options);
}

export async function getCurrentUserInfo(params) {
  const { token, ...data } = params;
  const options = { method: 'get', data };
  if (token) {
    options.token = token;
  }
  return request(api.currentUser, options);
}

// TODO should in use service.
export async function createUser(email, first_name, gender, last_name, position, sub, password, source) {
  const src = source || sysconfig.SOURCE;
  const user = {
    email,
    first_name,
    gender,
    last_name,
    position,
    sub,
    src,
  };
  if (password) {
    user.password = password;
  }
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


export async function invoke(uid, label, token) {
  let setLabel;
  if (label === sysconfig.SOURCE) {
    setLabel = label;
  } else {
    setLabel = `${sysconfig.SOURCE}_${label}`;
  }
  const data = {
    uid,
    label: setLabel,
  };
  const param = { method: 'POST', body: JSON.stringify(data) };
  if (token) {
    param.token = token;
  }
  return request(api.invoke, param);
}

export async function revoke(uid, label) {
  const data = {
    uid,
    label: `${sysconfig.SOURCE}_${label}`,
  };
  return request(api.revoke, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listUsersByRole(offset, size, source) {
  const src = source || sysconfig.SOURCE;
  return request(api.listUsersByRole.replace(':role', src).replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}

export async function forgot(params) {
  const data = { ...params, token: sysconfig.SOURCE };
  return request(api.forgot, {
    method: 'POST',
    body: JSON.stringify({ ...data, src: sysconfig.UserAuthSystem }),
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
