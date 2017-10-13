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

const firstNonEmpty = (...terms) => {
  if (terms && terms.length > 0) {
    for (const term of terms) {
      if (term) {
        return term;
      }
    }
  }
  return '';
};

const cleanQuery = (query) => {
  return query.replace(/-/g, ' ').trim();
};

module.exports = {
  constructQueryString, destructQueryString, cleanQuery,
  firstNonEmpty,
}
;
