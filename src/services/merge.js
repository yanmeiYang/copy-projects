/**
 * Created by yangyanmei on 17/10/20.
 */
import { request, queryAPI, config } from 'utils';
import * as bridge from 'utils/next-bridge';
import { sysconfig } from 'systems';
import * as strings from 'utils/strings';

const { api } = config;

const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLUdPTU5tbWwwU3psQUpDT2IxblZUaWh5SXN0WWNQeWc4RjY3ejRjRWQreHhGZ3pSNEJwWVV4bEdpaVwvcytHNm1janlzMDFyNTFnYk1SbHU5VWQ4UEJcL2s3K28yQmhncjRQVkhZR0M1clhoQT09IiwidWlkIjoiNTRmNTExMmU0NWNlMWJjNmQ1NjNiOGQ5Iiwic3JjIjoiYW1pbmVyIiwiaXNzIjoiYXBpLmFtaW5lci5vcmciLCJleHAiOjE1MTE0MDk5ODgsImlhdCI6MTUwODgxNzk4OCwianRpIjoiMzk1ZjM2YTIyMGJhMTBhMDAyOWU2ODcyOTA4MmFlMmFkOTRlZmUzMDIyMGM0OWYxZDExZDczNTMyMDE5M2QwM2U4MDYzOTRjOGYyNGE4ZGI2ZGUwYjljYTdkZGIyMTBlNGFhMjIyZWFlZmM2Nzc0ZjhmZmZhMTBlYTM2ZWQyMzU5MDMwYjgxOTMwNzE5ZmRmOGZjMjI3ZDQzMDIwNTBlYjQ2YWViMmJmYWM3NzI3ZGYyYWFlMTJiNGVjOTdkZDYxNzA5NmMxMjM3MWEyODIyZjBhOTE1N2IwNjljOTY0NmQ4MWRiNjdiZWQ1ZjYzN2E1NDRiOTBiMDZkZGQ1N2M1MiIsImVtYWlsIjoiaGRfeWFuZ3ltQHNpbmEuY29tIn0.snLla12tGEAC63xNTTQndCJVT82otrvNbZ0x_gTysck';
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
