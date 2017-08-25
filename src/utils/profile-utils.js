import { config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

/**
 * Created by BoGao on 2017/5/31.
 */

const cdnDomain = 'am-cdn-s0.b0.upaiyun.com';
/**
 * Get person avatar image address.
 * @param src
 * @param profileId
 * @param size - width in px.
 * @returns string - picture url of person avatar.
 */
const getAvatar = (src, profileId, size) => {
  const imgSize = size || 160;
  const imgSrc = src || '//static.aminer.org/default/default.jpg';

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
};

/**
 * Get the last affiliation to display in page.
 * @params: pos: must be 'pos' node from profile api;
 * @returns: string - position string.
 */
const displayPosition = (pos) => {
  return pos && pos[pos.length - 1] && pos[pos.length - 1].n ? pos[pos.length - 1].n : '';
};

const displayPositionFirst = (pos) => {
  return pos && pos.length > 0 && pos[0].n;
};

const displayNameCNFirst = (name, nameCN) => {
  const cs = [];
  if (nameCN) {
    cs.push(nameCN);
    if (name) {
      cs.push(' (');
      cs.push(name);
      cs.push(')');
    }
  } else {
    cs.push(name);
  }
  return cs.join('');
}

/**
 * Get profile's affiliation string
 * @param pos
 */
function displayAff(profile) {
  if (profile.contact) {
    if (profile.contact.affiliation !== '' && profile.contact.affiliation !== undefined) {
      return profile.contact.affiliation;
    } else if (profile.aff) {
      if (profile.aff.desc) {
        return profile.aff.desc;
      } else if (profile.aff.desc_zh) {
        return profile.aff.desc_zh;
      } else if (profile.aff) {
        if (profile.aff.desc) {
          return profile.aff.desc;
        } else if (profile.aff.desc_zh) {
          return profile.aff.desc_zh;
        }
      }
    }
  }
}

/**
 *
 * @param profile - profile json returned from person api.
 * @returns Email address' image src.
 */
function displayEmailSrc(profile) {
  if (!profile.contact) {
    return '';
  }
  return displayEmailSrc2(profile.id, profile.contact.has_email, profile.contact.has_email_cr);
}

function displayEmailSrc2(personId, hasEmail, hasEmailCR) {
  if (hasEmail) {
    return `${api.personEmailImg + personId}?v=${new Date().getTime()}`;
  } else if (hasEmailCR) {
    return `${api.getEmailCrImage + personId}?v=${new Date().getTime()}`;
  }
}

function findTopNTags(person, n) {
  let tags = [];
  if (sysconfig.Locale === 'zh') {
    tags = person.tags_zh ? person.tags_zh.slice(0, n) : null;
  } else {
    tags = person.tags ? person.tags.slice(0, n) : null;
  }
  if (!tags || tags.length === 0) {
    tags = person.tags ? person.tags.slice(0, n) : [];
  }
  return tags;
}

/*
 ----------------------------- exports -------------------------
 */
module.exports = {
  getAvatar,
  displayNameCNFirst,
  displayPosition,
  displayPositionFirst,
  displayAff,
  displayEmailSrc,
  displayEmailSrc2,
  findTopNTags,
};
