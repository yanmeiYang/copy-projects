/**
 * Created by yutao on 2017/5/22.
 */

module.exports = {
  name: '专家搜索',
  source: 'ccf', // AppID, Used in UniversalConfig.
  prefix: 'aminer',
  footerText: 'AMiner © 2017 AMiner', // not used now.
  logo: '/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  baseURL: 'https://api.aminer.org/api',
  basePageURL: 'https://aminer.org',
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/',
  api: {
    searchPerson: '/search/person',
    searchPersonInBase: '/search/roster/:ebid/experts/advanced',
    searchPersonInBaseAgg: '/search/roster/:ebid/experts/advanced/agg',
    allPersonInBase: '/roster/:ebid/order-by/h_index/offset/:offset/size/:size',
    allPersonInBaseAgg: '/roster/:ebid/agg?offset=&order=h_index&size=20',
    userLogin: '/auth/signin',

    // seminar
    getSeminars: '/activity/list/offset/:offset/size/:size',
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
    speakerSuggest: '/activity/speaker/suggest',
    uploadActivityPosterImgFile: '/activity/img',
    searchActivity: '/search/activity',

    /* person */
    personProfile: '/person/summary/:id',
    personEmailImg: '/person/email/i/',
    getEmailCrImage: '/person/email-cr/i/',
    listPersonByIds: '/person/batch-list',

    /* publications */
    pubList: '/person/pubs/:id/all/year/:offset/:size',
    pubListByCitation: '/person/pubs/:id/all/citation/:offset/:size',
    pubListInfo: '/person/pubs/:id/stats',
    pubListByYear: '/person/pubs/:id/range/year/:year/:offset/:size',
    pubListLimited: '/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size',

    // interests vis data
    interests: '/person/interests/:id',
    // userLogout: '/user/logout',
    // userInfo: '/userInfo',
    // users: '/users',
    currentUser: '/user/me',
    // dashboard: '/dashboard',

    // System config
    ucListByCategory: '/2b/config/:source/list?category=:category',
    ucSetByKey: '/2b/config/:source/:category/:key',
    ucDeleteByKey: '/2b/config/:source/:category/:key',
  },
};
