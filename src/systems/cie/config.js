/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import Footer from '../../components/Footers/cie';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'CIE 专家库',

  Language: 'cn', // options [cn|en]
  PreferredLanguage: 'cn', // 默认语言

  Search_SortOptions: [
    { label: '相关度', key: 'relevance' },
    { label: '学术成就', key: 'h_index' },
    { label: '学术活跃度', key: 'activity' },
    { label: '领域新星', key: 'rising_star' },
    { label: '学会贡献', key: 'activity-ranking-contrib' },
  ],

  PersonList_PersonLink: personId => `/person/${personId}`,
  PersonList_PersonLink_NewTab: false,

  IndexPage_QuickSearchList: ['人工智能', '机器人', '数据挖掘', '机器学习', '数据建模', '计算机视觉',
    '计算机网络', '网络', '自然语言处理'],

  PersonList_ShowIndices: ['activityRankingContrib', 'h_index', 'activity'],

  //
  // Layout related
  //
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
  Header_SubTextLogo: 'CIE 专家库',
  Header_SubTextStyle: { marginLeft: 12 },
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: <Footer />,
  ShowSideMenu: true,
  ShowFooter: true,

  // > Search related
  SearchBarInHeader: false,
  // 是否显示创建新用户btn
  ApplyUserBtn: false,
  // Functionality
  Enable_Export: true,

  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: '592f8af69ed5db8bb68d713b', // CIE
  DEFAULT_EXPERT_BASE_NAME: '会士',
  ExpertBases: [
    {
      id: '592f8af69ed5db8bb68d713b',
      name: '会士(F)',
      nperson: 79,
    },
    {
      id: '58ddbc229ed5db001ceac2a4',
      name: '杰出会员(D)',
      nperson: 182,
    },
    {
      id: '592f6d219ed5dbf59c1b76d4',
      name: '高级会员(S)',
      nperson: 2246,
    },
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },

  ],


  // 特殊配置，这里是System的自己的配置

  ShowConfigTab: false,
  SysconfigDefaultCategory: 'activity_type',
  SysConfigTabs: [
    {
      category: 'user_roles',
      label: '用户角色列表',
      desc: 'CIE 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '协办单位',
      desc: 'CIE 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'CIE 活动的类型。',
    },
  ],


};
