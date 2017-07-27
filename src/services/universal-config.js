
import { request, config } from '../utils';

const { api, source } = config;
export async function listByCategory(category) {
  return request(api.ucListByCategory
      .replace(':source', source)
      .replace(':category', category)
    , { method: 'GET' });
}

export async function setByKey(category, key, val) {
  const cleanValue = val !== undefined ? val : '';
  return request(api.ucSetByKey
      .replace(':source', source)
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
      .replace(':source', source)
      .replace(':category', category)
      .replace(':key', key)
    , {
      method: 'DELETE',
      body: JSON.stringify({ op: 'set', value: 0 }),
    });
}

export async function updateByKey(src, category, key, newKey) {
  return request(api.ucUpdateByKey
      .replace(':src', src)
      .replace(':category', category)
      .replace(':key', key)
      .replace(':newKey', newKey)
    , {
      method: 'PUT',
      body: JSON.stringify({ op: 'set', value: 0 }),
    });
}

