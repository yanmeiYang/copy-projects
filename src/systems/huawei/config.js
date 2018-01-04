/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { toIDDotString, TopExpertBase } from 'utils/expert-base';
import { IndexInfoBox, PersonLabel } from './components';
import defaults from 'core/hole';

export default {

  // 通用配置。所有System的配置文件必须全部包含这部分的值
  PageTitle: 'HUAWEI 知识洞察系统',
  SearchPagePrefix: 'uniSearch', // search, uniSearch
  ShowRegisteredRole: false,
  GLOBAL_ENABLE_FEEDBACK: true, // 是否显示feedback

  EnableLocalLocale: true,

  UserAuthSystem: 'huawei', // aminer 或者是 system.config
  UserAuthSystem_AddSysTagAuto: true, // 登录时自动添加system的标签

  // AI search helper translation/expand/kg
  Search_EnableTranslateSearch: false, // 启用翻译搜索，显示提示信息;/
  Search_DefaultTranslateSearch: false, // 默认使用翻译搜索;
  Search_EnableSmartSuggest: true, // 启用智能提示;  启用后，禁用translateSearch
  Search_SmartSuggest_EnableExpand: true, // TODO
  Search_SmartSuggest_EnableTranslate: true, // TODO
  Search_SmartSuggest_EnableKG: true, // TODO

  Header_UserPageURL: '/user-info',
  ShowHelpDoc: true,

  Signup_Password: true,

  // google analytics
  googleAnalytics: 'UA-107003102-4',

  // > Search related
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertMap', 'Relation', 'TrendPrediction'],

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
      id: toIDDotString(TopExpertBase.ACMFellow),
      name: 'ACM Fellow',
      nperson: 53 + 809,
    },
    {
      id: TopExpertBase.IEEEFellow[0].id,
      name: 'IEEE Fellow', // (2013-2016)
      nperson: 0,
    },
    {
      id: '55ebd8b945cea17ff0c53d5a',
      name: '中国科学院院士',
      nperson: 287,
    },
    {
      id: '5912aa3a9ed5db655182ffde',
      name: '美国科学院外国专家',
      nperson: 287,
    },
    {
      id: '590fcaa59ed5db67cf85a129',
      name: '美国科学院',
      nperson: 2206,
    },
    {
      id: '5923c0829ed5db1600b942db',
      name: '英国皇家科学院－Research Fellows Directory',
      nperson: 976,
    },
    {
      id: '5923bfee9ed5db1600b941f2',
      name: '英国皇家科学院－Fellows Directory',
      nperson: 287,
    },
  ],


  // 特殊配置，这里是System的自己的配置


};
