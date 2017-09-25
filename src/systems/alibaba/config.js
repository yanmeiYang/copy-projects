/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import { toIDDotString, TopExpertBase as EB, TopNUniversity2015 } from 'utils/expert-base';
import defaults from '../utils';

module.exports = {

  //
  // Systems Preference
  //
  EnableLocalLocale: true,
  // MainListSize: 20,

  //
  // Layout related
  //
  PageTitle: '阿里学术资源地图',
  Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 280,
  Header_LogoStyle: {
    width: 150,
    backgroundPosition: '0px -23px',
    backgroundSize: 'auto 100px',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'white',
  },
  Header_SubTextLogo: '学术资源地图',
  Header_SubTextStyle: {},
  Header_UserPageURL: '/user-info', // 用户头像点击之后去的页面.
  Footer_Content: defaults.EMPTY_BLOCK,
  ShowFooter: true,

  //
  // Functionality
  //
  Enable_Export: false,
  ShowRegisteredRole: false, // 注册页面是否显示角色配置

  // SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: false,
  // Search_SortOptions: defaults.IN_APP_DEFAULT,

  // UserAuthSystem: config.system, // aminer 或者是 system.config
  // UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签

  //
  // Page specified config.
  //
  // > PersonList
  // PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  // PersonList_PersonLink_NewTab: true,

  // > Search
  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: 'ALL',

  // > Search related
  // SearchBarInHeader: true,
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertMap'], // use default settings in component.
  // SearchFilterExclude: 'Gender',
  // UniSearch_Tabs: null, //  ['list', 'map', 'relation'], // deprecated! Don't use this.

  // > IndexPage
  // IndexPage_QuickSearchList: ['Artificial intelligence', 'Robotics',
  //   'Data Mining', 'Machine Learning', 'Data Modeling', 'Computer vision',
  //   'Networks', 'Natural language processing'],
  // IndexPage_InfoBlocks: EMPTY_BLOCK,


  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO

  ExpertBases: [
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw" />ALL</span>,
      nperson: 2871,
    },
    /*
    高端科学家
    图灵奖；美国、中国科学院/工程院院士；
    计算机学科全球Top 20大学Full Prof.；TODO 没分出 Full Prof.
    IEEE Fellow, ACM Fellow
    */
    {
      name: '高端科学家',
      id: toIDDotString(
        EB.TuringAward,
        EB.IEEEFellow, EB.ACMFellow,
        EB.CAS, EB.NAS, EB.CAE, EB.NAE,
        TopNUniversity2015(20),
      ),
    },
    /*
    专家人才
    活跃在科研一线，最近三年仍然在学术圈活跃（发文章）并且，H-index>40(35)；// TODO 没做
    全球Top 50大学的Associate Prof.；// TODO 没分出: 全球Top 50大学的Associate Prof.；
    国内千人/长江学者/杰青
    */
    {
      id: toIDDotString(
        EB.JieQing, EB.YouQing,
        TopNUniversity2015(50),
      ),
      name: '一线中青年科学家',
    },
    /*
     明日之星
     1. TR35；CCF青年科学家奖；（TODO 没有） 全球Top 50大学的Assistant Prof.；// TODO 没分出 Associate Prof.；
        国内青年千人；优青；中 H-Index>15 <40 的人。

     2. 从事科研10年之内（第一篇论文），最近三年仍然在学术圈活跃（发文章），H-index>15 ，<40
     */
    {
      id: toIDDotString(
        EB.TR35, EB.QingNianQianRen, EB.YouQing,
        TopNUniversity2015(50),
      ),
      name: '明日之星',
    },
  ],

};
