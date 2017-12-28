/**
 * Created by BoGao on 2017/8/29.
 */
import { request, config } from '../utils';
import { sysconfig } from 'systems';

const { api } = config;

export async function translateTerm(term) {
  return request(api.translateTerm.replace(':term', term), { method: 'GET' });
}
