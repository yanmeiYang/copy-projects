import { api } from 'utils/config';
import { sysconfig } from 'systems';

const cdnDomain = 'am-cdn-s0.b0.upaiyun.com';

const personName = (name, nameZh, lang) => {
  if (lang === 'zh') {
    return displayName(nameZh, name);
  } else {
    return displayName(name, nameZh);
  }
};

const localValue = (lang, en, zh) => {
  return (lang === zh)
    ? zh || en
    : en || zh;
};

const displayName = (name1, name2) => {
  const cs = [];
  if (name1) {
    cs.push(name1);
    if (name2) {
      cs.push(' (');
      cs.push(name2);
      cs.push(')');
    }
  } else {
    cs.push(name2);
  }
  return cs.join('');
};

const personAvatar = (src, profileId, size) => {
  const imgSize = size || 160;
  const imgSrc = src || '//static.aminer.org/default/default.jpg';

  if (sysconfig.Use_CDN) {
    // const scopeSessionId = Math.random(); // 'todo-replace-scope-session-id';
    if (imgSrc.indexOf('static.aminer.org') >= 0) {
      // 其他域名下CDN图片读取不出来。
      return `${imgSrc.replace('static.aminer.org', cdnDomain)}!${imgSize}`;
      // ?ran=${scopeSessionId}`;
      // return `${imgSrc}?ran=${scopeSessionId}`;
    } else {
      // return `${imgSrc}?ran=${scopeSessionId}`;
      return imgSrc;
    }
  } else {
    return imgSrc;
  }
};

function personEmailUrl(personId, hasEmail, hasEmailCR) {
  if (hasEmail) {
    return `${api.personEmailImg + personId}?v=${new Date().getTime()}`;
  } else if (hasEmailCR) {
    return `${api.getEmailCrImage + personId}?v=${new Date().getTime()}`;
  }
}

function returnFirstNonNil(persons) {
  for (let i = 0; i < persons.length; i += 1) {
    if (persons[i]) {
      return persons[i];
    }
  }
  return '';
}

export {
  personName,
  personAvatar,
  personEmailUrl,
  localValue,
};
