/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import * as alibabaConfig from './alibaba/config';
import * as ccfConfig from './ccf/config';
import * as huaweiConfig from './huawei/config';
import * as tencentConfig from './tencent/config';
import * as cieConfig from './cie/config';
import * as demoConfig from './demo/config';


import { config } from '../utils';
import Footer from '../components/Footers/default';
import defaults from './utils';

// All available systems.
const CurrentSystemConfig = {
  ccf: ccfConfig, // <-- current config files.
  huawei: huaweiConfig,
  alibaba: alibabaConfig,
  tencent: tencentConfig,
  cie: cieConfig,
  demo: demoConfig,
};

// 默认配置
const defaultSystemConfigs = {
  SYSTEM: config.system,

  // 所有可选系统
  AllOptionalSystems: ['ccf', 'huawei', 'alibaba', 'tencent', 'cie'],

  //
  // Systems Preference
  //
  Language: 'en', // options [cn|en]
  PreferredLanguage: 'en', // 默认语言
  MainListSize: 20,

  //
  // Layout related
  //
  PageTitle: 'Aminer Business',
  Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 212,
  Header_LogoStyle: {},
  Header_SubTextLogo: '子标题',
  Header_SubTextStyle: {},
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: <Footer />,
  ShowSideMenu: true,
  ShowFooter: true,

  //
  // Functionality
  //
  Enable_Export: false,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置

  SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: true,
  Search_SortOptions: defaults.IN_APP_DEFAULT,

  UserAuthSystem: config.system, // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签

  Auth_AllowAnonymousAccess: false,
  Auth_LoginPage: '/login',

  //
  // Page specified config.
  //
  // > PersonList
  PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  PersonList_PersonLink_NewTab: true,
  Person_PersonLabelBlock: defaults.EMPTY_BLOCK_FUNC, // profile => 'jsx',

  // > Search
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  ExpertBases: [], // must override.
  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: '全球专家',

  // > Search related
  SearchBarInHeader: true,
  HeaderSearch_TextNavi: defaults.IN_APP_DEFAULT, // use default settings in component.
  SearchFilterExclude: 'Gender',
  UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  // > IndexPage
  IndexPage_QuickSearchList: ['Artificial intelligence', 'Robotics',
    'Data Mining', 'Machine Learning', 'Data Modeling', 'Computer vision',
    'Networks', 'Natural language processing'],
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,
  // 地图中心点
  CentralPosition: {},


  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO
};

/** *************************************************
 * Combine
 ************************************************* */
const sysconfig = defaultSystemConfigs;
const currentSystem = CurrentSystemConfig[config.system];
Object.keys(currentSystem).map((key) => {
  sysconfig[key] = currentSystem[key];
  return null;
});

module.exports = { sysconfig };
