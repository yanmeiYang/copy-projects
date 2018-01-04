import { apiBuilder, F } from 'utils/next-api-builder';
import { nextAPI } from '../utils';

export async function getReports(projectId) {
  const ids = projectId;
  const nextapi = apiBuilder.query(F.queries.RevieweRreport, 'ReviewerReport')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function saveAll(data) {
  const { ids, opts } = data.parameters;
  const nextapi = apiBuilder.alter(F.alter.ReviewerProject, 'ReviewerProject')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function getProjectById(payload) {
  const { ids, searchType, offset, size } = payload;
  const nextapi = apiBuilder.query(F.queries.ReviewerQuery, 'ReviewerQuery')
    .param({ ids, searchType, offset, size });
  return nextAPI({ data: [nextapi.api] });
}

export async function catchEmail(payload) {
  const { ids, opts } = payload;
  const nextapi = apiBuilder.alter(F.alter.ReviewerProject, 'ReviewerProject')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function sendTestEmail(payload) {
  const { ids, opts } = payload.parameters;
  const nextapi = apiBuilder.alter(F.alter.ReviewerSendTestMail, 'ReviewerSendTestMail')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function sendConfirm(payload) {
  const { ids, opts } = payload
  const nextapi = apiBuilder.alter(F.alter.ReviewerConfirmTestMail, 'ReviewerConfirmTestMail')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function sendEmail(payload) {
  const { ids, opts } = payload
  const nextapi = apiBuilder.alter(F.alter.ReviewerSendMail, 'ReviewerSendMail')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

export async function startCrawl(payload) {
  const { ids, opts } = payload
  const nextapi = apiBuilder.alter(F.alter.ReviewerStartCrawl, 'ReviewerStartCrawl')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

// TODO 需要调整action
export async function savePersonEmail(payload) {
  const { ids, opts } = payload
  const nextapi = apiBuilder.alter(F.alter.ReviewerProject, 'ReviewerProject')
    .param({ ids, opts });
  return nextAPI({ type: 'alter', data: [nextapi.api] });
}

