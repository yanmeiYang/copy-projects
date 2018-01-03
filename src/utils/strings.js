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
  const isAdvancedSearch = frags.length > 1;
  let [term, name, org] = frags;
  term = (!term || term === '-') ? '' : term;
  name = (!name || name === '-') ? '' : name;
  org = (!org || org === '-') ? '' : org;
  return { term, name, org, isAdvancedSearch };
};

const destructDecodedQueryString = (query) => {
  // eslint-disable-next-line prefer-const
  let { term, name, org, isAdvancedSearch } = destructQueryString(query);
  term = decodeURIComponent(term) || '';
  name = decodeURIComponent(name) || '';
  org = decodeURIComponent(org) || '';
  return { term, name, org, isAdvancedSearch };
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

const firstNonEmptyQuery = (query) => {
  const { term, name, org } = destructQueryString(query);
  return firstNonEmpty(cleanQuery(term), cleanQuery(name), cleanQuery(org));
};

const encodeQuery = (query) => {
  if (!query) {
    return '';
  }
  let newQuery = query.replace(/%/g, ' ').replace(/ +/g, ' ');
  newQuery = newQuery.trim();
  newQuery = encodeURIComponent(newQuery);
  return newQuery;
};

// preserve ||
const encodeAdvancedQuery = (query) => {
  let { term, name, org } = destructQueryString(query);
  term = encodeQuery(term);
  name = encodeQuery(name);
  org = encodeQuery(org);
  return constructQueryString(term, name, org);
};

const cleanQuery = (query) => {
  return query && query.replace(/-/g, ' ').trim();
};

const escapeURLBracket = (url) => {
  return url.replace(/\(/g, '%28').replace(/\)/g, '%29').trim();
};

const unescapeURLBracket = (url) => {
  return url.replace(/%28/g, '(').replace(/%29/g, ')').trim();
};

export {
  constructQueryString, destructQueryString, destructDecodedQueryString,
  cleanQuery, encodeQuery, encodeAdvancedQuery,
  firstNonEmpty, firstNonEmptyQuery,

  escapeURLBracket, unescapeURLBracket,
};
