// /**
//  *  Created by BoGao on 2017-07-14;
//  */
// import App from './routes/app';
// import App2b from './routes/2b/app2b';
// import { registerModel } from './utils';
//
//
// const core = {
//
//   IndexPage2b: (app, childRoutes) => ({
//     path: '/2b',
//     component: App2b,
//     getIndexRoute(nextState, cb) {
//       require.ensure([], (require) => {
//         registerModel(app, require('./models/auth'));
//         cb(null, { component: require('./routes/2b/2bIndex') });
//       }, '2b');
//     },
//     childRoutes,
//   }),
//
//   IndexPage: (app, childRoutes) => ({
//     path: '/',
//     component: App,
//     getIndexRoute(nextState, cb) {
//       require.ensure([], (require) => {
//         // registerModel(app, require('./models/search-suggest'));
//         cb(null, { component: require('./routes/IndexPage') });
//       }, 'indexPage');
//     },
//     childRoutes,
//   }),
//
//   Default404: () => ({
//     path: '*',
//     getComponent(nextState, cb) {
//       require.ensure([], (require) => {
//         cb(null, require('./routes/error/'));
//       }, 'error');
//     },
//   }),
//
//   ...require('./routes/expert-map/router-map'),
//   ...require('./routes/search/router-search'),
//   ...require('./routes/person/router-person'),
//   ...require('./routes/user/router-user'),
//   ...require('./routes/admin/router-admin'),
//   ...require('./routes/seminar/router'),
//   ...require('./routes/auth/auth-router'),
//   ...require('./routes/trend-prediction/router'),
//   ...require('./routes/2b/router-2b'),
//   ...require('./routes/2b-profile/route'),
//   ...require('./routes/expert-base/route-eb'),
//   ...require('./routes/recommendation/router-rcd'),
//   ...require('./routes/third-login/router'),
//   ...require('./routes/router-core'), // Other routes.
//
// };
//
// module.exports = { registerModel, core };
