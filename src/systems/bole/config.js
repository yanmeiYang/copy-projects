/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import defaults from '../utils';
import { GetComments, FetchPersonLabels } from './hooks';

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

  Header_UserPageURL: '/user-info',
  // Footer_Content: '',
  // ShowHelpDoc: true,

  // Functionality
  Enable_Export: false,
  // Enable_Export: true,
  // Search_EnablePin: true,

  // google analytics
  googleAnalytics: 'UA-107003102-5',

  /**
   * > Search
   */
  // expert base

  // > Search related
  HeaderSearch_TextNavi: ['ExpertBase', 'ACM_ExpertSearch', 'ExpertMap'],

  // Search_DisableFilter: false,
  Search_DisableExpertBaseFilter: true,
  // Search_DisableSearchKnowledge: false,
  Search_FixedExpertBase: { id: 'aminer', name: '全球专家' },

  /**
   * Page specified config.
   */

  /**
   * PersonList
   */
  // PersonList_DidMountHooks: [],
  PersonList_UpdateHooks: [
    param => GetComments(param),
    param => FetchPersonLabels(param),
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

  Map_Preload: 0, // 0的时候不缓存，1的时候缓存信息，2的时候缓存信息和90头像，3的时候缓存信息和90、160头像
  Map_HotDomains: [
    { id: '59a8e5879ed5db1fc4b762ad', name: '我的专家库' },
    { id: 'aminer', name: '全球专家' },
  ], // 地图领域
  Map_HotDomainsLabel: '',
  Map_FilterRange: false,

  // bole系统独有设置
  ExpertBase: '59a8e5879ed5db1fc4b762ad',

};
