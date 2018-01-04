const locales = ['en', 'zh'];

// TODO move to
const loadSavedLocale = (system, defaultLocale) => {
  const key = `${system}_locale`;
  const savedLocale = localStorage.getItem(key);
  const sl = JSON.parse(savedLocale);
  if (sl && locales.indexOf(sl) >= 0) {
    if (sl !== defaultLocale) {
      // if (process.env.NODE_ENV !== 'production') {
      console.log(
        '%cLoad language settings to [%s]. (original is %s)',
        'color:red;background-color:rgb(255,251,130)',
        sl, defaultLocale,
      );
      // }
    }
    return sl;
  } else {
    return defaultLocale;
  }
};

function saveLocale(system, locale) {
  const key = `${system}_locale`;
  localStorage.setItem(key, JSON.stringify(locale));
}

export {
  loadSavedLocale,
  saveLocale,
};
