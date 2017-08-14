/**
 * Created by ranyanchuan on 2017/8/11.
 */
import React from 'react';
import { toIDDotString, TopExpertBase } from '../../utils/expert-base';

module.exports = {

  PageTitle: '专家库',

  Language: 'cn', // options [cn|en]
  PreferredLanguage: 'cn', // 默认语言

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
