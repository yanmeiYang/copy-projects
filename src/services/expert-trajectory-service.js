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

export async function findTrajPerson(id) {
  return request(api.getTrajectoryInfo
      .replace(':id', id)
      .replace(':lo', 1988)
      .replace(':hi', 2012)
    , { method: 'GET' });
}

export async function findHeatMap(rid) {
  return request(api.getHeatInfo
      .replace(':rid', rid)
      .replace(':lo', 1988)
      .replace(':hi', 2012)
      .replace(':size', 344)
    , { method: 'GET' });
}

export async function findTop10000Data() {
  return request('/lab/trajectory/heatData40.json');
}

export async function eventTop10000Find() {
  return request('/lab/trajectory/eventTop10000.json');
}
