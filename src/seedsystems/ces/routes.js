/**
 * Created by yangyanmei on 2018/3/12.
 */

// 以文件夹为单位，对应到pages下面的目录结构.
module.exports = {
  routes: [
    // '*', // uncomment this when develop.

    // TODO 2b page routes.`

    'index',
    'managementOrg',

    // search
    'search',

    // user & auth.
    'login',
    'user',
    'eb',
    'admin/users',

    '404',

    // 2b profile
    // router2bprofile.TobProfile,
    // router2bprofile.Addition,

    // tencent.ThirdLogin,
    // Management Org
    // magOrg.ManagermentOrg,
    // magOrg.Org,
    // System Default.
  ],
};
