/**
 * Created by GaoBo on 2017/12/28.
 *
 * !!! This is generated automatically, don't modify !!!  ${system}
 */
import systemConfig from 'systems/minimalsys/config';
import createDefaultSysconfig from 'systems/default-config';
// import { loadSavedLocale } from "utils/locale";

if (!systemConfig) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`System Error! Config file not found! "systems/minimalsys/config.js"`);
  } else {
    throw new Error('System config not found!');
  }
}
const sysconfig = {
  ...createDefaultSysconfig('minimalsys', 'minimalsys'),
  ...systemConfig,
};

// load & Override language from localStorage.
if (sysconfig.EnableLocalLocale) {
  // TODO SSR read locale from localStorge.
  // sysconfig.Locale = loadSavedLocale(sysconfig.SYSTEM, sysconfig.Locale);
}

// themes

export { sysconfig }
