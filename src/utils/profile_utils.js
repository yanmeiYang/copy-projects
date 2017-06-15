import { config } from '../utils';

const { api } = config;

/**
 * Created by BoGao on 2017/5/31.
 */

/**
 * Get person avatar image address.
 * @param src
 * @param profileId
 * @param size - width in px.
 * @returns picture url of person avatar.
 */
const getAvatar = (src, profileId, size) => {
  const imgSize = size ? size : 160;
  const imgSrc = src;
  if (!src) {
    // TODO move this to config.
    return '//am-cdn-s0.b0.upaiyun.com/default/default.jpg';
  }
  // TODO replace session id here.
  const scopeSessionId = 'todo-replace-scope-session-id';
  if (imgSrc.indexOf('static.aminer.org') >= 0) {
    return `${imgSrc.replace('static.aminer.org', 'am-cdn-s0.b0.upaiyun.com')}!${imgSize}?ran=${scopeSessionId}`;
  } else {
    return `${imgSrc}?ran=${scopeSessionId}`;
  }
};

/**
 * Get the last affiliation to display in page.
 * @params: pos: must be 'pos' node from profile api;
 * @returns: position string.
 */
const displayPosition = (pos) => {
  return pos && pos[pos.length - 1] && pos[pos.length - 1].n ? pos[pos.length - 1].n : '';
}

const displayPositionFirst = (pos) => {
  return pos && pos.length > 0 && pos[0].n;
}

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
};
