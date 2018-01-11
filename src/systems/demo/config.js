import React from 'react';
import { toIDDotString, TopExpertBase } from 'utils/expert-base';

export default {

  Locale: 'zh', // en, zh
  EnableLocalLocale: true,
  GLOBAL_ENABLE_FEEDBACK: true,

  // PersonList_ShowIndices: ['activityRankingContrib', 'h_index', 'activity'],

  /**
   * Layout related
   */
  Layout_HasSideBar: false, // 是否显示左侧菜单
  Header_UserPageURL: '/user/info',
  ShowHelpDoc: false, // 显示帮助文档

  //
  // Functionality
  //
  Enable_Export: true,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置

  SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: true,

  // AI search helper translation/expand/kg
  Search_EnableTranslateSearch: false, // 启用翻译搜索，显示提示信息;/
  Search_DefaultTranslateSearch: false, // 默认使用翻译搜索;
  Search_EnableSmartSuggest: true, // 启用智能提示;  启用后，禁用translateSearch
  Search_SmartSuggest_EnableExpand: true, // TODO
  Search_SmartSuggest_EnableTranslate: true, // TODO
  Search_SmartSuggest_EnableKG: true, // TODO


  // UserAuthSystem: System, // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

  Auth_AllowAnonymousAccess: false,

  // > Search
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。

  // > Search related
  // 是否显示创建新用户btn
  ApplyUserBtn: false,

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      id: toIDDotString(TopExpertBase.ACMFellow),
      name: 'ACM Fellow',
      nperson: 53 + 809,
    },
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow(2013-2016)',
      nperson: 0,
    },
  ],

  // Map Related,2 is recommended!
  Map_Preload: 0, // 0的时候不缓存，1的时候缓存信息，2的时候缓存信息和90头像，3的时候缓存信息和90、160头像
  CentralPosition: { lat: 37.09024, lng: -95.712891 },
  Map_HotDomains: TopExpertBase.RandomTop100InDomainAminer, // 地图领域
  HotDomains_Type: 'filter', // filter or selector
};
