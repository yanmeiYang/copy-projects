/**
 * Created by bogao on 2017/8/18.
 */
// Note: can't import any utils. Make sure this file load first.

// 所有可选系统，保留关键字：global.
const AvailableSystems = [
  'aminer',
  'ccf',
  'ccftest',
  'huawei',
  'alibaba',
  'tencent',
  'cie',
  'cipsc',
  'demo',
  'cietest',
  'bole',
  'acmfellow',
  'DataAnnotation',
  'thurcb',
  'yocsef',
  'med_topic_trend',
];

let System;
// System = 'aminer';
System = 'ccf';
// System = 'ccftest';
// System = 'huawei';
// System = 'alibaba';
// System = 'tencent';
// System = 'cie';
// System = 'cipsc';
// System = 'demo';
// System = 'cietest';
// System = 'bole';
// System = 'acmfellow';
// System = 'DataAnnotation';
// System = 'thurcb';
// System = 'yocsef';
// System = 'med_topic_trend';

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
      if (process.env.NODE_ENV !== 'production') {
        console.log('%cSystem Override to [%s]. (original is %s)',
          'color:red;background-color:rgb(255,251,130)',
          ss.system, System);
      }
      System = ss.system;
      Source = ss.system;
    }
  }
}

// Override system settings from localStorage.
loadSavedSystem();

function saveSystem(system, user) {
  if (user) {
    localStorage.setItem(
      SavedSystemKey,
      JSON.stringify({ user: user.email, system }),
    );
  }
}

module.exports = {
  AvailableSystems,
  System,
  Source,
  saveSystem,
  loadSavedSystem,
};
