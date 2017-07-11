/** Created by BoGao on 2017/5/31. */

const getAvatar = (src, profileId, size) => {
  const imgSize = size ? size : 160;
  const imgSrc = src;
  if (!src) {
    // TODO move this to config.
    return '//am-cdn-s0.b0.upaiyun.com/default/default.jpg';
  }
  const scopeSessionId = 'todo-replace-scope-session-id';
  if (imgSrc.indexOf('static.aminer.org') >= 0) {
    return `${imgSrc.replace('static.aminer.org', 'am-cdn-s0.b0.upaiyun.com')}!${imgSize}`;// ?ran=${scopeSessionId}`;
  } else {
    return `${imgSrc}?ran=${scopeSessionId}`;
  }
};


module.exports = {
  getAvatar,
};
