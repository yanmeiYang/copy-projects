// 处理 advanced query 字符串
const QuerySpliter = '||';

const constructQueryString = (term, name, org) => {
  const segments = [];
  if (term) {
    segments.push(term);
  }
  if (name) {
    segments.push(QuerySpliter);
    segments.push(term);
  }
  if (org) {
    segments.push(QuerySpliter);
    segments.push(org);
  }
  return segments.join(QuerySpliter);
};

const destructQueryString = (query) => {
  const Q = query || '';
  const frags = Q.split('||');
  const [term, name, org] = frags;
  return { term, name, org };
};

module.exports = { constructQueryString, destructQueryString };
