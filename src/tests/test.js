const pathToRegexp = require('path-to-regexp');

// const url = '/api/topic/summary/m/王飞跃 (Feiyue Wang)';
// console.log('==========', escape(url));
// console.log('==========', encodeURI(url));
// console.log('==========', encodeURIComponent(url));

// const a = pathToRegexp.compile(escape(url));
// console.log('>>> ', a());

const escapeURLBracket = (url) => {
  return url.replace(/\(/g, '%28').replace(/\)/g, '%29').trim();
};

const unescapeURLBracket = (url) => {
  return url.replace(/%28/g, '(').replace(/%29/g, ')').trim();
};

console.log(escapeURLBracket('slkdjf (ksdfj) '));
console.log(unescapeURLBracket(escapeURLBracket('slkdjf (ksdfj) ')));
