/**
 * Created by BoGao on 2017/6/20.
 */
import React from 'react';
import Footer from '../../components/Footers/ccf';
import { ExpertBaseID2NameMap } from 'utils/expert-base';

module.exports = {
  /**
   * Systems Preference
   */
  Locale: 'zh',
  // EnableLocalLocale: false,
  // MainListSize: 20,

  /**
   * Layout related
   */
  Layout_HasSideBar: true, // 是否显示左侧菜单
  Layout_HasNavigator: false,

  PageTitle: 'CCF 专家库',
  // Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_LogoWidth: 213,
  Header_UserPageURL: '', // 用户头像点击之后去的页面.
  Footer_Content: <Footer/>,

  /**
   * Functionality
   */
  Enable_Export: true,
  ShowRegisteredRole: true, // 注册页面是否显示角色配置
  // Signup_Password: false, // 注册页面password

  // SearchPagePrefix: 'uniSearch', // search - 普通搜索(deleted); uniSearch - 多合一搜索.
  // Search_EnablePin: false, // TODO bad：Huawei PIN
  Search_EnableCCFPin: true, // TODO bad：CCF PIN
  Search_EnableTranslateSearch: true, // 启用翻译搜索，显示提示信息;
  Search_DefaultTranslateSearch: true, // 默认不使用翻译搜索;

  Search_EnableKnowledgeGraphHelper: false,
  // Search_SortOptions: defaults.IN_APP_DEFAULT,

  // UserAuthSystem: System, // aminer 或者是 system.config
  // UserAuthSystem_AddSysTagAuto: false, // 登录时自动添加system的标签, 目前没用到

  // Auth_AllowAnonymousAccess: false,
  // Auth_LoginPage: '/login',

  // NextAPI-QueryHooks: // TODO should not enabled.
  APIPlugin_ExpertSearch: {
    // parameters: {
    //   aggregation: ['dims.systag'],
    //   haves: { systag: [] },
    // },
  },

  // /////////////////////////////////

  Search_SortOptions: ['relevance', 'h_index',
    'activity', 'rising_star', 'activity-ranking-contrib'],

  PersonList_PersonLink: personId => `/person/${personId}`,
  PersonList_PersonLink_NewTab: false,

  IndexPage_QuickSearchList: [
    { name: '', name_zh: '人工智能' },
    { name: '', name_zh: '机器人' },
    { name: '', name_zh: '数据挖掘' },
    { name: '', name_zh: '机器学习' },
    { name: '', name_zh: '数据建模' },
    { name: '', name_zh: '计算机视觉' },
    { name: '', name_zh: '计算机网络' },
    { name: '', name_zh: '网络' },
    { name: '', name_zh: '自然语言处理' },
  ],

  PersonList_ShowIndices: ['activityRankingContrib', 'h_index', 'activity', 'rising_star'],

  // > Admin Users
  Admin_Users_ShowAdmin: false,

  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  DEFAULT_EXPERT_BASE: '5949c2f99ed5dbc2147fd854', // CCF会员
  DEFAULT_EXPERT_BASE_NAME: 'CCF会员',
  DEFAULT_EXPERT_SEARCH_KEY: 'term',
  ExpertBases: [
    {
      id: '5949c2f99ed5dbc2147fd854',
      name: 'CCF会员',
      nperson: 2871,
    },
    {
      id: '592f8af69ed5db8bb68d713b',
      name: '会士(F)',
      nperson: 79,
    },
    {
      id: '58ddbc229ed5db001ceac2a4',
      name: '杰出会员(D)',
      nperson: 182,
    },
    {
      id: '592f6d219ed5dbf59c1b76d4',
      name: '高级会员(S)',
      nperson: 2246,
    },
    {
      id: 'aminer',
      name: <span><i className="fa fa-globe fa-fw"/>全球专家</span>,
      nperson: 2871,
    },
    // 数据标注未找到的人的库。
    // {
    //   id: '58e462db9ed5db3b45bad77e',
    //   name: '杰出会员(D)-2',
    //   nperson: 6,
    // },
    // {
    //   id: '593a6dab9ed5db23ccac5689',
    //   name: '高级会员(S)-2',
    //   nperson: 610,
    // },
  ],
  ExpertBases_ID2NameMap: {
    // '5949c2f99ed5dbc2147fd854':'CCF会员'
    '592f8af69ed5db8bb68d713b': '会士',
    '58ddbc229ed5db001ceac2a4': '杰出会员',
    '592f6d219ed5dbf59c1b76d4': '高级会员',
  },
  // 特殊配置，这里是System的自己的配置

  CCF_activityTypes: ['专委活动', 'CNCC', 'ADL78', 'CCF@U100(走进高校)', 'YOCSEF', '论坛', '报告会', 'NOI讲座', '分部活动', '精英大会', '女性大会', 'TF',],

  CCF_userPosition: [
    { name: '教授', value: '1' },
    { name: '副教授', value: '2' },
    { name: '助理教授', value: '3' },
    { name: '研究院', value: '4' },
    { name: '博士后', value: '5' },
    { name: '博士生', value: '6' },
    { name: '研究生', value: '7' },
    { name: '其他', value: '8' },
  ],
  ApplyUserBtn: true,
  ShowConfigTab: false,
  SysconfigDefaultCategory: 'activity_type',
  SysConfigTabs: [
    {
      category: 'user_roles',
      label: '用户角色列表',
      desc: 'CCF 用户角色列表',
    },
    {
      category: 'activity_organizer_options',
      label: '协办单位',
      desc: 'CCF 活动的承办单位，包括专委/分部/项目等。',
    },
    {
      category: 'activity_type',
      label: '活动类型',
      desc: 'CCF 活动的类型。',
    },
  ],

  // 临时属性，需要删除
  USE_NEXT_EXPERT_BASE_SEARCH: true,
  // 测试修改活动是否使用新的编辑
  SeminarNewEditor: false,
  // ccf activity 专家评分是否显示
  ShowRating: true,
};
