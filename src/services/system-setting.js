/**
 * Created by yangyanmei on 17/8/10.
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
