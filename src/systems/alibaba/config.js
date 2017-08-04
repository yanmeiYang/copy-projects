/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import defaults from '../utils';

module.exports = {

  //
  // Systems Preference
  //
  Language: 'cn', // options [cn|en]
  PreferredLanguage: 'cn', // 默认语言
  // MainListSize: 20,

  //
  // Layout related
  //
  PageTitle: '阿里学术资源地图',
  Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 280,
  Header_LogoStyle: {
    width: 150,
    backgroundPosition: '0px -23px',
    backgroundSize: 'auto 100px',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
  },
  Header_SubTextLogo: '学术资源地图',
  Header_SubTextStyle: {},
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: defaults.EMPTY_BLOCK,
  ShowSideMenu: false,
  ShowFooter: true,

  //
  // Functionality
  //
  Enable_Export: false,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置

  // SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: false,
  // Search_SortOptions: defaults.IN_APP_DEFAULT,

  // UserAuthSystem: config.system, // aminer 或者是 system.config
  // UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签

  //
  // Page specified config.
  //
  // > PersonList
  // PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  // PersonList_PersonLink_NewTab: true,
  // Person_PersonLabelBlock: EMPTY_BLOCK_FUNC, // profile => 'jsx',

  // > Search
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: 'ALL',

  // > Search related
  // SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertMap'], // use default settings in component.
  // SearchFilterExclude: 'Gender',
  // UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  // > IndexPage
  // IndexPage_QuickSearchList: ['Artificial intelligence', 'Robotics',
  //   'Data Mining', 'Machine Learning', 'Data Modeling', 'Computer vision',
  //   'Networks', 'Natural language processing'],
  // IndexPage_InfoBlocks: EMPTY_BLOCK,


  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO


  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
    {
      id: '595208bd9ed5dbf9cd563c60.593e4ac29ed5db77fc7be728.593beddb9ed5db23ccac7dbf.593b7c889ed5db23ccac68e6',
      name: 'IEEE Fellow(2013-2016)',
      nperson: 0,
    },
    {
      id: '596c130f9ed5db449d3fbe83',
      name: 'ACM Fellow',
      nperson: 53,
    },
    {
      id: '5923c0829ed5db1600b942db',
      name: '英国皇家科学院－Research Fellows Directory',
      nperson: 976,
    },
    {
      id: '5923bfee9ed5db1600b941f2',
      name: '英国皇家科学院－Fellows Directory',
      nperson: 287,
    },
    {
      id: '55ebd8b945cea17ff0c53d5a',
      name: '中国科学院院士',
      nperson: 287,
    },
    {
      id: '5912aa3a9ed5db655182ffde',
      name: '美国科学院外国专家',
      nperson: 287,
    },
  ],

};
