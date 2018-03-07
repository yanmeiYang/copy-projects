/* eslint-disable global-require */

/**
 * Created by bogao on 2017/8/18.
 *
 * Note:
 *   This file is also run in node environment.
 *   Can't import any utils. Make sure this file load first.
 */
// 所有可选系统，保留关键字：global.
const AvailableSystems = [
  // 'aminer',
  'cgs', // 中国图学会
  'demo',
  // 'data_annotation',
  // 'alibaba',
  // 'acmfellow',
  // 'bole',
  // 'ccf',
  // 'ccftest',
  // 'cie',
  // 'cietest',
  // 'cipsc',
  // 'huawei',
  'nsfcai',
  // 'med_topic_trend',
  // 'minimalsys', // 用来调试的最小system集合
  // 'scei', // 中国科协：深度智库
  // 'tencent',
  // 'thurcb',
  // 'yocsef',
  // 'reco',
];

let System = '';
try {
  // TODO here is a warning if file doesn't exist.
  const { system } = require('../system-config');
  System = system;
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line function-paren-newline function-paren-newline
    const msg = '%cSystem Override to [%s] using OVERRIDE. (original is %s)';
    const style = 'color:white;background-color:orange;padding:1px 4px;';
    console.log(msg, style, system, System);
  }
} catch (err) {
  const msg = '%cWarning! No System Override found. use system[%s]';
  const style = 'color:white;background-color:orange;padding:1px 4px;';
  console.log(msg, style, System);
}
// check available
if (AvailableSystems.indexOf(System) < 0) {
  if (process.env.NODE_ENV !== 'production') {
    const msg = '%cSystem [%s] is invalid, available:%v';
    const style = 'color:white;background-color:orange;padding:1px 4px;';
    console.log(msg, style, System, AvailableSystems);
  }
  throw new Error('System [%s] is invalid! Please check your code.');
}

let Source = System; // AppID, Used in UniversalConfig.

const SavedSystemKey = 'IJFEOVSLKDFJ';
const LS_USER_KEY = `user_${System}`;

function loadSavedSystem() {
  // 非浏览器环境直接退出
  if (typeof window === 'undefined') {
    return;
  }

  const savedSystem = localStorage.getItem(SavedSystemKey);
  const ss = JSON.parse(savedSystem);
  if (!ss) {
    return;
  }
  // validate auth
  const data = localStorage.getItem(LS_USER_KEY);
  if (data) {
    const dataObj = JSON.parse(data);
    // console.log('userInSession', dataObj);
    // only god can switch system.
    if (dataObj && dataObj.roles && dataObj.roles.god
      && dataObj.data && dataObj.data.email === ss.user) {
      const msg = '%cSystem Override to [%s]. (original is %s)';
      const style = 'color:red;background-color:rgb(255,251,130);padding:1px 4px;';
      console.log(msg, style, ss.system, System);

      System = ss.system;
      Source = ss.system;
    }
  }
}

function saveSystem(system, user) {
  if (user) {
    localStorage.setItem(SavedSystemKey, JSON.stringify({ user: user.email, system }));
  }
}

// Override system settings from localStorage.
// 只有开发环境或者线上的demo系统可以切换。
if (process.env.NODE_ENV !== 'production' || System === 'demo') {
  loadSavedSystem();
}

export {
  AvailableSystems,
  System,
  Source,
  saveSystem,
  loadSavedSystem,
};
