/* eslint-disable no-extend-native */
import classnames from 'classnames';
import * as config from './config';
import { getMenusByUser } from './menu';
import request, { nextAPI, wget } from './request';
import apiBuilder from './next-api-builder';
import { color } from './theme';
import * as reflect from './reflect';
import { compare } from './compare';
import {
  loadD3,
  loadD3v3,
  loadScript,
  loadECharts,
  loadBMap,
  loadGoogleMap,
  ensure,
} from './requirejs';

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

export {
  config,
  classnames,

  // library
  reflect,
  compare,
  createURL,
  detectSavedMapType,

  getMenusByUser,
  request, nextAPI, wget,
  apiBuilder,
  loadD3, loadD3v3, loadScript, loadECharts, loadBMap, loadGoogleMap,
  ensure,
  color,
  queryURL,
  getTwoDecimal,
};
