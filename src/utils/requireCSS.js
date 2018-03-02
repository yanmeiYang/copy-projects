/*
Shaw Joe
2018-02-10 19:53
 */

const loadStyleSheet = (url) => {
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = url;
  sheet.type = 'text/css';
  document.head.appendChild(sheet);
  let timer;

  // TODO: handle failure
  return new Promise((resolve) => {
    sheet.onload = resolve;
    sheet.addEventListener('load', resolve);
    sheet.onreadystatechange = () => {
      if (sheet.readyState === 'loaded' || sheet.readyState === 'complete') {
        resolve();
      }
    };

    timer = setInterval(() => {
      for (let i = 0; i < document.styleSheets.length; i += 1) {
        if (document.styleSheets[i].href === sheet.href) resolve();
      }
    }, 250);
  }).then(() => {
    clearInterval(timer);
    return sheet;
  });
};

module.exports = {
  loadStyleSheet,
};
