/**
 * Created by ranyanchuan on 2017/9/12.
 */

import { request, config } from '../utils';
import { externalRequest } from '../utils/request';

const { api } = config;
export async function getDiscipline(area, k, depth) {
  return request(api.getDiscipline.replace(':area', area).replace(':k', k).replace(':depth', depth), {
    method: 'GET',
  });
}

export async function delDiscipline(parents, children, postive) {
  return request(api.delDiscipline.replace(':parents', parents).replace(':children', children).replace(':postive', postive), {
    method: 'GET',
  });
}

export async function createDiscipline(params) {
  return request(api.createDiscipline, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getCrossTree(id) {
  return request(api.getCrossTree
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getDomainiInfo(begin, end, dt) {
  return request(api.getDomainInfo
    .replace(':begin', begin)
    .replace(':end', end), {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}

export async function getDomainAllInfo(params) {
  const { domain1, domain2, beginYear, endYear, summary, pubSkip, pubLimit, authorSkip, authorLimit } = params;
  return request(api.getDomainAllInfo
    .replace(':domain1', domain1)
    .replace(':domain2', domain2)
    .replace(':beginYear', beginYear)
    .replace(':endYear', endYear)
    .replace(':summary', summary)
    .replace(':pubSkip', pubSkip)
    .replace(':pubLimit', pubLimit)
    .replace(':authorSkip', authorSkip)
    .replace(':authorLimit', authorLimit), {
    method: 'GET',
  });
}

export async function getDomainExpertPub(complete, id,) {
  return request(api.getDomainInfo
    .replace(':complete', complete)
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getDomainExpert(ids) {
  return request(api.getExpertByIds, {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}

export async function getDomainPub(id) {
  return request(api.getPubById
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getTaskList(offset, size) {
  return request(api.getTaskList
    .replace(':offset', offset)
    .replace(':size', size), {
    method: 'GET',
  });
}

export async function delUserQuery(id) {
  return request(api.delUserQuery
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getSuggest(query) {
  return request(api.getSuggest
    .replace(':query', query), {
    method: 'GET',
  });
}
