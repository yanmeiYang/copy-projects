/**
 *  Created by BoGao on 2017-07-15;
 *  Refactored by BoGao on 2017-09-07; dva@2.0 react-router-4
 */
export default {

  AdminUsers: {
    path: '/admin/users',
    models: () => [
      import('models/common/universal-config'),
      import('models/auth/auth'),
    ],
    component: () => import('./user/Users'),
  },

  AdminAddUserRolesByOrg: {
    path: '/admin/system-config/user_roles',
    models: () => [
      import('models/common/universal-config'),
      import('models/auth/auth'),
    ],
    component: () => import('./add-user-roles'),
  },

  AdminSystemConfig: {
    path: '/admin/system-config',
    models: () => [
      import('models/common/universal-config'),
      import('models/admin/system-config'),
    ],
    component: () => import('./system-config'),
  },

  AdminContributionType: {
    path: '/admin/system-config/contribution_type',
    models: () => [
      import('models/common/universal-config'),
      import('models/admin/system-config'),
    ],
    component: () => import('./contribution-type'),
  },

  AdminActivityType: {
    path: '/admin/system-config/orgcategory',
    models: () => [
      import('models/common/universal-config'),
      import('models/admin/system-config'),
    ],
    component: () => import('./activity-type'),
  },

  AdminSystemConfigWithCategory: {
    path: '/admin/system-config/:category',
    models: () => [
      import('models/common/universal-config'),
      import('models/admin/system-config'),
    ],
    component: () => import('./system-config'),
  },

  // TODO yanmei:
  AdminSystemOrgCategory: {
    path: '/admin/category-list',
    models: () => [
      import('models/common/universal-config'),
      import('models/admin/system-config'),
    ],
    component: () => import('./org-category'),
  },

};

