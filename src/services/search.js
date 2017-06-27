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

  // let data = { term: query, offset, size, sort };
  // if (filters) {
  //   const newFilters = {};
  //   Object.keys(filters).forEach((k) => {
  //     if (k === 'eb') {
  //       expertBase = filters[k].id;
  //     } else {
  //       const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
  //       newFilters[newKey] = filters[k].toLowerCase().replace(' ', '_');
  //     }
  //   });
  //   data = { ...newFilters, term: query, offset, size, sort };
  // }

  const { expertBase, data } = prepareParameters(query, offset, size, filters, sort);
  return request(
    api.searchPersonInBase.replace(':ebid', expertBase),
    { method: 'GET', data },
  );

  // 现在没有搜索全库的功能了。
  // if (query && query.length > 0) {
  // } else {
  //   // not used
  //   return request(
  //     api.allPersonInBase
  //       .replace(':ebid', expertBase)
  //       .replace(':offset', offset)
  //       .replace(':size', size),
  //     { method: 'GET' },
  //   );
  // }
}

export async function searchPersonGlobal(query, offset, size, filters, sort) {
  const data = prepareParametersGlobal(query, offset, size, filters, sort);
  return request(api.searchPerson, { method: 'GET', data });
}

export async function searchPersonAgg(query, offset, size, filters) {
  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonAggGlobal(query, offset, size, filters);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonGlobal(query, offset, size, filters);
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
        newFilters[newKey] = filters[k].toLowerCase().replace(' ', '_');
      }
    });
    data = { ...newFilters, term: query, offset, size, sort };
  }
  return { expertBase, data };
}

function prepareParametersGlobal(query, offset, size, filters, sort) {
  let data = { query, offset, size, sort };
  if (filters) {
    const newFilters = {};
    Object.keys(filters).forEach((k) => {
      if (k === 'eb') {
        // ignore;
      } else {
        // const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        // newFilters[newKey] = filters[k].toLowerCase().replace(' ', '_');
        newFilters[k] = filters[k].toLowerCase().replace(' ', '_');// use old key.
      }
    });
    data = { ...newFilters, query, offset, size, sort };
  }
  return data;
}


export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

