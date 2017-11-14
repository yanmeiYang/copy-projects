/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { toIDDotString, TopExpertBase } from 'utils/expert-base';

import defaults from '../utils';

module.exports = {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: '清华人才办',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowRegisteredRole: false,

  EnableLocalLocale: true,

  UserAuthSystem: 'thurcb', // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  Header_UserPageURL: '/user-info',
  ShowHelpDoc: true,

  Signup_Password: true,

  // google analytics
  googleAnalytics: 'UA-107003102-4',

  // > Search related
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertMap'],

  // Functionality
  Enable_Export: true,
  Search_EnablePin: true,
  // 地图中心点
  CentralPosition: { lat: 37.09024, lng: -95.712891 },

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />全球专家</span>,
      nperson: 2871,
    },
    {
      name: '青年千人',
      id: '577afb029ed5db2cefd14110.58dc96a79ed5db7f4ee661c9.573e6b9876d9113b9d9aaa5d.58b8f04f9ed5dbe5bbb4124c.58cba2509ed5dbd455abcd39',
    },
  ],


  // 特殊配置，这里是System的自己的配置


};
