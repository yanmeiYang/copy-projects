/* eslint-disable no-extend-native */
import classnames from 'classnames';
import config from './config';
import { getMenusByUser } from './menu';
import request from './request';
import { color } from './theme';
import * as TopExpertBase from './expert-base';
import * as reflect from './reflect';
import * as system from './system';
import * as defaults from './defaults';
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

// 保留小数位
const getTwoDecimal = (text, num) => {
  const decimal = Math.pow(10, num);
  return Math.floor(text * decimal) / decimal;
};

/**
 * @param   {String}
 * @return  {String}
 */

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

// const applyElements = (elements) => {
//   if (elements) {
//   return
//   }
// };

module.exports = {
  config,
  system,
  defaults,

  // menu,
  getMenusByUser,
  request,
  color,
  classnames,
  queryURL,
  getTwoDecimal,

  TopExpertBase,

  // library
  reflect,

  compare,
  createURL,
}
;
