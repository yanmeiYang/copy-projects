import { apiBuilder, F, Action } from 'utils/next-api-builder';
import { nextAPI } from '../utils';

export async function getOrganizationByIDs(payload) {
  const { ids, query, expertbase, offset, size, searchType, filters } = payload;
  const nextapi = apiBuilder.create(Action.organization.search, 'search')
    .param({ ids, query, offset, size, searchType, filters })
    .schema({ expertbase });
  return nextAPI({ data: [nextapi.api] });
}

export async function OrganizationCreate(payload) {
  //TODO 很多数据
  const { opts } = payload
  const nextapi = apiBuilder.create(Action.expertbase.Alter, 'Alter')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function OrganizationDelete(payload) {
  const ids = payload;
  const real = false;
  const nextapi = apiBuilder.create(Action.expertbase.Delete, 'Delete')
    .param({ ids, real });
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdateOrganizationByID(payload) {
  const { opts } = payload;
  const nextapi = apiBuilder.create(Action.expertbase.Alter, 'Alter')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function MoveOrganizationByID(payload) {
  //TODO 此处为move的api ，以后会换一个新的。
  const { id, to } = payload;
  console.log('move', payload, payload.data)
  const nextapi = apiBuilder.create(Action.expertbase.Move, 'Move')
    .param({ id, to });
  return nextAPI({ data: [nextapi.api] });
}

export async function getChildren(payload) {
  //TODO 此处为查找子机构的的api ，以后会换一个新的。
  const { query, offset, size, searchType, filters, expertbase } = payload;
  const nextapi = apiBuilder.create(Action.organization.search, 'search')
    .param({ query, offset, size, searchType, filters })
    .schema({ expertbase });
  return nextAPI({ data: [nextapi.api] });
}
