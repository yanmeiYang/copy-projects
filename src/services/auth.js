/**
 * Created by yangyanmei on 17/6/29.
 */
import { request, config } from '../utils';
const { api } = config;

export async function createUser(user) {
  return request(api.signup, {
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export async function checkEmail(email){
  return request(api.checkEmail.replace(':email',email),{
    method: 'GET',
  })
}
