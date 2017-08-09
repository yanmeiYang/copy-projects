import fetch from 'dva/fetch';
import { request, config } from '../utils';
import { wget } from '../utils/request';
import { sysconfig } from '../systems';

const { api } = config;

export async function getPerson(id) {
  // TODO Extract util to automatically replace parameters.
  // TODO Make this transparency to developers.
  return request(api.personProfile.replace(':id', id), {
    method: 'GET',
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

export async function listPersonByIds(ids) {
  return request(api.listPersonByIds, {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function getActivityAvgScoresByPersonId(id) {
  return request(api.getActivityAvgScoresByPersonId.replace(':id', id));
}

export async function personEmailStr(id) {
  return request(api.personEmailStr.replace(':id', id));
}

const LSKEY_INTERESTS = 'INTERESTS_I18N';
export function getInterestsI18N(callback) {
  let interestsData;
  const obj = localStorage.getItem(LSKEY_INTERESTS);
  if (obj) {
    try {
      interestsData = JSON.parse(obj);
    } catch (err) {
      console.error(err);
    }
  }
  if (!interestsData) {
    const pms = wget('/lab/interest_i18n.json');
    pms.then((data) => {
      interestsData = keyToLowerCase(data);
      localStorage.setItem(LSKEY_INTERESTS, JSON.stringify(interestsData));
      if (callback) {
        callback(interestsData);
      }
      return interestsData;
    }).catch((error) => {
      localStorage.removeItem(LSKEY_INTERESTS);
      return undefined;
    });
  }
  if (callback) {
    callback(interestsData);
  }
  return interestsData;
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
  if (interestsData && sysconfig.PreferredLanguage === 'cn') {
    return interestsData[key.toLowerCase()] ? interestsData[key.toLowerCase()] : key;
  } else {
    return key;
  }
}
