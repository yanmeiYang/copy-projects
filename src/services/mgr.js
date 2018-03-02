import { request, config, nextAPI } from '../utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { sysconfig } from "systems";

const { api } = config;

export async function getSchema(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.tob.Schema, 'Schema')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getMineRolesAndPrivileges(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.tob.roles, 'MineRolesAndPrivileges')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getPrivileges(payload) {
  const { roles } = payload;
  const nextapi = apiBuilder.create(Action.tob.getRole, 'RolesAndPrivileges')
    .param({ roles });
  return nextAPI({ data: [nextapi.api] });
}

