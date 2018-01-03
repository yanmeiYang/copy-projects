import React from 'react';
import { Map } from 'immutable';
import loadScriptJs from 'load-script';

// Load script
const scripts = {
  BMap: '/lib/BMap/bmap.js',
  BMap2: 'https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1&services=&t=20171031174121',
  BMapLib: 'https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1',
  GoogleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0',
  d3v3: '/lib/d3.v3.js',
  d3: '/lib/d3.v4.js',
  echarts: '/lib/echarts.js',
};

// deprecated
const Libraries = {
  BMap: [
    <script
      key="bmap0" type="text/javascript"
      src="https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20170713160001" />,

    //    <script
    //    key="bmap1" charSet="utf-8" async defer
    //  src="https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1" />,
  ],
  GoogleMap: [
    <script
      key="googleMap" type="text/javascript" async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0" />,
  ],
  d3v3: [<script key="d3v3" type="text/javascript" src="/lib/d3.v3.js" async defer />],
  d3: [<script key="d3v3" type="text/javascript" src="/lib/d3.v4.js" async defer />],
  echarts: [<script key="echarts" type="text/javascript" src="/lib/echarts.js" async defer />],

};

const findLibs = (keys) => {
  if (keys && keys.length > 0) {
    const libs = {};
    keys.map((key) => {
      libs[key] = Libraries[key];
      return false;
    });
    return libs;
  }
};

// find each key in keys in Libraries, merge into final result.
// if nothing changed, return the original state.
const mergeLibs = (resources, keys) => {
  let changed = false;
  let res = resources || Map();
  if (keys && keys.length > 0) {
    const libs = keys.map((key) => {
      const newRes = Libraries[key];
      if (!res.get(key) && newRes) {
        changed = true;
        return { key, newRes };
      }
      return null;
    });
    if (changed && libs && libs.length > 0) {
      res = res.withMutations((map) => {
        for (const lib of libs) {
          if (lib) {
            map.set(lib.key, lib.newRes);
          }
        }
      });
      return { changed, res };
    }
  }
  return { changed };
};

// TODO non-liner interval check.
const ensureConfig = {
  tryTimes: 200,
  interval: 80,
};

const ensure = (libs, success, failed) => {
  // first check
  if (checkWindow(libs)) {
    if (success) {
      success(...getObjects(libs));
    }
    return;
  }

  // set interval check.
  let n = 0;
  const mapInterval = setInterval(() => {
    // console.log('check...', libs, n);
    if (checkWindow(libs)) {
      clearInterval(mapInterval);
      if (success) {
        success(...getObjects(libs));
      }
      return;
    }
    n += 1;
    if (n === 10) {
      console.warn('Warning! Loading script slow. ', libs);
    }
    if (n >= ensureConfig.tryTimes) {
      clearInterval(mapInterval);
      console.error('Error! Loading script failed. ', libs);
      if (failed) {
        failed();
      }
    }
  }, ensureConfig.interval);
};

const checkWindow = (libs) => {
  let libArray = libs || [];
  if (libs && typeof libs === 'string') {
    libArray = [libs];
  }
  for (const lib of libArray) {
    if (!window[lib]) {
      return false;
    }
  }
  return true;
};

const getObjects = (libs) => {
  let libArray = libs || [];
  if (libs && typeof libs === 'string') {
    libArray = [libs];
  }
  return libArray.map(lib => window[lib]);
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
  loadScript('BMap', 'BMap_loadScriptTime', () => {
    loadScript('BMap2', { check: 'BMap' }, cb);
  });
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

export {
  loadScript,
  loadD3v3,
  loadD3,
  loadECharts,
  loadBMap,
  loadGoogleMap,
  mergeLibs,
  ensure,
};
