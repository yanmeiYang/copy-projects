/**
 * Created by yangyanmei on 17/11/10.
 */
import { request, config } from '../utils';

const { api } = config;
const { searchVenue } = api;

export async function getSearchVenue(query, offset, size) {
  const data = { query, offset, size };
  console.log(searchVenue, data);
  return request({
    url: searchVenue,
    method: 'get',
    data,
  });
}
