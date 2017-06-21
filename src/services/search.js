import { request, config } from '../utils';
import { sysconfig } from '../systems';

const { api } = config;

export async function searchPerson(query, offset, size, filters, sort) {
  let expertBase = sysconfig.DEFAULT_EXPERT_BASE;
  if (query && query.length > 0) {
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
    return request(api.searchPersonInBase.replace(':ebid', expertBase), {
      method: 'GET',
      data,
    });
  } else {
    return request(api.allPersonInBase.replace(':ebid', expertBase).replace(':offset', offset).replace(':size', size), {
      method: 'GET',
    });
  }
}

export async function searchPersonAgg(query, offset, size, filters) {
  let expertBase = sysconfig.DEFAULT_EXPERT_BASE;
  if (query && query.length > 0) {
    let data = { term: query, offset, size };
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
      data = { ...newFilters, term: query, offset, size };
    }
    return request(api.searchPersonInBaseAgg.replace(':ebid', expertBase), {
      method: 'GET', data,
    });
  } else {
    const data = { order: 'h_index', offset, size };
    return request(
      api.allPersonInBaseAgg.replace(':ebid', expertBase),
      { method: 'GET', data },
    );
  }
}

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

