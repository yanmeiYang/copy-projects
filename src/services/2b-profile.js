/**
 * Created by yangyanmei on 17/8/21.
 */
import { request, config } from '../utils';

const { api } = config;

export async function getExpertInfo(src, offset, size) {
  return request(api.getExpertInfo
      .replace(':src', src)
      .replace(':offset', offset)
      .replace(':size', size),
    {
      method: 'GET',
    });

}
export async function searchEveryInfo(payload) {
  const { src, name } = payload;
  return request(api.searchItemByName
      .replace(':src', src)
      .replace(':offset', '0')
      .replace(':size', '10'),
    {
      method: 'GET',
      data: {
        name,
      },
    });
}
export async function getEveryInfo(payload) {
  const { src, key } = payload;
  return request(api.editItemByKey
      .replace(':src', src)
      .replace(':id', key),
    {
      method: 'GET',
    });
}

export async function updateByKey(src, key, data) {
  return request(api.updateItemById
      .replace(':src', src)
      .replace(':id', key),
    {
      method: 'PATCH',
      data: {
        name: data.name,
        name_zh: data.name_zh,
        sid: data.sid,
        gender: data.gender,
        email: data.email,
        aff: data.aff,
      },
    });
}

export async function deleteByKey(src, key) {
  return request(api.deleteItemByKey
      .replace(':src', src)
      .replace(':id', key)
    , {
      method: 'DELETE',
    });
}

export async function addExpertInfo(src, newData) {
  const { name, name_zh, gender, aff, email } = newData;
  return request(api.addExpertInfoApi
      .replace(':src', src)
    , {
      method: 'POST',
      body: JSON.stringify({
        sid: newData.sid,
        aid: '',
        status: '',
        type: '',
        name,
        name_zh,
        gender: parseInt(gender),
        title: '',
        level: '',
        aff,
        email,
        phone: [],
        confidence: 0,
        verified: false,
      }),
    });
}

