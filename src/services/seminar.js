/**
 * Created by yangyanmei on 17/5/26.
 */
import { request, config } from '../utils';
import { externalRequest } from '../utils/request';

const { api } = config;
const joint = '---';

export async function getSeminar(offset, size, data) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size), {
    method: 'GET',
    data,
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
    body: JSON.stringify(data),
  });
}

export async function postSeminarActivity(data) {
  return request(api.postActivity, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSeminarActivity(data) {
  return request(api.updateActivity, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchActivity(data) {
  return request(api.searchActivity, {
    method: 'GET',
    data,
  });
}

export async function deleteActivity(id, body) {
  return request(api.deleteActivity.replace(':id', id), {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getCommentFromActivity(id, offset, size) {
  return request(api.getCommentFromActivity.replace(':id', id).replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}

export async function addCommentToActivity(id, data) {
  return request(api.addCommentToActivity.replace(':id', id), {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteCommentFromActivity(id) {
  return request(api.deleteCommentFromActivity.replace(':id', id), {
    method: 'DELETE',
  });
}

export async function updateOrSaveActivityScore(src, actid, aid, key, score, lvtime) {
  return request(api.updateOrSaveActivityScore.replace(':src', src).replace(':actid', actid).replace(':aid', aid).replace(':key', key).replace(':score', score).replace(':lvtime', lvtime), {
    method: 'POST',
  });
}

export async function listActivityScores(uid, src, actid) {
  return request(api.listActivityScores.replace(':uid', uid).replace(':src', src).replace(':actid', actid), {
    method: 'GET',
  });
}

export async function getActivityScore(uid, src, actid, aid, key) {
  return request(api.getActivityScore.replace(':uid', uid).replace(':src', src).replace(':actid', actid).replace('aid', aid).replace(':key', key), {
    method: 'GET',
  });
}

export async function getStatsOfCcfActivities() {
  return request(api.getStatsOfCcfActivities, {
    method: 'GET',
  });
}

export async function keywordExtraction(payload) {
  return externalRequest(api.keywordExtraction, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getTopMentionedTags(src, num) {
  return request(api.getTopMentionedTags.replace(':src', src).replace(':num', num), {
    method: 'GET',
  });
}

export function getValueByJoint(name) {
  if (name) {
    const str = name.split(joint);
    if (str.length > 0) {
      return str[str.length - 1];
    } else {
      return name;
    }
  }
}

export function contactByJoint(first, second) {
  return `${first}${joint}${second}`;
}
