/* eslint-disable quote-props */
import * as reco from '../../services/recoService';

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
    * getProjectById({ payload }, { call }) {
      // const { projectId } = payload;
      const data = yield call(reco.getProjectById, payload);
      return data.data.items;
    },
    // TODO @xiaobei: 根据taskID读取看过这篇文章的人数
    * getViewPerson({ payload }, { call }) {
      const { taskId } = payload;
      const data = yield call(service, taskId);
      return data.data;
    },
    // 创建proj，上传所有的信息
    * sendProjInfo({ payload }, { call }) {
      const { projectId, data, operator, title } = payload;
      const pdata = {
        'parameters': {
          'ids': projectId,
          'opts': [
            {
              'operator': operator,
              'fields': [
                {
                  'field': 'title',
                  'value': title,
                },
                {
                  'field': 'subject',
                  'value': data.emailData.mailTitle ? data.emailData.mailTitle : '',
                },
                {
                  'field': 'from',
                  'value': data.emailData.mailEditor ? data.emailData.mailEditor : '',
                },
                {
                  'field': 'track_openimg',
                  'value': data.currentImg ? data.currentImg : '',
                },
                {
                  'field': 'links',
                  'value': data.currentUrl ? data.currentUrl : '',
                },
                {
                  'field': 'template',
                  'value': data.emailData.mailBody ? data.emailData.mailBody : '',
                },
              ],
            },
          ],
        },
      };
      const wdata = yield call(reco.saveAll, pdata);
    },
    // 根据人的aid搜索出对应的邮件
    * catchEmail({ payload }, { call }) {
      const { ids, person } = payload;
      const data = {
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
      };
      const pdata = yield call(reco.catchEmail, data);
      return pdata.data;
    },
    // 开始抓取，触发程序
    * startCrawl({ payload }, { call }) {
      const data = yield call(reco.startCrawl, payload)
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
    // 导出csv
    * downloadCSV({ payload }, { call }) {
      const { ids } = payload;
      const data = yield call(reco.downloadCSV, ids);
      return data.data;
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

  },
};
