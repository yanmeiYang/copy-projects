/**
 * Created by yangyanmei on 17/8/12.
 * TODO 欠整理, move to 2b
 */
import { emailTemplate, getTemplate } from '../../services/2b';

export default {
  namespace: 'systemSetting',
  state: {
    status: null,
    emailContent: null,
  },
  subscriptions: {},
  effects: {
    * setEmailTemplate({ payload }, { call, put }) {
      // const { type, sender, subject, body } = payload;
      const data = yield call(emailTemplate, payload);
      yield put({ type: 'setEmailTemplateSuccess', payload: { data } });
    },
    * getTemplateContent({ payload }, { call, put }) {
      try {
        const { data } = yield call(getTemplate, payload);
        yield put({ type: 'getTemplateContentSuccess', payload: { data } });
      } catch (err) {
        let body = '';
        if (payload.type === 'welcome') {
          body = ' \n你好 {{name}},\n\n此邮件用来重置或初始化密码.\n\n点击下面链接设置' +
            `您的密码\nhttps://${payload.src}.aminer.org/retrieve?email` +
            '={{email}}&src={{src}}&token={{token}}\n\n这将允许您创建一个新的密码，' +
            '之后您可以登录到您的帐户。\n\n该链接在12小时内到期。\n\n如果您已经完成此操作，' +
            `或者您自己没有要求，请忽略此电子邮件。\n\n致！\n\n${payload.src.toUpperCase()}` +
            '客户团队\n\n注意：\n该电子邮件地址不能接收回复。\n要解决问题或了解有关您的帐户的`+' +
            '更多信息，请访问我们的网站。\n   ';
        }
        if (payload.type === 'reset-password') {
          body = '\n你好 {{name}},\n\n此电子邮件地址请求重设密码。\n\n要重设密码，' +
            `请点击下面的链接。\nhttps://${payload.src}.aminer.org/reset-password?email={{email}}` +
            '&src={{src}}&token={{token}}\n\n这将允许您创建一个新密码，然后您可以登录到您的帐户。' +
            '\n\n该链接将在12小时内到期。\n\n如果您已经完成了此操作，或者您自己没有请求，' +
            `请忽略此电子邮件\n\n此致\n\n${payload.src.toUpperCase()}帐户小组\n\n注意：\n此电子邮件地址` +
            '无法接受回复。\n若要解决问题或了解有关帐户的更多信息，请访问我们的网站。\n';
        }
        const data = {
          template: {
            body,
            subject: `欢迎使用${payload.src.toUpperCase()}系统`,
            category: payload.type,
            sender: `${payload.src.toUpperCase()}超级管理员`,
          },
        };
        yield put({ type: 'getTemplateContentSuccess', payload: { data } });
      }
    },
  },
  reducers: {
    setEmailTemplateSuccess(state, { payload: { data } }) {
      return { ...state, status: data.data.status };
    },
    getTemplateContentSuccess(state, { payload: { data } }) {
      return { ...state, emailContent: data.template };
    },
  },

};
