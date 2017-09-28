/**
 * Create By Shaozhou
 */
import { request, config } from '../utils';

const { api } = config;

export async function searchTrendByMention(query) {
  return request(api.getTopicByMention.replace(':mention', query));
}

//Search person in One Area
export async function searchPersons(params) {
  return request(api.searchPerson, { method: 'GET', data: params });
}
