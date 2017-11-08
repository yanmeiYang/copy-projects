/* eslint-disable no-extend-native */
import classnames from 'classnames';
import loadScriptJs from 'load-script';
import config from './config';
import { getMenusByUser } from './menu';
import request, { nextAPI } from './request';
import apiBuilder from './next-api-builder';
import { color } from './theme';
import * as TopExpertBase from './expert-base';
import * as reflect from './reflect';
import * as system from './system';
import * as hole from './hole';
import { compare } from './compare';

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase();
  });
};

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  }
  return format;
};

const detectSavedMapType = (key) => { //判断该使用什么类型的地图
  key = 'map-dispatch';
  let type = localStorage.getItem(key);
  if (type) {
    if (type === 'google') {
      return 'google';
    } else {
      return 'baidu';
    }
  } else {
    type = navigator.language === 'zh-CN' ? 'baidu' : 'google';
  }
  return type;
};

// 保留小数位
const getTwoDecimal = (text, num) => {
  const decimal = Math.pow(10, num);
  return Math.floor(text * decimal) / decimal;
};

const queryURL = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
};

// Router tool
const createURL = (path, params, newParams) => {
  let url = path;
  const finalParams = { ...params, ...newParams };
  Object.keys(finalParams).map((param) => {
    const value = finalParams[param];
    url = url.replace(`:${param}`, value);
    return false;
  });
  return url;
};

// Load script
const scripts = {
  BMap: 'https://api.map.baidu.com/getscript?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&services=&t=20171031174121',
  BMapLib: 'https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1',
  // BMap: 'https://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&s=1',
  GoogleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0',
};

const loadScript = (url, opts, cb) => {
  const { check, ...restOpts } = opts;
  const value = hasValue(check);
  if (value) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[RequireJs] Cached ', url);
    }
    if (cb) {
      cb(value);
    }
    return;
  }

  const script = scripts[url] || url;

  if (process.env.NODE_ENV !== 'production') {
    console.log('[RequireJs] load ', url);
  }

  loadScriptJs(script, restOpts, () => {
    const ret = hasValue(check);
    if (ret) {
      if (cb) {
        cb(check ? ret : null);
      }
    } else {
      console.error('Error loading script: ', script);
    }
  });
};

const hasValue = (check) => {
  if (typeof check === 'string') {
    return window[check];
  } else {
    if (check.length === 1) {
      return window[check[0]];
    } else if (check.length === 2) {
      return window[check[0]] && window[check[0]][check[1]];
    }
  }
};

module.exports = {
  config,
  system,
  hole,
  classnames,

  // library
  reflect,
  compare,
  createURL,
  detectSavedMapType,
  loadScript,

  getMenusByUser,
  request, nextAPI,
  apiBuilder,

  color,
  queryURL,
  getTwoDecimal,

  TopExpertBase,


};
