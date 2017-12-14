/**
 * Created by bogao on 2017/8/18.
 */
// Note: can't import any utils. Make sure this file load first.

// 所有可选系统，保留关键字：global.
const AvailableSystems = [
  'aminer',
  'demo',
  'DataAnnotation',
  'alibaba',
  'acmfellow',
  'bole',
  'ccf',
  'ccftest',
  'cie',
  'cietest',
  'cipsc',
  'huawei',
  'med_topic_trend',
  'scei', // 中国科协：深度智库
  'tencent',
  'thurcb',
  'yocsef',
];

let System;
System = 'aminer';
// System = 'demo';
// System = 'DataAnnotation';

// System = 'ccf';
// System = 'ccftest';
// System = 'huawei';
// System = 'alibaba';
// System = 'acmfellow';
// System = 'tencent';
// System = 'cie';
// System = 'cietest';
// System = 'cipsc';
// System = 'huawei';
// System = 'med_topic_trend';
// System = 'scei';
// System = 'tencent';
// System = 'thurcb';
// System = 'yocsef';


// SPECIAL: USED_IN_ONLINE_DEPLOY; DON'T DELETE THIS LINE.

let Source = System; // AppID, Used in UniversalConfig.

const SavedSystemKey = 'IJFEOVSLKDFJ';
const LS_USER_KEY = `user_${System}`;

function loadSavedSystem() {
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

      console.log(
        '%cSystem Override to [%s]. (original is %s)',
        'color:red;background-color:rgb(255,251,130)',
        ss.system, System,
      );
      System = ss.system;
      Source = ss.system;
    }
  }
}

function saveSystem(system, user) {
  if (user) {
    localStorage.setItem(
      SavedSystemKey,
      JSON.stringify({ user: user.email, system }),
    );
  }
}

// Override system settings from localStorage.
// 只有开发环境或者线上的demo系统可以切换。
if (process.env.NODE_ENV !== 'production' || System === 'demo') {
  loadSavedSystem();
}

module.exports = {
  AvailableSystems,
  System,
  Source,
  saveSystem,
  loadSavedSystem,
};
