/**
 * Created by yangyanmei on 17/8/21.
 */
import { request, config } from '../utils';
import { sysconfig } from 'systems';

const { api } = config;

export async function getProfileSuccess(offset, size) {
  return request(api.getExpertInfo
      .replace(':src', sysconfig.SOURCE)
      .replace(':offset', offset)
      .replace(':size', size),
    {
      method: 'GET',
    });
}
export async function searchSuccess(payload) {
  const { name } = payload;
  return request(api.searchItemByName
      .replace(':src', sysconfig.SOURCE)
      .replace(':offset', '0')
      .replace(':size', '10'),
    {
      method: 'GET',
      data: {
        name,
      },
    });
}
export async function getProfileByIdSuccess(payload) {
  const { key } = payload;
  return request(api.editItemByKey
      .replace(':src', sysconfig.SOURCE)
      .replace(':id', key),
    {
      method: 'GET',
    });
}

export async function updateProfileSuccess(key, data) {
  return request(api.updateItemById
      .replace(':src', sysconfig.SOURCE)
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

export async function deleteByKey(key) {
  return request(api.deleteItemByKey
      .replace(':src', sysconfig.SOURCE)
      .replace(':id', key)
    , {
      method: 'DELETE',
    });
}

export async function addProfileSuccess(newData) {
  const { sid, name, name_zh, gender, aff, email, aid, type, extra } = newData;
  return request(api.addExpertInfoApi
      .replace(':src', sysconfig.SOURCE)
    , {
      method: 'POST',
      body: JSON.stringify({
        sid: sid || '',
        aid: aid || '',
        status: '',
        type: type || '',
        name,
        name_zh,
        gender: parseInt(gender) || 0,
        title: '',
        level: '',
        aff,
        email,
        phone: [],
        confidence: 0,
        verified: false,
        extra: extra || {},
      }),
    });
}

