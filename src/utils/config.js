/**
 * Created by yutao on 2017/5/22.
 */

// const SYS = 'ccf';
const SYS = 'ccf';
const baseURL = 'https://api.aminer.org/api';
// const SYS = 'alibaba';
// const SYS = 'tencent';

module.exports = {

  system: SYS, // 默认启动这是哪套系统，启动的时候传入app，之后会在APP里面重新设置。
  source: SYS, // AppID, Used in UniversalConfig.

  baseURL: 'https://api.aminer.org/api',
  // baseURL: 'https://166.111.7.105/api',

  name: '专家搜索',
  prefix: 'aminer',
  // footerText: 'AMiner © 2017 AMiner', // not used now.
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  basePageURL: 'https://aminer.org',
  openPages: ['/login'],
  apiPrefix: '/api/',
  api: {
    // user system
    currentUser: `${baseURL}/user/me`,
    userLogin: `${baseURL}/auth/signin`,
    userLogout: `${baseURL}/auth/signout`,
    signup: `${baseURL}/auth/signup`,
    checkEmail: `${baseURL}/user/check/:email`,
    forgot: `${baseURL}/auth/update/forgot`,
    // 重置密码
    retrieve: `${baseURL}/auth/update/token`,
    // 给user添加label {uid:'',label:''}
    invoke: `${baseURL}/user/role/invoke`,
    // 删除user的label
    revoke: `${baseURL}/user/role/revoke`,
    listUsersByRole: `${baseURL}/user/role/list/:role/offset/:offset/size/:size`,

    // search
    searchPerson: `${baseURL}/search/person`,
    searchPersonAgg: `${baseURL}/search/person/agg`,
    searchPersonInBase: `${baseURL}/search/roster/:ebid/experts/advanced`,
    searchPersonInBaseAgg: `${baseURL}/search/roster/:ebid/experts/advanced/agg`,
    allPersonInBase: `${baseURL}/roster/:ebid/order-by/h_index/offset/:offset/size/:size`,
    allPersonInBaseAgg: `${baseURL}/roster/:ebid/agg?offset=&order=h_index&size=20`,
    searchMap: `${baseURL}/search/person/geo`, // ?query=:search

    // search suggest
    searchSuggest: `${baseURL}/search/suggest/gen/:query`,

    // export roster
    rosterExportSimple: `${baseURL}/roster/:id/export/s/offset/:offset/size/:size/:name`,

    // seminar
    getSeminars: `${baseURL}/activity/list/offset/:offset/size/:size`,
    getActivityById: `${baseURL}/activity/:id`,
    postActivity: `${baseURL}/activity/post_activity`,
    speakerSuggest: `${baseURL}/activity/speaker/suggest`,
    uploadActivityPosterImgFile: `${baseURL}/activity/img`,
    searchActivity: `${baseURL}/search/activity`,
    deleteActivity: `${baseURL}/activity/delete/:id`,
    getCommentFromActivity: `${baseURL}/comment/activity/:id/offset/:offset/size/:size`,
    addCommentToActivity: `${baseURL}/comment/activity/:id`,
    deleteCommentFromActivity: `${baseURL}/comment/activity/cmid/:id`,
    // score
    updateOrSaveActivityScore: `${baseURL}/activity/score/me/:src/:actid/:aid/:key/:score/:lvtime`,
    // 不知 key, 列出相关的 key 和 scores.
    listActivityScores: `${baseURL}/activity/score-list/:uid/:src/:actid`,
    // 已知 key 获取 一个 score
    getActivityScore: `${baseURL}/activity/score/:uid/:src/:actid/:aid/:key`,
    getStatsOfCcfActivities: `${baseURL}/activity/admin/stats`,
    keywordExtraction: 'http://nlp.newsminer.net/rest/nlp/keywords',

    /* person */
    personProfile: `${baseURL}/person/summary/:id`,
    personEmailImg: `${baseURL}/person/email/i/`,
    getEmailCrImage: `${baseURL}/person/email-cr/i/`,
    listPersonByIds: `${baseURL}/person/batch-list`,
    getActivityAvgScoresByPersonId: `${baseURL}/person/activity/:id/indices`,

    // interests vis data
    interests: `${baseURL}/person/interests/:id`,

    /* publications */
    pubList: `${baseURL}/person/pubs/:id/all/year/:offset/:size`,
    pubListByCitation: `${baseURL}/person/pubs/:id/all/citation/:offset/:size`,
    pubListInfo: `${baseURL}/person/pubs/:id/stats`,
    pubListByYear: `${baseURL}/person/pubs/:id/range/year/:year/:offset/:size`,
    pubListLimited: `${baseURL}/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size`,

    // System config
    ucListByCategory: `${baseURL}/2b/config/:source/list?category=:category`,
    ucSetByKey: `${baseURL}/2b/config/:source/:category/:key`,
    ucDeleteByKey: `${baseURL}/2b/config/:source/:category/:key`,


    // userInfo: '/userInfo',
    // users: '/users',
    // dashboard: '/dashboard',

  },
};
