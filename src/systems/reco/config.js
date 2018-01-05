/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import defaults from 'core/hole';


const ExpertBase = '59d7bb7e9ed5dbe450e6b275';

module.exports = {

  Use_CDN: true,

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'Reco',
  // SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowRegisteredRole: false,
  GLOBAL_ENABLE_HOC: true,
  EnableLocalLocale: true,

  UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.

  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_UserPageURL: '/user-info',
  //Header_RightZone: [() => <Link key="0" to={`/eb/${ExpertBase}/-/0/20`}>我的专家库</Link>], // TODO make this a Component.

  // Footer_Content: '',
  SHOW_ExpertBase: true,

  // Functionality
  Enable_Export: false,
  // Enable_Export: true,
  Search_EnablePin: false,

  // > Search related
  // HeaderSearch_TextNavi: ['ACMFellowExpertBase', 'ACM_ExpertSearch'],
  // HeaderSearch_TextNavi: [],

  // Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: true,
  // Search_DisableSearchKnowledge: false,
  // Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },

  /**
   * Page specified config.
   */

  /**
   * PersonList
   */
  PersonList_PersonLink: personId => `/p/${personId}`,
  PersonList_PersonLink_NewTab: true,
  PersonList_TitleRightBlock: defaults.EMPTY_BLOCK_FUNC, // profile => 'jsx',
  PersonList_RightZone: defaults.IN_COMPONENT_DEFAULT, // [()=><COMP>]
  PersonList_BottomZone: defaults.IN_COMPONENT_DEFAULT,
  //param: [person, eb{id,name}]

  Search_CheckEB: true, // Check ExpertBase.

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  // > IndexPage
  // IndexPage_QuickSearchList: ['data mining','machine learning','social network','deep learning', 'healthcare',
  //   'organic light-emitting diodes', 'Tim Berners-Lee', 'Jon Kleinberg', 'Jiawei Han','Geoffrey Hinton'


  IndexPage_QuickSearchList: [
    { name: 'data mining', name_zh: '' },
    { name: 'machine learning', name_zh: '' },
    { name: 'social network', name_zh: '' },
    { name: 'deep learning', name_zh: '' },
    { name: 'healthcare', name_zh: '' },
    { name: 'organic light-emitting diodes', name_zh: '' },
    { name: 'Tim Berners-Lee', name_zh: '' },
    { name: 'Jon Kleinberg', name_zh: '' },
    { name: 'Jiawei Han', name_zh: '' },
    { name: 'Geoffrey Hinton', name_zh: '' },
  ],

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
  ],

  // acmfellow 系统
  ExpertBase,
  // bole 智库权限设置 TODO param => xxx
  // HOOK: [
  //   (dispatch, id, email, name, perm) => createRoster(dispatch, id, email, name, perm),
  // ],
};
