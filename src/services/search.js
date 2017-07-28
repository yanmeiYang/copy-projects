import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

export async function searchPerson(query, offset, size, filters, sort) {
  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters, sort);
  }

  const { expertBase, data } = prepareParameters(query, offset, size, filters, sort);
  return request(
    api.searchPersonInBase.replace(':ebid', expertBase),
    { method: 'GET', data },
  );
}

export async function searchPersonGlobal(query, offset, size, filters, sort) {
  const data = prepareParametersGlobal(query, offset, size, filters, sort);
  // console.log('data', data);
  return request(api.searchPerson, { method: 'GET', data });
}

export async function searchPersonAgg(query, offset, size, filters) {
  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters);
  }
  const { expertBase, data } = prepareParameters(query, offset, size, filters, '');
  return request(
    api.searchPersonInBaseAgg.replace(':ebid', expertBase),
    { method: 'GET', data },
  );
}

export async function searchPersonAggGlobal(query, offset, size, filters) {
  const data = prepareParametersGlobal(query, offset, size, filters, '');
  return request(api.searchPersonAgg, { method: 'GET', data });
}

function prepareParameters(query, offset, size, filters, sort) {
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
  data = addAdditionParameterToData(data, sort);
  return { expertBase, data };
}

function addAdditionParameterToData(data, sort) {
  const newData = data;
  // 置顶acm fellow和高校top100
  if (sysconfig.Search_EnablePin) {
    if (!sort || sort === 'relevance') {
      newData.pin = 1;
    }
  }
  return newData;
}

function prepareParametersGlobal(query, offset, size, filters, sort) {
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
    data = { ...newFilters, query, offset, size, sort: sort || '' };
  }
  data = addAdditionParameterToData(data, sort);
  return data;
}


export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}


export async function searchMap(query) {
  return request(api.searchMap, { method: 'GET', data: { query } });
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
