/**
 * Bo Gao on 2017-08-17
 *
 * Reflect utils for javascript.
 */

// debug method.
function GetComponentName(clzss) {
  if (typeof clzss === 'string') {
    return clzss;
  }
  let s = clzss.toString();
  if (s.indexOf('function') === -1) {
    return null;
  } else {
    s = s.replace('function', '');
    const idx = s.indexOf('(');
    s = s.substring(0, idx);
    s = s.replace(' ', '');
  }
  return s;
}


module.exports = {
  GetComponentName,
};
