/**
 * Created by zhanglimin on 17/9/1.
 */
import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

export async function getExpert(offset, size) {
  return request(api.getExpertBase
    // .replace(':src', sysconfig.SOURCE)
      .replace(':type', 'my')
      .replace(':offset', offset)
      .replace(':size', size),
    {
      method: 'GET',
    });
}

export async function getExpertDetail(id, offset, size) {
  return request(api.getExpertDetailList
      .replace(':ebid', id)
      .replace(':offset', offset)
      .replace(':size', size),

    {
      method: 'GET',
    });
}

export async function rosterManage({ payload }) {
  const { id, name, email, perm } = payload;
  return request(api.invokeRoster
      .replace(':id', id),
    {
      method: 'PUT',
      body: JSON.stringify({
        name,
        email,
        perm,
      }),
    });
}

export async function addExpertBase({ title, desc, pub }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('desc', desc);
  formData.append('public', pub);
  return request(api.addExpertBaseApi
    , {
      method: 'POST',
      body: formData,
      specialContentType: true,
    });
}

export async function addExpertToEB({ payload }) {
  const { ebid, aids } = payload;
  return request(api.addExpertToEB.replace(':ebid', ebid),
    {
      method: 'PUT',
      body: JSON.stringify({
        aids,
      }),
    });
}

export async function deleteByKey(key) {
  return request(
    api.deleteExpertBaseApi.replace(':rid', key),
    { method: 'DELETE' },
  );
}

export async function removeExpertsFromEBByPid({ pid, rid }) {
  return request(
    api.removeExpertsFromEBByPid.replace(':rid', rid).replace(':pid', pid),
    { method: 'DELETE' },
  );
}

// export async function searchExpert({ payload }) {
//   const { id, name } = payload;
//   return request(api.searchExpertByName
//       .replace(':ebid', id),
//     {
//       method: 'GET',
//       data: {
//         name,
//       },
//     });
// }

export async function getToBProfileByAid(id) {
  return request(api.getToBProfileByAid
      .replace(':src', sysconfig.SOURCE)
      .replace(':id', id),
    { method: 'GET' });
}

export async function updateToBProfileExtra(aid, extra) {
  return request(api.updateToBProfileExtra
      .replace(':src', sysconfig.SOURCE)
      .replace(':id', aid),
    {
      method: 'PATCH',
      body: JSON.stringify({ extra }),
    });
}
