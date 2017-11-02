/**
 * Created by BoGao on 2017/6/20.
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import { addLocaleData } from 'react-intl';
import { loadSavedLocale } from 'utils/locale';
import { System, Source } from 'utils/system';
import { TopExpertBase } from 'utils/expert-base';
import defaults from './utils'; // Warrning: no zhuo no die.

// All available systems.
const CurrentSystemConfig = {
  aminer: require('./aminer/config'),
  ccf: require('./ccf/config'),
  ccftest: require('./ccftest/config'),
  huawei: require('./huawei/config'),
  alibaba: require('./alibaba/config'),
  tencent: require('./tencent/config'),
  cie: require('./cie/config'),
  cipsc: require('./cipsc/config'),
  demo: require('./demo/config'),
  cietest: require('./cietest/config'),
  bole: require('./bole/config'),
  acmfellow: require('./acmfellow/config'),
  DataAnnotation: require('./DataAnnotation/config'),
};

// 默认配置
const getDefaultSystemConfigs = (system, source) => {
  return {
    SYSTEM: system,
    SOURCE: source,

    //
    // Systems Preference
    //
    Locale: 'en', // en, zh
    EnableLocalLocale: false, // 将Locale存储到localStorage
    GLOBAL_ENABLE_HOC: true,
    Use_CDN: true,

    // google analysis
    googleAnalytics: defaults.IN_APP_DEFAULT,

    MainListSize: 20,

    /**
     * Layout related
     */
    PageTitle: 'Aminer Business',
    Layout_HasSideBar: false, // 是否显示左侧菜单
    Layout_HasNavigator: true,

    // header
    Header_UserPageURL: '', // 用户头像点击之后去的页面.
    Header_RightZone: defaults.EMPTY_BLOCK_FUNC_LIST,
    ShowHelpDoc: false, // 显示帮助文档
    Header_UserNameBlock: defaults.IN_APP_DEFAULT, // 显示登录用户名

    /**
     * Functionality
     */
    Enable_Export: false,
    Enable_Export_EB_IF_EXIST: false,
    ShowRegisteredRole: true, // 注册页面是否显示角色配置
    Signup_Password: false, // 注册页面password

    SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
    Search_EnablePin: false, // TODO bad：Huawei PIN
    Search_EnableCCFPin: false, // TODO bad：CCF PIN
    Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;
    Search_DefaultTranslateSearch: false, // 默认使用翻译搜索;
    Search_EnableKnowledgeGraphHelper: true,
    Search_FixedExpertBase: null,

    Search_DisableFilter: false,
    Search_DisableExpertBaseFilter: false,
    Search_DisableSearchKnowledge: false,

    Search_SortOptions: defaults.IN_APP_DEFAULT,

    UserAuthSystem: system, // aminer 或者是 system.config
    UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

    Auth_AllowAnonymousAccess: false,
    Auth_LoginPage: '/login',

    /**
     * Page specified config.
     */

    /**
     * PersonList
     */
    PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}?token=bianyigetoken`,
    PersonList_PersonLink_NewTab: true,
    PersonList_DidMountHooks: defaults.EMPTY_BLOCK_FUNC_LIST,
    PersonList_UpdateHooks: defaults.EMPTY_BLOCK_FUNC_LIST,
    Search_CheckEB: false,
    PaperLink: paperId => `https://aminer.org/archive/${paperId}`,

    // > Search
    // expert base
    SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
    ExpertBases: [], // must override.
    DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
    DEFAULT_EXPERT_BASE_NAME: '全球专家',
    DEFAULT_EXPERT_SEARCH_KEY: 'term', // 旧API智库搜索中三选一

    // > Search related
    SearchBarInHeader: true,
    HeaderSearch_TextNavi: defaults.IN_APP_DEFAULT, // use default settings in component.
    SearchFilterExclude: '', // 'Gender',
    UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

    // > IndexPage
    IndexPage_QuickSearchList: [
      { name: 'Artificial intelligence', name_zh: '人工智能' },
      { name: 'Robotics', name_zh: '机器人' },
      { name: 'Data Mining', name_zh: '数据挖掘' },
      { name: 'Machine Learning', name_zh: '机器学习' },
      { name: 'Data Modeling', name_zh: '数据建模' },
      { name: 'Computer vision', name_zh: '计算机视觉' },
      { name: 'Networks', name_zh: '网络' },
      { name: 'Natural language processing', name_zh: '自然语言处理' },
    ],

    IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

    // Map Related
    Map_Preload: true,
    CentralPosition: { lat: 37.09024, lng: -95.712891 },
    Map_HotDomains: TopExpertBase.RandomTop100InDomainAminer, //地图领域
    HotDomains_Type: 'filter', //filter or selector

    /**
     * Replace Hooks.
     */
    Register_AddPrivilegesToExpertBaseIDs: [],


    // > Admin Users
    Admin_Users_ShowAdmin: true,
    // PersonList_ShowIndices: [], // do not override in-component settings. // TODO

    // 临时属性，过度属性
    USE_NEXT_EXPERT_BASE_SEARCH: false, // 是否使用新的后端来搜索新的结果。

  },
};

/***************************************************
 * Combine
 **************************************************/
const sysconfig = getDefaultSystemConfigs(System, Source);
const currentSystem = CurrentSystemConfig[System];
Object.keys(currentSystem).map((key) => {
  sysconfig[key] = currentSystem[key];
  return null;
});

/***************************************************
 * load & Override language from localStorage.
 **************************************************/
if (sysconfig.EnableLocalLocale) {
  sysconfig.Locale = loadSavedLocale(sysconfig.SYSTEM, sysconfig.Locale);
}
addLocaleData('react-intl/locale-data/' + sysconfig.Locale);

module.exports = { sysconfig, defaultSystemConfigs, CurrentSystemConfig };
