import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

export async function suggest(query) {
  return request(api.searchSuggest.replace(':query', query), { method: 'GET' });
}
