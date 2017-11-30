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
  Header_UserPageURL: '/user-info', // 用户头像点击之后去的页面.
  Footer_Content: defaults.EMPTY_BLOCK,

  // google analytics
  googleAnalytics: 'UA-107003102-3',

  //
  // Functionality
  //
  Enable_Export: true,
  ShowRegisteredRole: false, // 注册页面是否显示角色配置
  UserInfo_Batch_Signup: true,

  // SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  Search_EnablePin: false,
  Search_EnableKnowledgeGraphHelper: false,
  Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;
  Search_DefaultTranslateSearch: true, // 默认使用翻译搜索;

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
  HeaderSearch_TextNavi: ['ExpertSearch', 'ExpertMap'], // use default settings in component.

  // > IndexPage
  // IndexPage_QuickSearchList: ['Artificial intelligence', 'Robotics',
  //   'Data Mining', 'Machine Learning', 'Data Modeling', 'Computer vision',
  //   'Networks', 'Natural language processing'],

  IndexPage_QuickSearchList: [
    { id: '57a57c640a3ac5e5b97e6f9b', name: 'Data Mining', name_zh: '数据挖掘' },
    { id: '57a57c640a3ac5e5b97e6f9c', name: 'Database', name_zh: '数据库' },
    { id: '57a57c5f0a3ac5e5b97e6f90', name: 'Theory', name_zh: '原理' },
    { id: '57a57c620a3ac5e5b97e6f96', name: 'Multimedia', name_zh: '多媒体' },
    { id: '57a57c650a3ac5e5b97e6f9e', name: 'Security', name_zh: '安全' },
    { id: '57a57c610a3ac5e5b97e6f93', name: 'System', name_zh: '系统' },
    { id: '57a57c640a3ac5e5b97e6f9a', name: 'Machine Learning', name_zh: '机器学习' },
    { id: '57a57c630a3ac5e5b97e6f99', name: 'Artificial Intelligence', name_zh: '人工智能' },
    { id: '580460fa41928c416c374145', name: 'Software Engineering', name_zh: '软件工程' },
    { id: '57a57c600a3ac5e5b97e6f92', name: 'Computer Networking', name_zh: '计算机网络' },
    { id: '57a57c620a3ac5e5b97e6f95', name: 'Natural Language Processing', name_zh: '自然语言处理' },
    { id: '57a57c620a3ac5e5b97e6f97', name: 'Human-Computer Interaction', name_zh: '人机交互' },
    { id: '57a57c630a3ac5e5b97e6f98', name: 'Computer Graphics', name_zh: '计算机图形学' },
    { id: '57a57c660a3ac5e5b97e6f9f', name: 'Computer Vision', name_zh: '计算机视觉' },
    { id: '587834730a3ac5b5de65f60d', name: 'Web and Information Retrieval', name_zh: '网络和信息检索' },

  ],
  // IndexPage_InfoBlocks: EMPTY_BLOCK,
  Map_HotDomains: EB.RandomTop100InDomain, //地图领域

  // PersonList_ShowIndices: [], // do not override in-component settings. // TODO

  ExpertBases: [
    { id: 'aminer', name: <span><i className="fa fa-globe fa-fw" />ALL</span> },
    { name: '高端科学家', id: '59ffe21c9ed5db93537362f3' },
    { name: '一线中青年科学家', id: '5a0539af9ed5db5b4c4ed2a1' },
    { name: '明日之星', id: '5a05413d9ed5db5b4c4f14a1' },
  ],


  ExpertBasesxxxx: [
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
