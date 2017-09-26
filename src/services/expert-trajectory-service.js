import { request, config } from '../utils';
const { api } = config;


const BASE_SPLITER = 1000000; // 1000000 Hits的节点是 一百万+index.

export async function dataFind(id) {
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

export async function eventFind(year) {
  return require('../../external-docs/expert-trajectory/eventData.json');
}
