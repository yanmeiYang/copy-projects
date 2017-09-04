/**
 * Created by BoGao on 2017/6/20.
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import { addLocaleData } from 'react-intl';
import { loadSavedLocale } from '../utils/locale';

import * as alibabaConfig from './alibaba/config';
import * as ccfConfig from './ccf/config';
import * as ccftestConfig from './ccftest/config';
import * as huaweiConfig from './huawei/config';
import * as tencentConfig from './tencent/config';
import * as cipscConfig from './cipsc/config';
import * as cieConfig from './cie/config';
import * as demoConfig from './demo/config';
import * as cietestConfig from './cietest/config';
import * as medrobConfig from './medrob/config';

import { System, Source } from '../utils/system';
import Footer from '../components/Footers/default';
import defaults from './utils';

// All available systems.
const CurrentSystemConfig = {
  ccf: ccfConfig, // <-- current config files.
  ccftest: ccftestConfig,
  huawei: huaweiConfig,
  alibaba: alibabaConfig,
  tencent: tencentConfig,
  cie: cieConfig,
  cipsc: cipscConfig,
  demo: demoConfig,
  cietest: cietestConfig,
  medrob: medrobConfig,
};

// 默认配置
const defaultSystemConfigs = {
  SYSTEM: System,
  SOURCE: Source,

  //
  // Systems Preference
  //
  Locale: 'en', // en, zh
  EnableLocalLocale: false,
  // Language: 'en', // options [cn|en] // TODO change to locale.
  // PreferredLanguage: 'en', // 默认语言 // TODO delete this.

  MainListSize: 20,

  /**
   * Layout related
   */
  PageTitle: 'Aminer Business',
  // header
  Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 212,
  Header_LogoStyle: {},
  Header_SubTextLogo: '子标题',
  Header_SubTextStyle: {},
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  ShowHelpDoc: false, // 显示帮助文档
  Header_UserNameBlock: defaults.IN_APP_DEFAULT, // 显示登录用户名
  // footer and sidebar
  ShowFooter: true,
  Footer_Content: <Footer />,
  ShowSideMenu: true,

  /**
   * Functionality
   */
  Enable_Export: false,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置
  Signup_Password: false, // 注册页面password

  SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false, // TODO bad：Huawei PIN
  Search_EnableCCFPin: false, // TODO bad：CCF PIN
  Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;
  Search_DefaultTranslateSearch: false, // 默认使用翻译搜索;

  Search_EnableKnowledgeGraphHelper: true,
  Search_SortOptions: defaults.IN_APP_DEFAULT,

  UserAuthSystem: System, // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

  Auth_AllowAnonymousAccess: false,
  Auth_LoginPage: '/login',

  /**
   * Page specified config.
   */
  // PersonList
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
  SearchFilterExclude: '', // 'Gender',
  UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  // > IndexPage
  IndexPage_QuickSearchList: ['Artificial intelligence', 'Robotics',
    'Data Mining', 'Machine Learning', 'Data Modeling', 'Computer vision',
    'Networks', 'Natural language processing'],
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,
  // 地图中心点
  CentralPosition: { lat: 37.09024, lng: -95.712891 },

  // > Admin Users
  Admin_Users_ShowAdmin: true,
  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO
};

/** *************************************************
 * Combine
 ************************************************* */
const sysconfig = defaultSystemConfigs;
const currentSystem = CurrentSystemConfig[System];
Object.keys(currentSystem).map((key) => {
  sysconfig[key] = currentSystem[key];
  return null;
});

// load & Override language from localStorage.
if (sysconfig.EnableLocalLocale) {
  sysconfig.Locale = loadSavedLocale(sysconfig.SYSTEM, sysconfig.Locale);
}
addLocaleData('react-intl/locale-data/' + sysconfig.Locale);

module.exports = { sysconfig };
