import { request, config } from '../utils';

const { api } = config;


export async function getPubsList(params) {
  const { personId, offset, size } = params;
  return request(
    api.pubList
      .replace(':id', personId)
      .replace(':size', size)
      .replace(':offset', offset)
    , { method: 'GET' },
  );
}
/**
 * TODO this function redirect to aminer.
 * @param pub
 * @returns {string}
 */
export function getArchiveUrlByPub(pub) {
  let title = '';
  if (pub.lang === 'zh') {
    title = pub.title_zh;
  } else if (pub.title) {
    title = pub.title.toLowerCase().match(/[a-zA-Z]+/g).join('-');
  }
  return `${config.basePageURL}/archive/${title}/${pub.id}`;
}
