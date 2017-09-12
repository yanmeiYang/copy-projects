/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { Link } from 'dva/router';
import defaults from '../utils';
import { AddToEBButton, PersonRemoveButton, PersonComment } from './components';
import { GetComments } from './person-comment-hooks';

import { createRoster } from '../../hooks';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: '伯乐系统',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowSideMenu: false,
  ShowRegisteredRole: false,

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_SubTextLogo: '伯乐系统',
  Header_SubTextStyle: { width: 90, left: -54, marginLeft: -80 },
  // Header_LogoStyle: {
  //   top: '-10px',
  //   width: '60px',
  //   height: '36px',
  //   backgroundSize: 'auto 56px',
  //   backgroundPosition: '0px -10px',
  // },
  Header_LogoWidth: 118,
  Header_UserPageURL: '/user-info',
  Header_RightZone: [() => <Link key="0" to="/eb/59a8e5879ed5db1fc4b762ad">我的专家库</Link>], // TODO make this a Component.

  // Footer_Content: '',
  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  // Enable_Export: true,
  // Search_EnablePin: true,

  // > Search related
  SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertBase'], // ExpertBase bole专有
  // SearchFilterExclude: 'Gender',
  // UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  /**
   * Page specified config.
   */

  /**
   * PersonList
   */
  // PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  // PersonList_PersonLink_NewTab: true,
  // param: [person, eb{id,name}]
  PersonList_TitleRightBlock:
    param => (
      <AddToEBButton
        person={param.person} key="2"
        expertBaseId={param.expertBaseId}
        targetExpertBase="59a8e5879ed5db1fc4b762ad"
      />),

  PersonList_RightZone: defaults.EMPTY_BLOCK_FUNC_LIST,
  PersonList_BottomZone: [
    param => (
      <PersonComment
        person={param.person} user={param.user} key="1"
        ExpertBase="59a8e5879ed5db1fc4b762ad"
      />),
  ],
  // PersonList_DidMountHooks: [],
  PersonList_UpdateHooks: [
    param => GetComments(param),
  ],

  Search_CheckEB: true, // Check ExpertBase.

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  IndexPage_QuickSearchList: ['Medical Robotics', 'Surgical Robots', 'Robot Kinematics',
    'Computer Assisted Surgery', 'Surgical Navigation', 'Minimally Invasive Surgery'],

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      id: '59a8e5879ed5db1fc4b762ad', // medrob eb id: 599bc0a49ed5db3ea1b61c60
      name: '我的专家库',
      nperson: 100,
    },
  ],

  // bole系统独有设置
  ExpertBase: '59a8e5879ed5db1fc4b762ad',

  // bole 智库权限设置
  HOOK: [
    (dispatch, id, email, name, perm) => createRoster(dispatch, id, email, name, perm),
  ],
};
