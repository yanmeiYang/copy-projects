import { request, queryAPI, config } from 'utils';
import * as bridge from 'utils/next-bridge';
import { sysconfig } from 'systems';
import * as strings from 'utils/strings';

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
    return listPersonInEB({ ebid: filters.eb.id, sort, offset, size });
  }

  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch);
  }

  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch);
  }

  //
  // Search in ExpertBase.
  //

  // 1. prepare parameters.
  const Sort = sort || 'relevance'; // TODO or '_sort';

  // 2. query
  // ------------------------------------------------------------------------------------------
  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH && Sort !== 'activity-ranking-contrib') {

    const nextapi = {
      RequestMethod: 'POST',
      method: 'search',
      parameters: {
        query, offset, size,
        searchType: 'allb', // all
        // sorts: [Sort],
        filters: { terms: {} },
        aggregation: ['gender', 'h_index', 'location', 'language'],
        haves: { labels: ['CCF_MEMBER_高级会员', 'CCF_MEMBER_会士', 'CCF_MEMBER_杰出会员', /*'CCF_DEPT_*'*/] },
        switches: ['translate'],
      },
      schema: {
        person: [
          'id', 'name', 'name_zh', 'tags', // 'tags_zh', 'tags_trans_zh'
          {
            profile: [
              'position', 'affiliation',
              // 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
            ],
          },
          { indices: ['hindex', 'gindex', 'numpubs', 'citation', 'newStar', 'risingStar', 'activity', 'diversity', 'sociability'] },
        ],
      },
    };

    // filters
    Object.keys(filters).map((key) => {
      const filter = filters[key];
      if (key === 'eb') {
        const ebLabel = bridge.toNextCCFLabelFromEBID(filters.eb.id);
        nextapi.parameters.filters.terms.labels = [ebLabel]; // TODO transfer EB.
      } else if (key === 'h_index') {
        console.log('TODO filter by h_index 这里暂时是用解析的方式获取数据的。');
        const splits = filter.split('-');
        if (splits && splits.length === 2) {
          const from = parseInt(splits[0]);
          const to = parseInt(splits[1]);
          nextapi.parameters.filters.ranges = {
            h_index: [isNaN(from) ? '' : from.toString(), isNaN(to) ? '' : to.toString()],
          };
        }
      } else {
        nextapi.parameters.filters.terms[key] = [filters[key]];
      }
      return false;
    });

    // sort
    if (Sort && Sort !== 'relevance') {
      nextapi.parameters.sorts = [Sort];
    }

    return queryAPI(nextapi);

    // ------------------------------------------------------------------------------------------
  } else {
    // old method.
    const { expertBase, data } =
      prepareParameters(query, offset, size, filters, sort, useTranslateSearch);
    return request(
      api.searchPersonInBase.replace(':ebid', expertBase),
      { method: 'GET', data },
    );
  }
}

export async function listPersonInEB(payload) {
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
  // const rosterAPI = sort === 'time' ? api.allPersonInBase : api.allPersonInBaseWithSort;
  //
  // const data = {};
  // if (sort === 'time') {
  //   data.rev = 1;
  // }
  // return request(
  //   rosterAPI.replace(':ebid', ebid),
  //   { method: 'GET', data },
  // );
}

// Search Global.
export async function searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch) {
  const data = prepareParametersGlobal(query, offset, size, filters, sort, useTranslateSearch);
  // console.log('data', data);
  return request(api.searchPerson, { method: 'GET', data });
}

//
// Search Aggregation!
//
export async function searchPersonAgg(query, offset, size, filters, useTranslateSearch, sort) {
  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch);
  }

  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH && sort !== 'activity-ranking-contrib') {
    // TODO 我需要替换成新的API
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^ 注意注意，我这里变成了取新的API。所以agg什么都不做了!!');
  } else {
    const { expertBase, data } = prepareParameters(query, offset, size, filters, '', useTranslateSearch);
    console.log('------------', data);

    return request(
      api.searchPersonInBaseAgg.replace(':ebid', expertBase),
      { method: 'GET', data },
    );
  }
}

export async function searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch) {
  const data = prepareParametersGlobal(query, offset, size, filters, '', useTranslateSearch);
  return request(api.searchPersonAgg, { method: 'GET', data });
}

function prepareParameters(query, offset, size, filters, sort, useTranslateSearch) {
  let expertBase = sysconfig.DEFAULT_EXPERT_BASE;
  let data = { offset, size, sort: sort || '', };

  if (filters) {
    // const newFilters = {};
    Object.keys(filters).forEach((k) => {
      if (k === 'eb') {
        expertBase = filters[k].id;
      } else {
        const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        data[newKey] = filters[k];
      }
    });
    // data = { ...data, ...newFilters };
  }
  const { term, name, org } = strings.destructQueryString(query);
  if (term) {
    data.term = useTranslateSearch ? `cross:${term}` : term;
  }
  if (name) {
    data.name = name;
  }
  if (org) {
    data.org = org;
  }
  // data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY]= query,

  data = addAdditionParameterToData(data, sort, 'eb');
  // if (useTranslateSearch && data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY]) {
  //   data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY] = `cross:${data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY]}`;
  // }
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
