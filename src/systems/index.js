/**
 * Created by BoGao on 2017/6/20.
 */
import * as alibabaConfig from './alibaba/alibaba-config';
import * as ccfConfig from './ccf/ccf-config';
import * as huaweiConfig from './huawei/huawei-config';
import { config } from '../utils';

// All available systems.
const CurrentSystemConfig = {
  ccf: ccfConfig, // <-- current config files.
  huawei: huaweiConfig,
  alibaba: alibabaConfig,
};

// 默认配置
const defaultSystemConfigs = {
  SYSTEM: config.system,
  PageTitle: 'AminerB',

  Language: 'en', // options [cn|en]
  PreferredLanguage: 'en', // 默认语言

  SearchPagePrefix: 'search',
  ShowSideMenu: true,
  ShowFooter: true,

  // expert base
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  ExpertBases: [], // must override.

  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: '全球专家',

  PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  PersonList_PersonLink_NewTab: true,

  SPECIAL_ExpertMapNoHeader: false,

  //
  // Layout related
  //
  Header_Logo: 'COMMENT: image in /public/{system}/header_logo.png',
  Header_SubTextLogo: '子标题',
  Footer_Content: '',

  IndexPage_QuickSearchList: ['人工智能', '机器人', '数据挖掘', '机器学习', '数据建模', '计算机视觉',
    '计算机网络', '网络', '自然语言处理'],


  // PersonList_ShowIndices: [], // do not override in-component settings.
};

const sysconfig = defaultSystemConfigs;
const currentSystem = CurrentSystemConfig[config.system];
Object.keys(currentSystem).map((key) => {
  sysconfig[key] = currentSystem[key];
  return null;
});

module.exports = { sysconfig };
