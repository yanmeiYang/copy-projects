/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
// import { Link } from 'dva/router';
import { authenticateExpertBase } from 'hooks';
import defaults from '../utils';
// import { PersonComment } from './components';
// import { GetComments } from './person-comment-hooks';

const ExpertBase = '59d7bb7e9ed5dbe450e6b275';

module.exports = {

  EnableLocalLocale: true,
  GLOBAL_ENABLE_FEEDBACK: true,

  PageTitle: 'ACM Fellow',

  // AI search helper translation/expand/kg
  Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;/
  Search_DefaultTranslateSearch: true, // 默认使用翻译搜索;
  Search_EnableSmartSuggest: false, // 启用智能提示;  启用后，禁用translateSearch
  Search_SmartSuggest_EnableExpand: false, // TODO
  Search_SmartSuggest_EnableTranslate: false, // TODO
  Search_SmartSuggest_EnableKG: false, // TODO

  /**
   * Replace Hooks.
   */
  ShowRegisteredRole: false,
  Register_AddPrivilegesToExpertBaseIDs: [ExpertBase],

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // google analytics
  googleAnalytics: 'UA-107003102-6',

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_UserPageURL: '/user-info',

  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: true,
  Enable_Export_EB_IF_EXIST: true,
  Search_EnablePin: false,

  // > Search related
  HeaderSearch_TextNavi: ['ACMFellowExpertBase', 'ACM_ExpertSearch'],
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

  // NextAPI-QueryHooks:
  APIPlugin_ExpertSearch: {
    parameters: {
      aggregation: ['dims.systag'],
      haves: { systag: [] },
    },
  },

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
  ],

  // acmfellow 系统
  ExpertBase,

  // 临时属性，需要删除
  USE_NEXT_EXPERT_BASE_SEARCH: true,

};
