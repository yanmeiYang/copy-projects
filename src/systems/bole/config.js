/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import defaults from '../utils';
import { PersonRightButton } from './components';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'Bo Le',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowSideMenu: false,
  ShowRegisteredRole: false,

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_SubTextLogo: 'Bo Le',
  Header_SubTextStyle: { width: 168 },
  // Header_LogoStyle: {
  //   top: '-10px',
  //   width: '60px',
  //   height: '36px',
  //   backgroundSize: 'auto 56px',
  //   backgroundPosition: '0px -10px',
  // },
  Header_LogoWidth: 276,
  Header_UserPageURL: '/user-info',
  // Footer_Content: '',
  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: true,
  // Search_EnablePin: true,

  // > Search related
  SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertBase'], // ExpertBase bole专有
  // SearchFilterExclude: 'Gender',
  // UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.


  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },
  // Person_PersonLabelBlock: defaults.EMPTY_BLOCK,

  IndexPage_QuickSearchList: ['Medical Robotics', 'Surgical Robots', 'Robot Kinematics',
    'Computer Assisted Surgery', 'Surgical Navigation', 'Minimally Invasive Surgery'],
  Person_PersonRightButton: person => <PersonRightButton person={person} ExpertBase="59a8e5879ed5db1fc4b762ad" />,
  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      id: '599bc0a49ed5db3ea1b61c60',
      name: 'bo le',
      nperson: 50,
    },

  ],
  // bole系统独有设置

  ExpertBase: '59a8e5879ed5db1fc4b762ad',
};
