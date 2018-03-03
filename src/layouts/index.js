import React from 'react';

// i18n things lies here.

// locale, list all locales here.
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { IntlProvider, addLocaleData } from 'react-intl';
import locales from 'locales';
import { sysconfig } from 'systems';

const { SYSTEM, Locale } = sysconfig;

const initIntl = () => {
  // fix intl bugs.
  const areIntlLocalesSupported = require('intl-locales-supported');
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(locales)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      const IntlPolyfill = require('intl');
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl');
  }

  // 由于现在支持的语言比较少，只有en和zh，所以将资源都引入进来，避免下面这样会打包引太多的资源。
  // addLocaleData(require(`react-intl/locale-data/${Locale}`));
  addLocaleData([...en, ...zh]);

  return require(`locales/${Locale}`).default;
};

const messages = initIntl();

const withIntl = (Child) => {
  return React.createElement(IntlProvider,
    { locale: Locale, messages: {} }, // TODO to fix a bug of umi.
    Child,
  );
};


function Layout({ children }) {
  return withIntl(children);
}

export default Layout;
