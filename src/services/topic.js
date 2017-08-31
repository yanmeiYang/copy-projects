/**
 * Created by yangyanmei on 17/8/31.
 */
import { request, config } from '../utils';

const { api } = config;

export async function getTopicByMention(mention) {
  return request(api.getTopicByMention.replace(':mention', mention), { method: 'GET' });
}
