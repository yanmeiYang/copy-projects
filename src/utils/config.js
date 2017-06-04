/**
 * Created by yutao on 2017/5/22.
 */

module.exports = {
  name: '云智库',
  prefix: 'aminer',
  footerText: 'AMiner  © 2017 AMiner',
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
    getSeminars: '/activity/list/offset/:offset/size/:size',
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
    speakerSuggest: '/activity/speaker/suggest',

    /* person */
    personProfile: '/person/summary/:id',
    personEmailImg: '/person/email/i/',
    getEmailCrImage: '/person/email-cr/i/',

    /* publications */
    pubList: '/person/pubs/:id/all/year/:offset/:size',
    pubListByCitation: '/person/pubs/:id/all/citation/:offset/:size',
    pubListInfo: '/person/pubs/:id/stats',
    pubListByYear: '/person/pubs/:id/range/year/:year/:offset/:size',
    pubListLimited: '/person/pubs/:id/range/citation/:nc_lo/:nc_hi/:offset/:size',
    // userLogout: '/user/logout',
    // userInfo: '/userInfo',
    // users: '/users',
    // user: '/user/:id',
    // dashboard: '/dashboard',
  },
};
