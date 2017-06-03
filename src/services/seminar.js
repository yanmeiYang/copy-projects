/**
 * Created by yangyanmei on 17/5/26.
 */
import { request, config } from '../utils';

const { api } = config;

export async function getSeminar(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}

export async function getSeminarById(id) {
  return request(api.getActivityById.replace(':id', id), {
    method: 'GET',
  });
}

export async function getSpeakerSuggest(data) {
  return request(api.speakerSuggest, {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify(data)
  })
}

export async function postSeminarActivity(data) {
  return request(api.postActivity, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    },
    body: JSON.stringify(data)
  })

}
