/**
 * Created by yangyanmei on 17/8/12.
 */
import { request, config } from '../utils';

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
