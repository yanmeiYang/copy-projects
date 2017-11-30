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

export async function getDomainiInfo(params) {
  const { beginYear, endYear, pubSkip, pubLimit, authorSkip, authorLimit, dt } = params;
  return request(api.getDomainInfo
    .replace(':beginYear', beginYear)
    .replace(':endYear', endYear)
    .replace(':pubSkip', pubSkip)
    .replace(':pubLimit', pubLimit)
    .replace(':authorSkip', authorSkip)
    .replace(':authorLimit', authorLimit), {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}
export async function getCrossPredict(params) {
  const { dt } = params;
  return request(api.getCrossPredict, {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}
export async function getCrossModalInfo(params) {
  const { domain1, domain2, beginYear, endYear, summary, pubSkip, pubLimit, authorSkip, authorLimit } = params;
  return request(api.getCrossModalInfo
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

export async function getDomainPub(ids) {
  return request(api.getPubByIds, {
    method: 'POST',
    body: JSON.stringify(ids),
  });
}


export async function delTaskList(id) {
  return request(api.delTaskList
    .replace(':id', id), {
    method: 'DELETE',
  });
}

export async function getSuggest(query) {
  return request(api.getSuggest
    .replace(':query', query), {
    method: 'GET',
  });
}


export async function addCrossField(params) {
  return request(api.addCrossField, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getCrossFieldById(id) {
  return request(api.getCrossFieldById
    .replace(':id', id), {
    method: 'GET',
  });
}

export async function getTaskList(offset, size) {
  return request(api.getCrossFieldList
    .replace(':offset', offset)
    .replace(':size', size), {
    method: 'GET',
  });
}

export async function getAggregate(params) {
  const { method,dt } = params;
  return request(api.getAggregate
    .replace(':method', method), {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}

// export async function getAggregate(params) {
//   const { method,dt } = params;
//   return request(api.getAggregate, {
//     method: 'POST',
//     body: JSON.stringify(dt),
//   });
// }

