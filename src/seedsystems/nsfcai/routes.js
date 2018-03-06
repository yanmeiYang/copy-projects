/**
 * Created by BoGao on 2018/3/5.
 */

// 以文件夹为单位，对应到pages下面的目录结构.
module.exports = {
  routes: [
    '*', // uncomment this when develop.

    // TODO 2b page routes.`

    'index',

    // search
    'search',

    // user & auth.
    'login',
    'user/info',

    // expertBase.ExpertBase,
    // expertBase.ExpertBaseExpertsPage,
    // expertBase.ExpertBaseExpertsPageWithPager,
    // expertBase.AddExpertBase,
    // expertBase.AddExpertDetail,
    // // expertBase.ExpertProfileInfo,
    //
    // // Admin(Specified by ccf) TODO some are only used by ccf, move out.
    // admin.AdminUsers,
    //
    // // 2b profile
    // router2bprofile.TobProfile,
    // router2bprofile.Addition,
    //
    // // tencent.ThirdLogin,
    // // Management Org
    // magOrg.ManagermentOrg,
    // magOrg.Org,
    // // System Default.
    // core.Error404, // must be last one.

    // nsfcai.NsfcIndex,
    // nsfcai.Conflicts,
    // nsfcai.NsfcIdAndName,
    // nsfcai.ConflictsRough,
    //
  ],
};


// const routes = [
//   ...RouterRegistry2b,
//   // ...RouterRegistry,
//
//   nsfcai.NsfcIndex,
//   nsfcai.Conflicts,
//   nsfcai.NsfcIdAndName,
//   nsfcai.ConflictsRough,
//
//   // search
//   // search.ExpertSearch,
//   search.UniSearch,
//   //   core.Experts(app),
//
//   // person
//   // person.Person,
//
//   // user & auth.
//   auth.Login,
//   user.Register,
//   user.User,
//   user.ForgotPassword,
//   user.ResetPassword,
//   user.Retrieve,
//   user.UserInfo,
//
//   expertBase.ExpertBase,
//   expertBase.ExpertBaseExpertsPage,
//   expertBase.ExpertBaseExpertsPageWithPager,
//   expertBase.AddExpertBase,
//   expertBase.AddExpertDetail,
//   // expertBase.ExpertProfileInfo,
//
//   // Admin(Specified by ccf) TODO some are only used by ccf, move out.
//   admin.AdminUsers,
//
//   // 2b profile
//   router2bprofile.TobProfile,
//   router2bprofile.Addition,
//
//   // tencent.ThirdLogin,
//   // Management Org
//   magOrg.ManagermentOrg,
//   magOrg.Org,
//   // System Default.
//   core.Error404, // must be last one.
// ];
