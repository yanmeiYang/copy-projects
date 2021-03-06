import { request, config } from 'utils';

const { api } = config;


const BASE_SPLITER = 1000000; // 1000000 Hits的节点是 一百万+index.

export async function dataFind2(id) {
  return request('/go2/', {
    method: 'POST',
    data: {
      aid: id, // from form
      csrfmiddlewaretoken: 'JgGMxQfCjamNupEdUYhqlRXqU5ewK6Yj',
      isapi: true,
    },
    dataType: 'jsonp',
    baseURL: 'https://trajectory.aminer.org',
  });
}

export async function eventFind(year) { // 有query
  return request('/lab/trajectory/eventTop10000.json');
}

export async function findTrajPerson(id, start, end) {
  return request(
    api.getTrajectoryInfo
      .replace(':id', id)
      .replace(':lo', start)
      .replace(':hi', end)
    , { method: 'GET' },
    );
}

export async function findTrajsHeat(rosterId, start, end, size) {
  return request(
    api.getHeatInfo
      .replace(':rid', rosterId)
      .replace(':lo', start)
      .replace(':hi', end)
      .replace(':size', size)
    , { method: 'GET' },
    );
}

export async function findTrajsHeatAdvance(name, offset, org, term, size) {
  return request(
    api.getHeatByQuery
      .replace(':name', name)
      .replace(':offset', offset)
      .replace(':org', org)
      .replace(':term', term)
      .replace(':size', size)
    , { method: 'GET' },
  );
}


export async function findTop10000Data() {
  return request('/lab/trajectory/heatData40.json');
}

export async function eventTop10000Find() {
  return request('/lab/trajectory/eventTop10000.json');
}
