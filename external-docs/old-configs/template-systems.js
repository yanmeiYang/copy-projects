/**
 * Created by GaoBo on 2017/12/28.
 *
 * $$ NOTE $$ ${system}
 */
import systemConfig from 'systems/##{system}##/config';
import createDefaultSysconfig from 'systems/default-config';
// import { loadSavedLocale } from "utils/locale";

if (!systemConfig) {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(`System Error! Config file not found! "systems/##{system}##/config.js"`);
  } else {
    throw new Error('System config not found!');
  }
}
const sysconfig = {
  ...createDefaultSysconfig('##{system}##', '##{system}##'),
  ...systemConfig,
};

// load & Override language from localStorage.
if (sysconfig.EnableLocalLocale) {
  // TODO SSR read locale from localStorge.
  // sysconfig.Locale = loadSavedLocale(sysconfig.SYSTEM, sysconfig.Locale);
}

// themes

export { sysconfig }
