/**
 * Created by ranyanchuan on 2017/9/12.
 */

import { request, config } from '../utils';
import { externalRequest } from '../utils/request';

const { api } = config;
export async function getDiscipline(params) {
  const { area, k, depth } = params;
  return request(api.getDiscipline.replace(':area', area).replace(':k', k).replace(':depth', depth), {
    method: 'GET',
  });
}

export async function getACMDiscipline(params) {
  const { entry, rich, dp, dc, ns, nc } = params;
  return request(api.getACMDiscipline
    .replace(':entry', entry)
    .replace(':rich', rich)
    .replace(':dp', dp)
    .replace(':dc', dc)
    .replace(':ns', ns)
    .replace(':nc', nc), {
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

export async function getCrossPredict(params) {
  const { dt } = params;
  return request(api.getCrossPredict, {
    method: 'POST',
    body: JSON.stringify(dt),
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
  const { method, dt } = params;
  return request(api.getAggregate
    .replace(':method', method), {
    method: 'POST',
    body: JSON.stringify(dt),
  });
}
