/* eslint-disable global-require */
/**
 * Created by BoGao on 2017/6/20.
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import { addLocaleData } from 'react-intl';
import { loadSavedLocale } from 'utils/locale';
import { System, Source, AvailableSystems } from 'core/system';
import { TopExpertBase } from 'utils/expert-base';
import defaults from './utils'; // Warning: no zhuo no die.

/***************************************************
 * Systems
 **************************************************/

let defaultSystemConfig;


const getDefaultSystemConfig = () => {
  if (!defaultSystemConfig) {
    defaultSystemConfig = newDefaultSystemConfigs(System, Source);
  }
  return defaultSystemConfig;
};


const generateCurrentSystemConfig = () => {
  console.log('sfadfasdf', System);
  const sys2 = "minimalsys";
  const currentSystem = require(`./${sys2}/config`);
  if (!currentSystem) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`System Error! Config file not found! "systems/${System}/config.js"`);
    } else {
      throw new Error('System config not found!');
    }
  }
  const defaultConfig = getDefaultSystemConfig(System, Source); // don't modify it's value.

  // simple override.
  return { ...defaultConfig, ...currentSystem };
};


// Main

const sysconfig = generateCurrentSystemConfig();

/***************************************************
 * load & Override language from localStorage.
 **************************************************/
if (sysconfig.EnableLocalLocale) {
  sysconfig.Locale = loadSavedLocale(sysconfig.SYSTEM, sysconfig.Locale);
}
addLocaleData('react-intl/locale-data/' + sysconfig.Locale);

export {
  sysconfig,
  getDefaultSystemConfig,
  getAllSystemConfigs,
};
