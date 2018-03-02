import { request, config } from 'utils';
import { sysconfig } from 'systems';

const { api } = config;

export async function getPerson(id) {
  // TODO Extract util to automatically replace parameters.
  // TODO Make this transparency to developers.
  return request(api.personProfile.replace(':id', id), {
    method: 'GET',
  });
}

export async function getPersonSkills(params) {
  //this is used in the new aminer PersonPage--Tabzone--Skills
  const { personId, toffset, tsize, uoffset, usize } = params;
  return request(
    api.getTopicOnSkills
      .replace(':id', personId)
      .replace(':tsize', tsize)
      .replace(':toffset', toffset)
      .replace(':usize', usize)
      .replace(':uoffset', uoffset)
    , { method: 'GET' },
  );
}

export async function getTopicOfModal(params) {
  //this is used in the new aminer PersonPage--Tabzone--Skills
  const { personId, tid, offset, usize } = params;
  return request(
    api.getTopicOfModal
      .replace(':id', personId)
      .replace(':tid', tid)
      .replace(':offset', offset)
      .replace(':usize', usize)
    , { method: 'GET' },
  );
}

export async function votePersonInSomeTopicById(params) {
  //this is used in the new aminer PersonPage--Tabzone--Skills
  const { aid, oper, tid } = params;
  return request(
    api.votePersonInSomeTopicById
      .replace(':oper', oper)
      .replace(':aid', aid)
      .replace(':tid', tid)
    , { method: 'PUT' },
  );
}

export async function unvotePersonInSomeTopicById(params) {
  //this is used in the new aminer PersonPage--Tabzone--Skills
  const { aid, tid } = params;
  return request(
    api.unvotePersonInSomeTopicById
      .replace(':aid', aid)
      .replace(':tid', tid)
    , { method: 'DELETE' },
  );
}


export async function listPersonByIds(ids) {
  return request(api.listPersonByIds, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export function getProfileUrl(name, id) {
  let str = '';
  if (name) {
    str = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  // return `/person/${str}/${id}`;
  return `/person/${id}`;
}

export function getAMinerProfileUrl(name, id) {
  let str = '';
  if (name) {
    str = name.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  // return `/person/${str}/${id}`;
  return `${config.basePageURL}/profile/${str}/${id}`;
}

/** Visualization Data */
export async function getInterestVisData(personId) {
  return request(api.interests.replace(':id', personId));
}

export async function getActivityAvgScoresByPersonId(id, data) {
  return request(api.getActivityAvgScoresByPersonId.replace(':id', id), {
    method: 'GET',
    data,
  });
}

export async function personEmailStr(id) {
  return request(api.personEmailStr.replace(':id', id));
}

const LSKEY_INTERESTS = 'INTERESTS_I18N';

export function getInterestsI18N(callback) {
  // If cached.
  if (window.interestsData) {
    if (callback) {
      callback(window.interestsData);
    }
    return;
  }

  const obj = localStorage.getItem(LSKEY_INTERESTS);
  if (obj) {
    try {
      window.interestsData = JSON.parse(obj);
      if (callback) {
        callback(window.interestsData);
      }
    } catch (err) {
      console.error(err);
    }
  }
  if (!window.interestsData) {
    request('/lab/interest_i18n.json').then((data) => {
      window.interestsData = keyToLowerCase(data);
      localStorage.setItem(LSKEY_INTERESTS, JSON.stringify(window.interestsData));
      if (callback) {
        callback(window.interestsData);
      }
    }).catch((error) => {
      console.log('ERROR Reading interest_i18n.json:', error);
      localStorage.removeItem(LSKEY_INTERESTS);
    });
  }
}

function keyToLowerCase(data) {
  const lowerCaseData = {};
  data && Object.entries(data).map((key) => {
    lowerCaseData[key[0].toLowerCase()] = key[1];
    return lowerCaseData;
  });
  return lowerCaseData;
}

export function returnKeyByLanguage(interestsData, key) {
  const tag = { en: key, zh: '' };
  if (interestsData && interestsData.data && sysconfig.Locale === 'zh') {
    tag.zh = interestsData.data[key.toLowerCase()] ? interestsData.data[key.toLowerCase()] : '';
    return tag;
  } else {
    return tag;
  }
}

export function returnGender(value) {
  let gender = value;
  if (sysconfig.Locale === 'zh') {
    gender = value.toLowerCase() === 'male' ? '男' : '女';
  }
  return gender;
}
