/**
 * Created by yangyanmei on 17/8/12.
 */
import { request, config, nextAPI } from '../utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { sysconfig } from "systems";

const { api } = config;

export async function emailTemplate(params) {
  const { src, type } = params;
  const data = {
    sender: params.sender,
    subject: params.subject,
    body: params.body,
  };
  return request(api.emailTemplate.replace(':src', src).replace(':type', type), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getTemplate(params) {
  const { src, type } = params;
  return request(api.getTemplate.replace(':src', src).replace(':type', type), {
    method: 'GET',
  });
}

export async function getRoleAndPrivilegeBySys(payload) {
  const { src } = payload;
  const nextapi = apiBuilder.create(Action.tob.roles, 'roles')
    .param({ src });
  return nextAPI({ data: [nextapi.api] });
}

export async function getRoleAndPrivilegeById(payload) {
  const { src } = payload;
  const nextapi = apiBuilder.create(Action.tob.roles, 'roles')
    .param({ src });
  return nextAPI({ data: [nextapi.api] });
}
