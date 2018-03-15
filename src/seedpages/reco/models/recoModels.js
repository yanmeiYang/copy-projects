/* eslint-disable quote-props */
import * as reco from 'services/recoService';

export default {
  namespace: 'reco',
  state: {},
  effects: {
    // 读取report
    * getReport({ payload }, { call }) {
      const { projectId } = payload;
      const data = yield call(reco.getReports, projectId);
      return data.data.items;
    },
    // 读取对应的project
    * getProjectList({ payload }, { call }) {
      const { offset, and } = payload;
      const newData = {
        ids: [],
        searchType: 'reviewer_project',
        offset,
        size: 10,
        filters: { and },
      };
      const data = yield call(reco.getProjectList, newData);
      return data.data.items;
    },
    * getProjectById({ payload }, { call }) {
      // const { projectId } = payload;
      const data = yield call(reco.getProjectById, payload);
      return data.data.items;
    },

    // 创建proj，上传所有的信息
    * sendProjInfo({ payload }, { call }) {
      // 可能以后用到 orgList,
      const { projectId, data, title, orgId } = payload;
      const search = JSON.stringify(data.search);
      const pdata = {
        'parameters': {
          'ids': projectId,
          'opts': [
            {
              'fields': [
                {
                  'field': 'title',
                  'value': title,
                },
                {
                  'field': 'subject',
                  'value': data.email.mailTitle ? data.email.mailTitle : '',
                },
                {
                  'field': 'from',
                  'value': data.email.mailEditor ? data.email.mailEditor : '',
                },
                {
                  'field': 'orgId',
                  'value': orgId,
                },
                // {
                //   'field': 'orgList',
                //   'value': orgList,
                // },
                {
                  'field': 'tasks',
                  'value': data.fileid,
                },
                {
                  'field': 'content_from',
                  'value': data.content,
                },
                {
                  'field': 'recommend_object',
                  'value': data.Recommended,
                },
                {
                  'field': 'private_mail',
                  'value': data.testmail ? data.testmail : '',
                },
                {
                  'field': 'query',
                  'value': search,
                },
                {
                  'field': 'attachment_ids',
                  'value': data.attachmentGroup || [],
                },
                {
                  'field': 'template',
                  'value': data.email.mailBody ? data.email.mailBody : '',
                },
              ],
            },
          ],
        },
      };
      const wdata = yield call(reco.saveAll, pdata);
      return wdata.data;
    },
    // 根据人的aid搜索出对应的邮件
    * catchEmail({ payload }, { call }) {
      const { ids, person } = payload;
      const data = {
        parameters: {
          'ids': [ids],
          'opts': [
            {
              'operator': 'update',
              'fields': [
                {
                  'field': 'person_ids',
                  'value': person,
                },
              ],
            },
          ],
        },
      };
      const pdata = yield call(reco.updataProj, data);
      return pdata.data;
    },
    // 开始抓取，触发程序
    * startCrawl({ payload }, { call }) {
      const data = yield call(reco.startCrawl, payload);
      return data.data;
    },
    // 保存已经筛选好的邮件地址
    * savePersonEmail({ payload }, { call }) {
      const { ids, value } = payload;
      const data = {
        'ids': [ids],
        'opts': [
          {
            'operator': 'update',
            'fields': [
              {
                'field': 'send_list',
                'value': value,
              }],
          },
        ],
      };
      const pdata = yield call(reco.savePersonEmail, data);
      return pdata.data;
    },
    // 发送测试邮件
    * sendTestEmail({ payload }, { call }) {
      const { ids, emails } = payload;
      const data = {
        'parameters': {
          'ids': ids,
          'opts': [
            {
              'operator': 'update',
              'fields': [
                {
                  'field': 'testmail',
                  'value': emails,
                },
              ],
            },
          ],
        },
      };
      const wdata = yield call(reco.sendTestEmail, data);
      return wdata.data;
    },
    // 测试邮件结果
    * sendConfirm({ payload }, { call }) {
      const pdata = yield call(reco.sendConfirm, payload);
      return pdata.data;
    },
    // 群发邮件
    * sendEmail({ payload }, { call }) {
      const data = yield call(reco.sendEmail, payload);
      return data.data;
    },
    // TODO @xiaobei: 根据taskID读取看过这篇文章的人数
    * viewPerson({ payload }, { call }) {
      const { ids, num } = payload;
      const data = {
        'ids': [ids],
        'query': num,
        'offset': 0,
        'size': 1000,
        'sorts': ['h_index'],
      };
      const pdata = yield call(reco.viewPerson, data);
      return pdata.data;
    },
    * deleteProjById({ payload }, { call }) {
      const { ids } = payload;
      const data = {
        'ids': [ids],
      };
      const pdata = yield call(reco.deleteProjById, data);
      return pdata.data;
    },
    * updataProj({ payload }, { call }) {
      // 可能以后用到 orgList, orgId,
      const { projectId, data, title} = payload;
      const search = JSON.stringify(data.search);
      const pdata = {
        'parameters': {
          'ids': projectId,
          'opts': [
            {
              'operator': 'update',
              'fields': [
                {
                  'field': 'title',
                  'value': title,
                },
                {
                  'field': 'subject',
                  'value': data.email.mailTitle ? data.email.mailTitle : '',
                },
                {
                  'field': 'from',
                  'value': data.email.mailEditor ? data.email.mailEditor : '',
                },
                // {
                //   'field': 'orgId',
                //   'value': orgId,
                // },
                {
                  'field': 'tasks',
                  'value': data.fileid,
                },
                {
                  'field': 'content_from',
                  'value': data.content,
                },
                {
                  'field': 'recommend_object',
                  'value': data.Recommended,
                },
                {
                  'field': 'private_mail',
                  'value': data.testmail ? data.testmail : '',
                },
                {
                  'field': 'attachment_ids',
                  'value': data.attachmentGroup || [],
                },
                {
                  'field': 'query',
                  'value': search,
                },
                {
                  'field': 'template',
                  'value': data.email.mailBody ? data.email.mailBody : '',
                },
              ],
            },
          ],
        },
      };
      const wdata = yield call(reco.updataProj, pdata);
      return wdata.data;
    },
    * getProjectListConut({ payload }, { call }) {
      const data = yield call(reco.getProjectListConut, payload);
      return data.data;
    },
    // 抓取邮件进度
    * getCrawlProgress({ payload }, { call }) {
      const { data } = yield call(reco.getCrawlProgress, payload);
      return data;
    },
    // 复制proj
    * copyProjById({ payload }, { call }) {
      const { data } = yield call(reco.copyProjById, payload);
      return data;
    },
  },
};
