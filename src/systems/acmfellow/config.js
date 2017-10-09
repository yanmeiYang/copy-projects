/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import defaults from '../utils';
import { AddToEBButton, PersonRemoveButton, PersonComment } from './components';
import { GetComments } from './person-comment-hooks';
import * as Const from './const-acmfellow';

import { createRoster } from '../../hooks';

module.exports = {

  Use_CDN: false,

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'ACM Fellow',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
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
  Header_RightZone: [() => <Link key="0" to={`/eb/${Const.ExpertBase}/-/0/20`}>我的专家库</Link>], // TODO make this a Component.

  // Footer_Content: '',
  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  // Enable_Export: true,
  Search_EnablePin: true,

  // > Search related
  SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ACMFellowExpertBase', 'ACM_ExpertSearch'],
  // HeaderSearch_TextNavi: [],

  // Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: true,
  // Search_DisableSearchKnowledge: false,
  Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },
  DEFAULT_EXPERT_SEARCH_KEY: 'name',

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
    ({ param }) => (
      <AddToEBButton
        person={param.person} key="2"
        expertBaseId={param.expertBaseId}
        targetExpertBase={Const.ExpertBase}
      />),

  PersonList_RightZone: defaults.EMPTY_BLOCK_FUNC_LIST,
  PersonList_BottomZone: [
    param => (
      <PersonComment
        person={param.person} user={param.user} key="1"
        ExpertBase={Const.ExpertBase}
      />),
  ],
  // PersonList_DidMountHooks: [],
  PersonList_UpdateHooks: [
    param => GetComments(param),
  ],

  Search_CheckEB: true, // Check ExpertBase.

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  // TODO: use default.
  // IndexPage_QuickSearchList: [
  //   { name: 'Medical Robotics', name_zh: '' },
  //   { name: 'Surgical Robots', name_zh: '' },
  //   { name: 'Robot Kinematics', name_zh: '' },
  //   { name: 'Computer Assisted Surgery', name_zh: '' },
  //   { name: 'Surgical Navigation', name_zh: '' },
  //   { name: 'Minimally Invasive Surgery', name_zh: '' },
  // ],

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
  ],

  // acmfellow 系统
  ExpertBase: Const.ExpertBase,

  // bole 智库权限设置 TODO param => xxx
  // HOOK: [
  //   (dispatch, id, email, name, perm) => createRoster(dispatch, id, email, name, perm),
  // ],
};
