/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import Footer from '../../components/Footers/ccf';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'CCF 专家云智库',

  Language: 'cn', // options [cn|en]
  PreferredLanguage: 'cn', // 默认语言

  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: '5949c2f99ed5dbc2147fd854', // CCF会员
  DEFAULT_EXPERT_BASE_NAME: 'CCF会员',

  // Functionality
  Enable_Export: true,

  ExpertBases: [
    {
      id: '5949c2f99ed5dbc2147fd854',
      name: 'CCF会员',
      nperson: 2871,
    },
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
    // 数据标注未找到的人的库。
    // {
    //   id: '58e462db9ed5db3b45bad77e',
    //   name: '杰出会员(D)-2',
    //   nperson: 6,
    // },
    // {
    //   id: '593a6dab9ed5db23ccac5689',
    //   name: '高级会员(S)-2',
    //   nperson: 610,
    // },
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
  Header_LogoWidth: 212,
  Header_LogoStyle: {
    width: '86px',
    backgroundPosition: '8px 2px',
    backgroundSize: ' auto 54px',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
  },
  Header_SubTextLogo: 'CCF 专家库',
  Header_SubTextStyle: { marginLeft: 12 },
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: <Footer />,
  ShowSideMenu: true,
  ShowFooter: true,

  // 特殊配置，这里是System的自己的配置

  CCF_activityTypes: ['专委活动', 'CNCC', 'ADL78', 'CCF@U100(走进高校)', 'YOCSEF', '论坛', '报告会', 'NOI讲座', '分部活动', '精英大会', '女性大会', 'TF',],

  CCF_userPosition: [
    { name: '教授', value: '1' },
    { name: '副教授', value: '2' },
    { name: '助理教授', value: '3' },
    { name: '研究院', value: '4' },
    { name: '博士后', value: '5' },
    { name: '博士生', value: '6' },
    { name: '研究生', value: '7' },
    { name: '其他', value: '8' },
  ],

  ShowConfigTab: false,
  SysconfigDefaultCategory: 'activity_type',
  SysConfigTabs: [
    {
      category: 'user_roles',
      label: '用户角色列表',
      desc: 'CCF 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '活动承办单位',
      desc: 'CCF 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'CCF 活动的类型。',
    },
  ],


};
