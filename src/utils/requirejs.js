import loadScriptJs from 'load-script';

// Load script
const scripts = {
  BMap: 'https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1&services=&t=20171031174121',
  BMapLib: 'https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1',
  // BMap: 'https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1',
  GoogleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0',
  d3v3: '/lib/d3.v3.js',
  d3: '/lib/d3.v4.js',
  echarts: '/lib/echarts.js',
  BMapForECharts: '/lib/echarts-trajectory/bmap.min.js',
};

const createLoader = (check) => {
  return {
    // wait: () => {
    //   const tryTimes = 200;
    //   let n = 0;
    //   const interval = setInterval(() => {
    //     const ret = hasValue(check);
    //     if (!ret) {
    //       n += 1;
    //       if (n >= tryTimes) {
    //         clearInterval(interval);
    //         console.error('Loading script timeout!',);
    //         // if (failed) {
    //         //   failed();
    //         // }
    //       }
    //     } else {
    //       clearInterval(interval);
    //
    //       // if (success) {
    //       //   success(window.BMap);
    //       // }
    //     }
    //   }, interval);
    // },
    then: (callback) => {
      if (callback) {
        callback(0); // call when callback;
      }
    },
  };
};

// usages

// let time1 = new Date();
// const d3 = d3Loader.wait();
// console.log('wait for returned .....', d3);
// onsole.log('>>> TIME: calclate:', new Date() - time1);
//
// d3Loader.then((value) => {
//   console.log('wait for returned .....', value);
// });

const loadScript = (url, opts, cb) => {
  // if cached.
  if (!window.requireJsRegistry) {
    window.requireJsRegistry = {};
  }
  const cachedResult = window.requireJsRegistry[url];
  if (cachedResult) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[RequireJs] Cached ', url, cachedResult);
    }
    if (cb) {
      cb(cachedResult);
    }
    return cachedResult;
  }

  // not cached.
  const { check, ...restOpts } = opts;
  const script = scripts[url] || url;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[RequireJs] load ', url);
  }

  loadScriptJs(script, restOpts, () => {
    const ret = hasValue(check);
    if (ret || !check) {
      window.requireJsRegistry[url] = ret;
      if (cb) {
        cb(ret);
      }
    } else {
      console.error('Error loading script: ', script);
    }
  });
};

const hasValue = (check) => {
  if (typeof check === 'string') {
    return window[check];
  } else if (check && check.length === 1) {
    return window[check[0]];
  } else if (check && check.length === 2) {
    return window[check[0]] && window[check[0]][check[1]];
  } else {
    return false;
  }
};

const loadBMap = (cb) => {
  loadScript('BMapLib', { check: 'BMap' }, cb);
};

const loadBMapForECharts = (cb) => {
  loadScript('BMapForECharts', { check: 'BMap' }, cb);
};

const loadGoogleMap = (cb) => {
  loadScript('GoogleMap', { check: ['google', 'maps'] }, cb);
};

const loadD3v3 = (cb) => {
  loadScript('d3v3', { check: 'd3' }, cb);
};

const loadD3 = (cb) => {
  loadScript('d3', { check: 'd3' }, cb);
};

const loadECharts = (cb) => {
  loadScript('echarts', { check: 'echarts' }, cb);
};

module.exports = {
  loadScript,
  loadD3v3,
  loadD3,
  loadECharts,
  loadBMap,
  loadGoogleMap,
  loadBMapForECharts,
};
