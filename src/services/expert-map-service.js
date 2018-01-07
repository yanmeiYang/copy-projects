import { request, config } from '../utils';
import { sysconfig } from 'systems';

const { api } = config;

export async function searchMap(query) {
  return request(api.searchMap, { method: 'GET', data: { query } });
}

export async function searchExpertBaseMap(ebid, offset, size) {
  // /roster/:id/geo/offset/:offset/size/:size
  return request(api.searchExpertBaseMap
      .replace(':id', ebid)
      .replace(':offset', offset)
      .replace(':size', size)
    , { method: 'GET' });
}

