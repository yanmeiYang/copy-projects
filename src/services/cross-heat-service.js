/**
 * Created by ranyanchuan on 2017/9/12.
 */

import { request, config } from '../utils';
import { externalRequest } from '../utils/request';

const { api } = config;
export async function getDiscipline(area, k, depth) {
  return externalRequest(api.getDiscipline.replace(':area', area).replace(':k', k).replace(':depth', depth), {
    method: 'GET',
  });
}

export async function delDiscipline(parents, children, postive) {
  return externalRequest(api.delDiscipline.replace(':parents', parents).replace(':children', children).replace(':postive', postive), {
    method: 'GET',
  });
}
