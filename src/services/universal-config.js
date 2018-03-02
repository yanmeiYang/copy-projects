import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

export async function listByCategory(category) {
  return request(api.ucListByCategory
      .replace(':source', sysconfig.SOURCE)
      .replace(':category', category)
    , { method: 'GET' });
}

export async function setByKey(category, key, val) {
  const cleanValue = val !== undefined ? val : '';
  return request(api.ucSetByKey
      .replace(':source', sysconfig.SOURCE)
      .replace(':category', category)
      .replace(':key', key)
    , {
      method: 'PUT',
      body: JSON.stringify({
        op: 'set',
        value: cleanValue,
      }),
    });
}

export async function deleteByKey(category, key) {
  console.log('service delete key: ', key);
  return request(api.ucDeleteByKey
      .replace(':source', sysconfig.SOURCE)
      .replace(':category', category)
      .replace(':key', key)
    , {
      method: 'DELETE',
      body: JSON.stringify({ op: 'set', value: 0 }),
    });
}

export async function updateByKey(category, key, newKey) {
  return request(api.ucUpdateByKey
      .replace(':source', sysconfig.SOURCE)
      .replace(':category', category)
      .replace(':key', key)
      .replace(':newKey', newKey)
    , {
      method: 'PUT',
      body: JSON.stringify({ op: 'set', value: 0 }),
    });
}

export async function getCategoriesHint(category) {
  return request(api.getCategoriesHint
      .replace(':source', sysconfig.SOURCE)
      .replace(':category', category),
    {
      method: 'GET',
    });
}

export async function listConfigsByCategoryList(category) {
  return request(api.listConfigsByCategoryList
      .replace(':source', sysconfig.SOURCE),
    {
      method: 'GET',
      data: { category },
    });
}
