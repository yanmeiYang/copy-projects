import { apiBuilder, F, Action } from 'utils/next-api-builder';
import { nextAPI } from '../utils';

export async function getReports(projectId) {
  const ids = projectId;
  const nextapi = apiBuilder.create(Action.reviewer.GetReport, 'GetReport')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function saveAll(data) {
  const { ids, opts } = data.parameters;
  const nextapi = apiBuilder.create(Action.reviewer.CreateProject, 'CreateProject')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function updataProj(data) {
  const { ids, opts } = data.parameters;
  const nextapi = apiBuilder.create(Action.reviewer.UpdateProject, 'UpdateProject')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function getProjectList(payload) {
  const { ids, searchType, offset, size } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.ListProject, 'ListProject')
    .param({ ids, searchType, offset, size });
  return nextAPI({ data: [nextapi.api] });
}

export async function getProjectById(payload) {
  const { ids, searchType, offset, size } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.GetProject, 'GetProject')
    .param({ ids, searchType, offset, size });
  return nextAPI({ data: [nextapi.api] });
}

export async function catchEmail(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.StartCrawl, 'StartCrawl')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function sendTestEmail(payload) {
  const { ids, opts } = payload.parameters;
  const nextapi = apiBuilder.create(Action.reviewer.SendTestMail, 'SendTestMail')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function sendConfirm(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.ConfirmTestMail, 'ConfirmTestMail')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function sendEmail(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.SendMail, 'SendMail')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function startCrawl(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.RequestCrawlList, 'RequestCrawlList')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function savePersonEmail(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.UpdateProject, 'UpdateProject')
    .param({ ids, opts });
  return nextAPI({ data: [nextapi.api] });
}

export async function viewPerson(payload) {
  const { ids, query, offset, size, sorts } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.GetClickPersons, 'GetClickPersons')
    .param({ ids, query, offset, size, sorts })
    .schema({ person: F.fields.person_in_PersonList });
  return nextAPI({ data: [nextapi.api] });
}

export async function deleteProjById(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.reviewer.DeleteProject, 'DeleteProject')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getProjectListConut(payload) {
  const nextapi = apiBuilder.create(Action.reviewer.CountProject, 'CountProject')
    .param({});
  return nextAPI({ data: [nextapi.api] });
}
