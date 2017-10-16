/**
 * Create By Shaozhou
 */
import { request, config } from '../utils';

const { api } = config;

export async function searchPubById(query) {
  return request(api.pubById.replace(':id', query));
}
