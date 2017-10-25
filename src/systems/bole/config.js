/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import defaults from '../utils';
import { GetComments } from './hooks/person-comment-hooks';

import { createRoster } from '../../hooks';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: '伯乐系统',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowRegisteredRole: false,

  Locale: 'zh',

  // UserAuthSystem: 'aminer', // aminer 或者是 system.config; 默认当前系统
  // UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // IndexPage_QuickSearchList:[], // use default.
  IndexPage_InfoBlocks: defaults.EMPTY_BLOCK,

  Header_LogoWidth: 118,
  Header_UserPageURL: '/user-info',
  Header_RightZone: [() => <Link key="0" to="/eb/59a8e5879ed5db1fc4b762ad/-/0/20">我的专家库</Link>], // TODO make this a Component.
  // Header_RightZone: [
  //   () => <a key="0" href="/eb/59a8e5879ed5db1fc4b762ad" target="_blank">我的专家库</a>,
  // ],

  // Footer_Content: '',
  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  // Enable_Export: true,
  // Search_EnablePin: true,

  // > Search related
  SearchBarInHeader: true,
  // HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertBase'], // ExpertBase bole专有
  HeaderSearch_TextNavi: ['ExpertBase', 'ACM_ExpertSearch'],

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
  // PersonList_DidMountHooks: [],
  PersonList_UpdateHooks: [
    param => GetComments(param),
  ],

  Search_CheckEB: true, // Check ExpertBase.

  // 地图中心点
  // CentralPosition: { lat: 37.09024, lng: -95.712891 },

  IndexPage_QuickSearchList: [
    { name: 'Medical Robotics', name_zh: '' },
    { name: 'Surgical Robots', name_zh: '' },
    { name: 'Robot Kinematics', name_zh: '' },
    { name: 'Computer Assisted Surgery', name_zh: '' },
    { name: 'Surgical Navigation', name_zh: '' },
    { name: 'Minimally Invasive Surgery', name_zh: '' },
  ],

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    // {
    //   id: '59a8e5879ed5db1fc4b762ad', // medrob eb id: 599bc0a49ed5db3ea1b61c60
    //   name: '我的专家库',
    //   nperson: 100,
    // },
  ],

  // bole系统独有设置
  ExpertBase: '59a8e5879ed5db1fc4b762ad',

  // bole 智库权限设置 TODO param => xxx
  HOOK: [
    (dispatch, id, email, name, perm) => createRoster(dispatch, id, email, name, perm),
  ],
};
