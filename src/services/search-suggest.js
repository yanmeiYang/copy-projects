import { request, config } from 'utils';

const { api } = config;

export async function suggest(query) {
  return request(api.searchSuggest.replace(':query', query), { method: 'GET' });
}
