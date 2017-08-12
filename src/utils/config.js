/**
 * Created by yutao on 2017/5/22.
 */
// const SYS = 'ccf';
// const SYS = 'huawei';
// const SYS = 'alibaba';
// const SYS = 'tencent';
// const SYS = '2017-8';
const SYS = 'cie';

const param = (key, type, description) => {
  return { key, type, description };
};

module.exports = {
  // FIXME yanmei: 配置email template

  // To change SYSTEM settings. Please change /define.js.
  // TODO remove all use of this config [system,source].
  system: SYS, // 默认启动这是哪套系统，启动的时候传入app，之后会在APP里面重新设置。
  source: SYS, // AppID, Used in UniversalConfig.

  baseURL: 'https://api.aminer.org/api',
  // baseURL: 'https://166.111.7.105/api',

  name: '专家搜索',
  prefix: 'aminer',
  // footerText: 'AMiner © 2017 AMiner', // not used now.
  // logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  basePageURL: 'https://aminer.org',
  openPages: ['/login', '/roadhog.dll.js'],
  apiPrefix: '/api/',
  api: {
    // user system
    currentUser: '/user/me',
    userLogin: '/auth/signin',
    userLogout: '/auth/signout',
    signup: '/auth/signup',
    checkEmail: '/user/check/src/:src/email/:email',
    updateProfile: '/user/:id',
    forgot: '/auth/update/forgot',
    // 重置密码
    retrieve: '/auth/update/token',
    // 给user添加label {uid:'',label:''}
    invoke: '/user/role/invoke',
    // 删除user的label
    revoke: '/user/role/revoke',
    listUsersByRole: '/user/role/list/:role/offset/:offset/size/:size',
    // 创建邮件模板
    emailTemplate: '/user/mail/template/:src/:type',

    // search
    searchPerson: '/search/person', // pin=1 huawei mode.
    searchPersonAgg: '/search/person/agg',
    searchPersonInBase: '/search/roster/:ebid/experts/advanced',
    searchPersonInBaseAgg: '/search/roster/:ebid/experts/advanced/agg',
    allPersonInBase: '/roster/:ebid/order-by/h_index/offset/:offset/size/:size',
    allPersonInBaseAgg: '/roster/:ebid/agg?offset=&order=h_index&size=20',
    searchMap: '/search/person/geo', // ?query=:search
    searchExpertNetWithDSL: '/search/person/ego',

    searchPubs: '/search/pub', // ?query=xxx&size=20&sort=relevance',

    // search suggest
    searchSuggest: '/search/suggest/gen/:query',

    // export roster
    rosterExportSimple: '/roster/:id/export/s/offset/:offset/size/:size/:name',

    // seminar
    getSeminars: '/activity/list/offset/:offset/size/:size', // src aid uid organizer type category stype
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
    updateActivity: '/activity/update',
    speakerSuggest: '/activity/speaker/suggest',
    uploadActivityPosterImgFile: '/activity/img',
    searchActivity: '/search/activity',
    deleteActivity: '/activity/delete/:id',
    getCommentFromActivity: '/comment/activity/:id/offset/:offset/size/:size',
    addCommentToActivity: '/comment/activity/:id',
    deleteCommentFromActivity: '/comment/activity/cmid/:id',
    // score
    updateOrSaveActivityScore: '/activity/score/me/:src/:actid/:aid/:key/:score/:lvtime',
    // 不知 key, 列出相关的 key 和 scores.
    listActivityScores: '/activity/score-list/:uid/:src/:actid',
    // 已知 key 获取 一个 score
    getActivityScore: '/activity/score/:uid/:src/:actid/:aid/:key',
    getStatsOfCcfActivities: '/activity/admin/stats',
    keywordExtraction: 'http://nlp.newsminer.net/rest/nlp/keywords',
    getTopMentionedTags: '/activity/tags/:src/:num',

    /* person */
    personProfile: '/person/summary/:id',
    personEmailImg: '/person/email/i/',
    personEmailStr: '/person/email/s/:id',
    getEmailCrImage: '/person/email-cr/i/',
    listPersonByIds: '/person/batch-list',
    getActivityAvgScoresByPersonId: '/person/activity/:id/indices',

    // interests vis data
    interests: '/person/interests/:id',

    /* publications */
    pubList: '/person/pubs/:id/all/year/:offset/:size',
    pubListByCitation: '/person/pubs/:id/all/citation/:offset/:size',
    pubListInfo: '/person/pubs/:id/stats',
    pubListByYear: '/person/pubs/:id/range/year/:year/:offset/:size',
    pubListLimited: '/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size',

    // System config
    ucListByCategory: '/2b/config/:source/list?category=:category',
    ucSetByKey: '/2b/config/:source/:category/:key',
    ucDeleteByKey: '/2b/config/:source/:category/:key',
    ucUpdateByKey: '/2b/config/:source/:category/rename/:key/:newKey',
    getCategoriesHint: '/2b/config/:source/category/suggest/:category',

    // Knowledge Graph
    kgFind: {
      api: '/knowledge-graph/:entry',
      param: [ // means param in path.
        param('entry', 'string', 'query that matches name, name_zh, alias, in kgNode.'),
      ],
      query: {
        rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
        dp: param('dp', 'int', 'depth of parents'),
        dc: param('dc', 'int', 'depth of children'),
        ns: param('ns', 'int', 'number of sibling'),
        nc: param('nc', 'int', 'number of children'),
      },
    },
    kgGetByIds: {
      api: '/knowledge-graph/:id_chain',
      param: [
        param('id_chain', 'string', 'e.g.: id1.id2.id3'),
      ],
      query: {
        rich: param('rich', '1 or others', 'Returns simple result, 1 for all doc, others simple.'),
        dp: param('dp', 'int', 'depth of parents'),
        dc: param('dc', 'int', 'depth of children'),
        ns: param('ns', 'int', 'number of sibling'),
        nc: param('nc', 'int', 'number of children'),
      },
    },

    // userInfo: '/userInfo',
    // users: '/users',
    // dashboard: '/dashboard',

  },
};

