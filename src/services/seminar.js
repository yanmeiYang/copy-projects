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
    body: JSON.stringify(data)
  })
}

export async function postSeminarActivity(data) {
  return request(api.postActivity, {
    method: 'POST',
    body: JSON.stringify(data)
  })

}

export async function searchActivity(query, offset, size) {
  let data = {
    query: query,
    offset,
    size
  };
  return request(api.searchActivity, {
    method: 'GET',
    data,
  })

}

export async function deleteActivity(id, body) {
  return request(api.deleteActivity.replace(':id', id), {
    method: 'POST',
    body: JSON.stringify(body)
  })
}

export async function getCommentFromActivity(id, offset, size) {
  return request(api.getCommentFromActivity.replace(':id', id).replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  })
}

export async function addCommentToActivity(id, data) {
  console.log(data);
  return request(api.addCommentToActivity.replace(':id', id), {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
