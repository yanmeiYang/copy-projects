/**
 * Created by yangyanmei on 17/5/26.
 */
import { request, config } from '../utils';

const { api } = config;

export async function getSeminar(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size), {
    method: 'GET',
  });
}
