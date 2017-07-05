/**
 * Created by BoGao on 2017/6/20.
 */
import * as ccfConfig from './ccf/ccf-config';
import * as huaweiConfig from './huawei/huawei-config';
import { config } from '../utils';

// All available systems.
const CurrentSystemConfig = {
  ccf: ccfConfig, // <-- current config files.
  huawei: huaweiConfig,
}

// 默认配置
const defaultSystemConfigs = {
  PageTitle: 'AminerB',

  Language: 'en', // options [cn|en]
  PreferredLanguage: 'en', // 默认语言

  SearchPagePrefix: 'search',
  SHOW_ExpertBase: true, // 是否需要有按智库的Filter。
  ExpertBases: [], // must override.

  DEFAULT_EXPERT_BASE: 'aminer', // 华为默认搜索
  DEFAULT_EXPERT_BASE_NAME: '全球专家',

  PersonList_PersonLink: personId => `https://cn.aminer.org/profile/-/${personId}`,
  PersonList_PersonLink_NewTab: true,
};

const sysconfig = defaultSystemConfigs;
const currentSystem = CurrentSystemConfig[config.system];
Object.keys(currentSystem).map((key) => {
  sysconfig[key] = currentSystem[key];
  return null;
});

module.exports = { sysconfig };
