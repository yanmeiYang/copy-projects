/**
 * Created by ranyanchuan on 2017/8/11.
 */
import React from 'react';


module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: '专家库',

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
  Header_SubTextLogo: '专家库',
  Header_SubTextStyle: { marginLeft: 12 },
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  ShowSideMenu: true,
  ShowFooter: true,

  // > Search related
  SearchBarInHeader: false,
  // 是否显示创建新用户btn
  ApplyUserBtn: false,
  // Functionality
  Enable_Export: true,

  ExpertBases: [
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
      desc: 'DEMO 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '协办单位',
      desc: 'DEMO 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'DEMO 活动的类型。',
    },
  ],


};
