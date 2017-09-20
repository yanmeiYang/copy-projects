/**
 * Created by bogao on 2017/8/18.
 */
// Note: can't import any utils. Make sure this file load first.

// 所有可选系统
const AvailableSystems = [
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
];

let System;
// System = 'ccf';
// System = 'ccftest';
System = 'huawei';
// System = 'alibaba';
//System = 'tencent';
// System = 'cie';
// System = 'cipsc';
// System = 'demo';
// System = 'cietest';
// System = 'bole';

let Source = System; // AppID, Used in UniversalConfig.

const SavedSystemKey = 'IJFEOVSLKDFJ';

function loadSavedSystem() {
  const savedSystem = localStorage.getItem(SavedSystemKey);
  const ss = JSON.parse(savedSystem);
  if (!ss) {
    return;
  }
  // validate auth
  const USER_LOCAL_KEY = 'user';
  const data = localStorage.getItem(USER_LOCAL_KEY);
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
  localStorage.setItem(SavedSystemKey,
    JSON.stringify({ user: user.email, system }));
}

module.exports = {
  AvailableSystems,
  System,
  Source,
  saveSystem,
  loadSavedSystem,
};
