/**
 * Create By Shaozhou
 */
import { request, config } from '../utils';

const { api } = config;

export async function searchPubById(query) {
  return request(api.pubById.replace(':id', query));
}

export async function searchTrendByTerm(term) { //最开始的方式来计算趋势
  const url = 'https://dc_api.aminer.org/trend/:term';//和使用Aminer API的保持一样
  return request(url.replace(':term', term));
}

export async function searchTrendByConfs(term) { //新增加的根据期刊会议来生成trend
  const url = 'https://dc_api.aminer.org/trend/confs_trend';
  request(url, { method: 'post', data: term });
}
