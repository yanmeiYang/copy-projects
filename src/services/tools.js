/**
 * Created by yutao on 2017/9/3.
 */

import { request } from '../utils';


export async function getClustering() {
  return request('http://localhost:8001/data/clustering_weiwang_50.json', {
    method: 'GET',
  });
}
