import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

/* 目前搜索的各种坑
   全局搜索：
   智库高级搜索：
     /api/search/roster/59..08/experts/advanced?name=&offset=0&org=&size=20&sort=n_citation&term=jie
     sort = relevance, h_index, a_index, activity, diversity, rising_star, n_citation, n_pubs,
   智库无缓存查询：

 */
export async function searchPerson(query, offset, size, filters, sort, useTranslateSearch) {
  // if query is null, and eb is not aminer, use expertbase list api.
  if (!query && filters && filters.eb && filters.eb.id && filters.eb.id !== 'aminer') {
    return searchListPersonInEB({ ebid: filters.eb.id, sort, offset, size });
  }

  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch);
  }
  // Search ExpertBase.
  const { expertBase, data } = prepareParameters(query, offset, size, filters, sort, useTranslateSearch);
  return request(
    api.searchPersonInBase.replace(':ebid', expertBase),
    { method: 'GET', data },
  );
}

export async function searchListPersonInEB(payload) {
  const { sort, ebid, offset, size } = payload;
  if (!sort || sort === 'time') {
    return request(
      api.allPersonInBase
        .replace(':ebid', ebid)
        .replace(':offset', offset)
        .replace(':size', size),
      { method: 'GET', data: { rev: 1 } },
    );
  } else {
    return request(
      api.allPersonInBaseWithSort
        .replace(':ebid', ebid)
        .replace(':sort', sort)
        .replace(':offset', offset)
        .replace(':size', size),
      { method: 'GET' /*, data: { rev: 0 } */ },
    );
  }
  const rosterAPI = sort === 'time' ? api.allPersonInBase : api.allPersonInBaseWithSort;

  const data = {};
  if (sort === 'time') {
    data.rev = 1;
  }
  return request(
    rosterAPI.replace(':ebid', ebid),
    { method: 'GET', data },
  );
}

// Search Global.
export async function searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch) {
  const data = prepareParametersGlobal(query, offset, size, filters, sort, useTranslateSearch);
  // console.log('data', data);
  return request(api.searchPerson, { method: 'GET', data });
}

export async function searchPersonAgg(query, offset, size, filters, useTranslateSearch) {
  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch);
  }
  const { expertBase, data } = prepareParameters(query, offset, size, filters, '', useTranslateSearch);
  return request(
    api.searchPersonInBaseAgg.replace(':ebid', expertBase),
    { method: 'GET', data },
  );
}

export async function searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch) {
  const data = prepareParametersGlobal(query, offset, size, filters, '', useTranslateSearch);
  return request(api.searchPersonAgg, { method: 'GET', data });
}

function prepareParameters(query, offset, size, filters, sort, useTranslateSearch) {
  let expertBase = sysconfig.DEFAULT_EXPERT_BASE;
  let data = { term: query, offset, size, sort };
  if (filters) {
    const newFilters = {};
    Object.keys(filters).forEach((k) => {
      if (k === 'eb') {
        expertBase = filters[k].id;
      } else {
        const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        newFilters[newKey] = filters[k];
      }
    });
    data = { ...newFilters, term: query, offset, size, sort: sort || '' };
  }
  data = addAdditionParameterToData(data, sort, 'eb');
  if (useTranslateSearch && data.term) {
    data.term = `cross:${data.term}`;
  }
  return { expertBase, data };
}

function prepareParametersGlobal(query, offset, size, filters, sort, useTranslateSearch) {
  let data = { query, offset, size, sort };
  if (filters) {
    const newFilters = {};
    Object.keys(filters).forEach((k) => {
      if (k === 'eb') {
        // ignore;
      } else {
        const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        // newFilters[newKey] = filters[k].toLowerCase().replace(' ', '_');
        newFilters[newKey] = filters[k];
      }
    });
    // console.log('=====================',newFilters );
    data = { ...newFilters, query, offset, size, sort: sort || '' };
  }
  data = addAdditionParameterToData(data, sort, 'global');
  if (useTranslateSearch && data.query) {
    data.query = `cross:${data.query}`;
  }
  return data;
}

// Additional parameters. range=[eb|global]
function addAdditionParameterToData(data, sort, range) {
  const newData = data;

  // 置顶acm fellow和高校top100
  if (sysconfig.Search_EnablePin) {
    if (!sort || sort === 'relevance') {
      newData.pin = 1;
    }
  }

  // with search in expert-base.
  if (sysconfig.Search_CheckEB && range === 'global') {
    newData.lk_roster = sysconfig.ExpertBase;
  }
  return newData;
}

// ---------------------------------------------------------

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

export async function relationGraph(data) {
  return request(api.searchExpertNetWithDSL, {
    method: 'GET', data,
  });
}

// publications:

export async function searchPublications(params) {
  return request(api.searchPubs, { method: 'GET', data: params });
}
