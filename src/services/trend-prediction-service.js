import { request, config } from '../utils';

const { api } = config;

export async function searchTrendByMention(query) {
  return request(api.getTopicByMention, { method: 'GET', data: { query } });
}