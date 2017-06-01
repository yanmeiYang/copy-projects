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
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7000'],
  openPages: ['/login'],
  apiPrefix: '/api/',
  api: {
    searchPerson: '/search/person',
    searchPersonInBase: '/search/roster/:ebid/experts/advanced',
    searchPersonInBaseAgg: '/search/roster/:ebid/experts/advanced/agg',
    userLogin: '/auth/signin',
    getSeminars: '/activity/list/offset/:offset/size/:size',
    getActivityById: '/activity/:id',
    postActivity: '/activity/post_activity',
    // userLogout: '/user/logout',
    // userInfo: '/userInfo',
    // users: '/users',
    // user: '/user/:id',
    // dashboard: '/dashboard',
  },
};
