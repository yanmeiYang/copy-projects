/**
 * Created by ranyanchuan on 2018/2/5.
 */

import { request, config } from 'utils';

const { api } = config;
export async function getRegisterInfo(params) {
  const { email } = params;
  if (email === 'xt20110702@163.com') {
    return true;
  } else {
    return true;
  }
}
export async function getFollowInfo(params) {
  const { email } = params;
  if (email === 'xt20110702@163.com') {
    return true;
  } else {
    return false;
  }
}

export async function delFollowInfo(params) {
  const { email } = params;
  return true;
}

export async function addFollowInfo(params) {
  const { email } = params.values;
  if (email === 'xt20110702@163.com') {
    return { status: true, isRegister: true };
  } else {
    return { status: true, isRegister: false };
  }
}
