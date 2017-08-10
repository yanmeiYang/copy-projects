/**
 * Created by yangyanmei on 17/8/10.
 */
import { request, config } from '../utils';

const { api, source } = config;

export async function emailTemplate(params) {
  const { type } = params;
  const data = {
    sender: params.sender,
    subject: params.subject,
    body: params.body,
  };
  return request(api.emailTemplate.replace(':src', source).replace(':type', type), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
