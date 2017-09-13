/**
 * Created by ranyancbuan  on 2017/8/17.
 */
import React from 'react';
import Footer from '../../components/Footers/cie';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'CIEtest 专家库',

  PersonList_PersonLink: personId => `/person/${personId}`,
  PersonList_PersonLink_NewTab: false,

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
  Header_SubTextLogo: 'CIEtest 专家库',
  Header_SubTextStyle: { marginLeft: 12 },
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: <Footer />,
  ShowFooter: true,

  // > Search related
  SearchBarInHeader: false,
  ApplyUserBtn: false, // 是否显示创建新用户btn
  ShowRating: false, // 显示评分
  showMenustatistics: false, // 显示活动统计
  // Functionality
  Enable_Export: true,

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      id: '598bf2a19ed5db236b1062ea',
      name: '中国电子学会专家',
      nperson: 77,
    },

  ],


  // 特殊配置，这里是System的自己的配置

  ShowConfigTab: false,
  SysconfigDefaultCategory: 'activity_type',
  SysConfigTabs: [
    {
      category: 'user_roles',
      label: '用户角色列表',
      desc: 'CIEtest 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '协办单位',
      desc: 'CIEtest 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'CIEtest 活动的类型。',
    },
  ],


};
