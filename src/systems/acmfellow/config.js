/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import AddToEBButton from 'routes/expert-base/AddToEBButton';
import { authenticateExpertBase } from 'hooks';
import defaults from '../utils';
import { PersonComment } from './components';
import { GetComments } from './person-comment-hooks';

const ExpertBase = '59d7bb7e9ed5dbe450e6b275';

module.exports = {

  Use_CDN: true,
  EnableLocalLocale: true,

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'ACM Fellow',
  SearchPagePrefix: 'uniSearch', // search, uniSearch

  /**
   * Replace Hooks.
   */
  ShowRegisteredRole: false,
  Register_AddPrivilegesToExpertBaseIDs: [ExpertBase],

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_SubTextLogo: '伯乐系统',
  Header_SubTextStyle: { width: 90, left: -54, marginLeft: -80 },
  Header_LogoWidth: 118,
  Header_UserPageURL: '/user-info',

  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: true,
  Search_EnablePin: true,

  // > Search related
  SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ACMFellowExpertBase', 'ACM_ExpertSearch'],
  // HeaderSearch_TextNavi: [],

  // Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: true,
  // Search_DisableSearchKnowledge: false,
  Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },
  // DEFAULT_EXPERT_SEARCH_KEY: 'name', // default is term

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
  PersonList_AfterTitleBlock:
    ({ param }) => (
      <div key="2">
        <AddToEBButton
          person={param.person}
          expertBaseId={param.expertBaseId}
          targetExpertBase={ExpertBase}
        />
      </div>),

  PersonList_RightZone: defaults.EMPTY_BLOCK_FUNC_LIST,

  // PersonList_BottomZone: [
  //   param => (
  //     <PersonComment
  //       person={param.person} user={param.user} key="1"
  //       ExpertBase={ExpertBase}
  //     />),
  // ],

  // PersonList_DidMountHooks: [],

  // PersonList_UpdateHooks: [
  //   param => GetComments(param),
  // ],

  // 智库权限设置 TODO param => xxx
  // RegisterUserHooks: [
  //   (dispatch, id, email, name, perm) => authenticateExpertBase(dispatch, id, email, name, perm),
  // ],

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
  ExpertBase,


};
