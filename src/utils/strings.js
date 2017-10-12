// 处理 advanced query 字符串
const QuerySpliter = '||';

const constructQueryString = (term, name, org) => {
  if (!term && !name && !org) {
    return '';
  }
  if (org) {
    return `${term || ''}||${name || ''}||${org || ''}`;
  } else if (name) {
    return `${term || ''}||${name || ''}`;
  } else {
    return term;
  }
};

const destructQueryString = (query) => {
  const Q = query || '';
  const frags = Q.split('||');
  const [term, name, org] = frags;
  return { term, name, org };
};

module.exports = { constructQueryString, destructQueryString };
