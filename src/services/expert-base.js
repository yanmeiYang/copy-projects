/**
 * Created by zhanglimin on 17/9/1.
 */
import { sysconfig } from 'systems';
import { request, config, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

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
  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH) {
    const opts = [];
    for (let i = 0; i < ebid.length; i++) {
      opts.push({ aid: aids[0], eid: ebid[i], opt: 'add' });
    }
    const nextapi = apiBuilder.create(Action.person_eb.alter, 'person_eb.alter')
      .param({ opts });

    return nextAPI({ data: [nextapi.api] });
  } else {
    return request(api.addExpertToEB.replace(':ebid', ebid[0]),
      {
        method: 'PUT',
        body: JSON.stringify({
          aids,
        }),
      });
  }
}


export async function deleteByKey(key) {
  return request(
    api.deleteExpertBaseApi.replace(':rid', key),
    { method: 'DELETE' },
  );
}

export async function removeExpertsFromEBByPid({ pid, rid }) {
  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH) {
    const opts = [];
    for (let i = 0; i < rid.length; i++) {
      opts.push({ aid: pid, eid: rid[i], opt: 'remove' });
    }
    const nextapi = apiBuilder.create(Action.person_eb.alter, 'person_eb.alter')
      .param({ opts });

    return nextAPI({ data: [nextapi.api] });
  } else {
    return request(
      api.removeExpertsFromEBByPid.replace(':rid', rid[0]).replace(':pid', pid),
      { method: 'DELETE' },
    );
  }
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

export async function getExpertList() {
  const data = [
    {
      desc: 'adfs',
      id: '5a62e2cae33a5d27239e9f00',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan111',
      names: [
        'bson',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
    {
      desc: 'adfs',
      id: '5a62e2cae33a5d27239e9f01',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan222',
      names: [
        'bson',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
    {
      desc: 'adfs1111111',
      id: '5a62e2cae33a5d27239e9f02',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan33333',
      names: [
        'bson',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
    {
      desc: 'adfs2222222',
      id: '5a62e2cae33a5d27239e9f03',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan4444',
      names: [
        'bson',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
    {
      desc: 'adfs',
      id: '5a62e36ae33a5d27239e9f31',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan333',
      parents: [
        '5a62e2cae33a5d27239e9f00',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
    {
      desc: 'adfs111',
      id: '5a62e36ae33a5d27239e9f32',
      logo: 'aa/bb/fgh',
      name_zh: 'zhangsan444',
      parents: [
        '5a62e2cae33a5d27239e9f00',
      ],
      score: 0,
      sourcetype: '',
      type: 'generated',
    },
  ];
  return data;
}
