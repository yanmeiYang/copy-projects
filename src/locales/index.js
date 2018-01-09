const locales = ['en', 'zh'];

const loadSavedLocale = (system, defaultLocale) => {
  const key = `${system}_locale`;
  const savedLocale = localStorage.getItem(key);
  let sl;
  try {
    sl = JSON.parse(savedLocale);
  } catch (e) {
    console.error('Error parse saved locale: ', savedLocale);
  }
  if (sl && locales.indexOf(sl) >= 0) {
    if (sl !== defaultLocale) {
      console.log(
        '%cLoad language settings to [%s]. (original is %s)',
        'color:red;background-color:rgb(255,251,130)',
        sl, defaultLocale,
      );
    }
    return sl;
  } else {
    return defaultLocale;
  }
};

function saveLocale(system, locale) {
  console.log('===-=-=-0=0=0=-0=-0=-0=-',locale );
  if (locale) {
    const key = `${system}_locale`;
    localStorage.setItem(key, JSON.stringify(locale));
  }
}

export default locales;
export {
  loadSavedLocale,
  saveLocale,
};
