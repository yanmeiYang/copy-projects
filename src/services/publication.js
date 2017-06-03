/**
 * Created by BoGao, 2017-05-30;
 */
import { request, config } from '../utils';

const { api } = config;

/** get publication list. */
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

/** getPubsById, ordered by Year. */
export async function getPubsById(params) {
  const { personId, offset, size } = params;
  return request(
    api.pubList
      .replace(':id', personId)
      .replace(':size', size)
      .replace(':offset', offset)
    , { method: 'GET' },
  );
}

/** getPubsMostPo, ordered by citation number. */
export async function getPubsMostPo(params) {
  const { personId, offset, size } = params;
  return request(
    api.pubListByCitation
      .replace(':id', personId)
      .replace(':size', size)
      .replace(':offset', offset)
    , { method: 'GET' },
  );
}

// $scope.getPubsMostPo = ->
// pubListByCitation = Profile.pubListByCitation.query({id: $scope.id,size: 20, offset: 0})
// pubListByCitation.$promise.then ->
  // $scope.pubsByCite = pubListByCitation
  // $scope.currentCite = 1
  // $scope.startOffset = $scope.total
  // $scope.busy = false


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

export function getPubLabels(pub) {
  const labels = []
  if (pub.versions) {
    pub.versions.map((v) => {
      if (!(v.src == 'mag' || v.src == 'msra')) {
        if (v.src == 'dblp' || v.src == 'ei' || v.src == 'acm' || v.src == 'ieee') {
          labels.push('EI');
        }
        if (v.src == 'pubmed' || v.src == 'ieee' || v.src == 'sci' || v.src == 'nature' || v.src == 'science' || v.src == 'pnas' || v.src == 'scopus') {
          labels.push('WOS');
        }
        if (v.src == 'science' || v.src == 'nature' || v.src == 'scopus') {
          labels.push(v.src.toUpperCase());
        }
        if (v.src == 'esi_hot') {
          labels.push('Hot Paper');
        }
        if (v.src == 'esi_highlycited') {
          labels.push('Highly Cited Paper');
        }
      }
      return v;
    });
  }
  return labels;
}

export function getVenueName(venue) {
  let venueName = '';
  if (venue.info) {
    if (venue.info.name_s) {
      venueName = venue.info.name_s;
    } else if (venue.info.name) {
      venueName = venue.info.name;
    } else if (venue.info.name_zh) {
      venueName = venue.info.name_zh;
    } else if (venue.name) {
      venueName = venue.name;
    }
  }
  return chop(venueName, 100);
}

function chop(text, size) {
  if (text) {
    return text.length > size ? `${text.substring(0, size)}...` : text;
  }
  return '';
}
