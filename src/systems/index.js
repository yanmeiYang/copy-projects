/**
 * Created by GaoBo on 2017/12/28.
 * Rewrite by GaoBo on 2018/01/04.
 */
import createDefaultSysconfig from 'systems/default-config';
import { loadSavedLocale } from "utils/locale";
import { system } from 'core';

const { System, Source, AvailableSystems } = system;
// TODO umi systems
// const systemConfig = require(`systems/${System}/config`).default;
const systemConfig = require(`systems/current/config`).default;

if (!systemConfig) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`System Error! Config file not found! "systems/${System}/config.js"`);
  } else {
    throw new Error('System config not found!');
  }
}

const sysconfig = {
  ...createDefaultSysconfig(System, Source),
  ...systemConfig,
};

// load & Override language from localStorage.
if (sysconfig.EnableLocalLocale) {
  // TODO SSR read locale from localStorage.
  sysconfig.Locale = loadSavedLocale(System, sysconfig.Locale);
}


// All Configs

let allSystemConfigs; // a cache.

// TODO umi...
const getAllSystemConfigs = () => {
  if (!allSystemConfigs) {
    allSystemConfigs = AvailableSystems && AvailableSystems.map(sys => ({
      ...createDefaultSysconfig(sys, sys),
      // TODO umi systems
      // ...require('systems/' + sys + '/config'),
      ...require('systems/current/config'),
    }));
  }
  return allSystemConfigs;
};

export { sysconfig, getAllSystemConfigs }
