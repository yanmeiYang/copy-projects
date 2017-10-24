/**
 * Created by yangyanmei on 17/10/20.
 */
import { request, queryAPI, config } from 'utils';
import * as bridge from 'utils/next-bridge';
import { sysconfig } from 'systems';
import * as strings from 'utils/strings';

const { api } = config;

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLXd3UlFlVm1Da0pFM3o4c2xLalppYUhlR09SOW5HYW01SWVZRmltQTd3NmpLRktcLzdGWHZJWFpzMUVTcVhHMytSbnFSeGFraVNrNHlYQVp0NWV0d0dTdjJoeWxzQW5Sd05hYTJoTFlJTnpMM1dTeTVIIiwidWlkIjoiNTliMGMxZjg5ZWQ1ZGI2ODcwYzYwZjVmIiwic3JjIjoiYm9sZSIsImlzcyI6ImFwaS5hbWluZXIub3JnIiwiZXhwIjoxNTExNDIxNTQxLCJpYXQiOjE1MDg4Mjk1NDEsImp0aSI6ImRkMzQxNjVjNTkxM2YxNzllMzk3NTNjMTE5NjUwNGEwZWFlNzA5OTY5ZjJhYWJlNTk2ODdlMDM1ODk0ZTIzMTQwZjY2OGU3ZjM0MTBlOTJjMzA1YTExN2U2OTJiZGExOGY1ODA3ZGYwNjdjYzkwYTM3ZTgwODA0NmM3ZWJmNDkyNTBhZDFhZDQ0OTdlNGIyYThhYzljZjhjYTdiN2Y3ZGQzOWJhYmJkZjVhZmFjYmU3YzZlMDAxYWI4M2UzMDA1YmY5MWUxNzRmNGJlNDNlZGM3NzNhN2RhZDc3YjUzZGQ4YjgwYzRhN2YwYzAwY2RkYjk5NTVhOTk3ZTZhYzRjNjkiLCJlbWFpbCI6ImhkX3lhbmd5bUBzaW5hLmNvbSJ9.qaNiWcE9xR5adlQ9pv-ZeNV-xI9ekhSZnh5hf5ltddA';
export async function tryToDoMerge(id, mergeIds) {
  return request(api.tryToDoMerge.replace(':mid', id), {
    method: 'POST',
    body: JSON.stringify(mergeIds),
    token,
  });
}

/* 目前搜索的各种坑
 全局搜索：
 智库高级搜索：
 /api/search/roster/59..08/experts/advanced?name=&offset=0&org=&size=20&sort=n_citation&term=jie
 sort = relevance, h_index, a_index, activity, diversity, rising_star, n_citation, n_pubs,
 智库无缓存查询：
 */
export async function searchPerson(query, offset, size, personId) {
  const data = prepareParametersGlobal(query, offset, size, personId);
  const { term, name, org, isAdvancedSearch } = strings.destructQueryString(query);
  const apiURL = isAdvancedSearch ? api.searchPersonAdvanced : api.searchPerson;
  console.log('------------ services merge api -----------', apiURL);
  return request(apiURL, { method: 'GET', data });
}

function prepareParametersGlobal(query, offset, size, personId) {
  let data = { query, offset, size, lk_merge: personId };
  data = { offset, size, sort: '', lk_merge: personId };

  // add query // TODO Use Advanced Search?????
  const { term, name, org, isAdvancedSearch } = strings.destructQueryString(query);
  if (isAdvancedSearch) {
    if (term) {
      const cleanedTerm = strings.cleanQuery(term);//encodeURIComponent(strings.cleanQuery(term));
      data.term = cleanedTerm;
    }
    if (name) {
      data.name = name;
    }
    if (org) {
      data.org = strings.cleanQuery(org);
    }
  } else {
    const newQuery = strings.firstNonEmpty(term, name, org); // use new query?
    data.query = newQuery;
  }
  return data;
}
