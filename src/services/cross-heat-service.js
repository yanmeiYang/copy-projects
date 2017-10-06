/**
 * Created by ranyanchuan on 2017/9/12.
 */

import { request, config } from '../utils';
import { externalRequest } from '../utils/request';

const { api } = config;
export async function getDiscipline(area, k, depth) {
  return externalRequest(api.getDiscipline.replace(':area', area).replace(':k', k).replace(':depth', depth), {
    method: 'GET',
  });
}

export async function delDiscipline(parents, children, postive) {
  return externalRequest(api.delDiscipline.replace(':parents', parents).replace(':children', children).replace(':postive', postive), {
    method: 'GET',
  });
}
export async function createDiscipline(params) {
  return externalRequest(api.createDiscipline, {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

export async function getCrossTree(id) {
  return externalRequest(api.getCrossTree
      .replace(':id', id),
    {
      method: 'GET',
    });
}
export async function getDomainiInfo(begin, end, dt) {
  return externalRequest(api.getDomainInfo
      .replace(':begin', begin)
      .replace(':end', end),
    {
      method: 'POST',
      body: JSON.stringify(dt),
    });
}

export async function getDomainAllInfo(domain1, domain2, begin, end) {
  return externalRequest(api.getDomainAllInfo
      .replace(':domain1', domain1)
      .replace(':domain2', domain2)
      .replace(':begin', begin)
      .replace(':end', end),
    {
      method: 'GET',
    });
}

export async function getDomainExpertPub(complete, id,) {
  return externalRequest(api.getDomainInfo
      .replace(':complete', complete)
      .replace(':id', id),
    {
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
