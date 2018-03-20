/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
// import { Link } from 'dva/router';
import defaults from 'core/hole';

// import { PersonComment } from './components';
// import { GetComments } from './person-comment-hooks';

const ExpertBase = '5a9f4de87e96b5460de11d00'; // TODO should change this?
const ExpertBaseName = '删掉我'; // TODO should change this?

export default {

  Locale: 'zh', // en, zh
  EnableLocalLocale: false,
  GLOBAL_ENABLE_FEEDBACK: true,

  PageTitle: '中国图学学会',

  // AI search helper translation/expand/kg
  Search_EnableTranslateSearch: false, // 启用翻译搜索，显示提示信息;/
  Search_DefaultTranslateSearch: false, // 默认使用翻译搜索;
  Search_EnableSmartSuggest: false, // 启用智能提示;  启用后，禁用translateSearch
  Search_SmartSuggest_EnableExpand: true, // TODO
  Search_SmartSuggest_EnableTranslate: true, // TODO
  Search_SmartSuggest_EnableKG: true, // TODO

  /**
   * Replace Hooks.
   */
  ShowRegisteredRole: false,
  Register_AddPrivilegesToExpertBaseIDs: [ExpertBase],

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // google analytics
  // googleAnalytics: 'UA-107003102-6',

  IndexPage_Redirect: '/eb',
  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_UserPageURL: '/user/info',

  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  Enable_Export_EB_IF_EXIST: true,
  Search_EnablePin: false,

  // > Search related
  HeaderSearch_TextNavi: [],
  // HeaderSearch_TextNavi: [],

  // Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: true,
  // Search_DisableSearchKnowledge: false,
  Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },

  /**
   * Page specified config.
   */

  /**
   * Person List
   */
  // PersonList_DidMountHooks: [],

  // PersonList_UpdateHooks: [
  //   param => GetComments(param),
  // ],

  // 智库权限设置 TODO param => xxx
  // RegisterUserHooks: [
  //   (dispatch, id, email, name, perm) => authenticateExpertBase(dispatch, id, email, name, perm),
  // ],

  Search_CheckEB: true, // Check ExpertBase.

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
  ],

  // acmfellow 系统, 带有eb的系统
  ExpertBase, ExpertBaseName,

  // 临时属性，需要删除
  USE_NEXT_EXPERT_BASE_SEARCH: true,

};
