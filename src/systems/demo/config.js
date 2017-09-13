/**
 * Created by ranyanchuan on 2017/8/11.
 */
import React from 'react';
import { toIDDotString, TopExpertBase } from '../../utils/expert-base';

module.exports = {

  PageTitle: '专家库',

  //
  // Systems Preference
  //
  Locale: 'en', // en, zh
  EnableLocalLocale: false,

  IndexPage_QuickSearchList: ['人工智能', '机器人', '数据挖掘', '机器学习', '数据建模', '计算机视觉',
    '计算机网络', '网络', '自然语言处理'],

  PersonList_ShowIndices: ['activityRankingContrib', 'h_index', 'activity'],

  /**
   * Layout related
   */
  Layout_HasSideBar: true, // 是否显示左侧菜单

  // Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 213,
  Header_LogoStyle: {
    width: '60px',
    height: '38px',
    backgroundPosition: '8px 2px',
    backgroundSize: ' auto 32px',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
  },
  Header_SubTextLogo: '专家库',
  Header_SubTextStyle: { marginLeft: 12 },
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  ShowFooter: true,
  ShowHelpDoc: false, // 显示帮助文档

  //
  // Functionality
  //
  Enable_Export: true,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置

  SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: true,

  UserAuthSystem: 'aminer', // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

  Auth_AllowAnonymousAccess: false,

  // > Search
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。

  // > Search related
  SearchBarInHeader: true,
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


};
