/**
 * Created by yutao on 2017/5/22.
 */

module.exports = {

  system: 'huawei', // 默认启动这是哪套系统，启动的时候传入app，之后会在APP里面重新设置。
  source: 'huawei', // AppID, Used in UniversalConfig.

  // system: 'alibaba',
  // source: 'alibaba',

  baseURL: 'https://api.aminer.org/api',
  // baseURL: 'https://166.111.7.105/api',

  name: '专家搜索',
  prefix: 'aminer',
  footerText: 'AMiner © 2017 AMiner', // not used now.
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  basePageURL: 'https://aminer.org',
  openPages: ['/login'],
  apiPrefix: '/api/',
  api: {
    // user system
    currentUser: '/user/me',
    userLogin: '/auth/signin',
    userLogout: '/auth/signout',
    signup: '/auth/signup',
    checkEmail: '/user/check/:email',
    // 给user添加label {uid:'',label:''}
    invoke: '/user/role/invoke',
    // 删除user的label
    revoke: '/user/role/revoke',
    listUsersByRole: '/user/role/list/:role/offset/:offset/size/:size',

    // search
    searchPerson: '/search/person',
    searchPersonAgg: '/search/person/agg',
    searchPersonInBase: '/search/roster/:ebid/experts/advanced',
    searchPersonInBaseAgg: '/search/roster/:ebid/experts/advanced/agg',
    allPersonInBase: '/roster/:ebid/order-by/h_index/offset/:offset/size/:size',
    allPersonInBaseAgg: '/roster/:ebid/agg?offset=&order=h_index&size=20',
    searchMap: '/search/person/geo', // ?query=:search

    // search suggest
    searchSuggest: '/search/suggest/gen/:query',

    // export roster
    rosterExportSimple: '/roster/:id/export/s/offset/:offset/size/:size/:name',

    // seminar
    getSeminars: '/activity/list/offset/:offset/size/:size',
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
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

    /* person */
    personProfile: '/person/summary/:id',
    personEmailImg: '/person/email/i/',
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


    // userInfo: '/userInfo',
    // users: '/users',
    // dashboard: '/dashboard',

  },
};
