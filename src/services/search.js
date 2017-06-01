import { request, config } from '../utils';

const { api } = config;

export async function searchPerson(query, offset, size, filters) {
  let data = {
    term: query,
    offset,
    size,
  };
  if (filters) {
    const newFilters = {};
    Object.keys(filters).forEach((k) => {
      newFilters[`as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`] = filters[k].toLowerCase().replace(' ', '_');
    });
    data = {
      ...newFilters,
      term: query,
      offset,
      size,
    };
  }
  return request(api.searchPersonInBase.replace(':ebid', '58ddbc229ed5db001ceac2a4'), {
    method: 'GET',
    data,
  });
}

export async function searchPersonAgg(query, offset, size, filters) {
  let data = {
    term: query,
    offset,
    size,
  };
  if (filters) {
    const newFilters = {};
    Object.keys(filters).forEach((k) => {
      newFilters[`as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`] = filters[k].toLowerCase().replace(' ', '_');
    });
    data = {
      ...newFilters,
      term: query,
      offset,
      size,
    };
  }
  return request(api.searchPersonInBaseAgg.replace(':ebid', '58ddbc229ed5db001ceac2a4'), {
    method: 'GET',
    data,
  });
}

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

