/* eslint-disable no-param-reassign,prefer-destructuring */
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import { cloneDeep } from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { getLocalToken } from 'utils/auth';

import { apiDomain, nextAPIURL, YQL, CORS, strict } from './config';
import * as debug from './debug';

export default function request(url, options) {
  // 为了兼容之前的调用方法。
  options = options || {};
  options.method = options.method || 'get';
  if (url) {
    options.url = url;
  }
  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest(
      '❯ Request',
      options.method,
      options.url && options.url.replace(apiDomain, ''),
      options,
    );
  }
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (window.location.origin !== origin && apiDomain !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS';
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL';
      } else {
        options.fetchType = 'JSONP';
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response;
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data;
    if (data instanceof Array) {
      data = {
        list: data,
      };
    }
    const result = {
      success: true,
      message: statusText,
      statusCode: status,
      data, // ...data
    };
    if (process.env.NODE_ENV !== 'production') {
      debug.logRequestResult(
        '❯❯ Response:',
        options.method,
        options.url && options.url.replace(apiDomain, ''), '\n>',
        result,
      );
    }

    // this is a fix; if only one query, return result. if many TODO;
    if (data && data.data && data.data) {
      if (data.data.length === 1) {
        result.data = data.data[0];
      } else if (data.data.length > 1) {
        // return as result.
      }
    }

    return Promise.resolve(result);
  }).catch((error) => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText;
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return Promise.reject({ success: false, statusCode, message: msg });
  });
}

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
    body, // This is a fix.
  } = options;

  // translate body back into data:
  if (body) {
    try {
      data = JSON.parse(body);
    } catch (err) {
      console.error('::::::::::::', err);
    }
  }

  const cloneData = cloneDeep(data);

  try {
    let domain = '';
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = url.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      url = url.slice(domain.length);
    }
    const match = pathToRegexp.parse(url);
    url = pathToRegexp.compile(url)(data);
    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + url;

    // process !post mode data.
    let newUrl = '';
    if (options &&
      !(options.method && options.method.toUpperCase() === 'POST')
      && options.data) {
      const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
      const queryString = queryList.join('&');
      newUrl = `${newUrl}?${queryString}`;
    }
    console.log('> TODO 没用的newUrl', newUrl);
  } catch (e) {
    console.error('======================新的错误=======================');
    throw (e.message);
    // message.error(e.message);
  }


  // process headers
  const headers = {};
  if (options && options.specialContentType) {
    headers.Accept = 'application/json';
    // headers.append('Content-Type', 'text/plain');
  } else if (options && (options.data || options.body)) {
    // Fix a bug
    if (options.method && options.method !== 'FETCH') {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';
    }
  }

  const token = (options && options.token) || getLocalToken();
  if (token) {
    headers.Authorization = token;
  }

  // real call

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 16000,
      }, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({ statusText: 'OK', status: 200, data: result });
      });
    });
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`;
    data = null;
  }

  let result;
  switch (method.toLowerCase()) {
    case 'get':
      result = axios.get(url, { params: cloneData, headers });
      break;
    case 'delete':
      result = axios.delete(url, { data: cloneData, headers });
      break;
    case 'post': // ??? is this work?
      result = axios.post(url, cloneData, { headers });
      break;
    case 'put':
      result = axios.put(url, cloneData, { headers });
      break;
    case 'patch':
      result = axios.patch(url, cloneData, { headers });
      break;
    default:
      result = axios(options);
  }
  return result;
};

/**
 * Requests a URL, returning a promise.
 * Request Format：
 * {
 *  "method" :"search",
 *  "parameters":{"a":"c"},
 *  "schema":{"a":"c"}
 *  }
 */
// TODO Support Multiple queries.
export async function nextQuery(payload) {
  if (!payload) {
    console.error('Error! parameters can\'t be null when call nextQuery');
  }
  const { method, ...options } = payload;
  options.method = method || 'post';
  const actions = options.data && options.data.map((query) => query.action);
  const action = actions && actions.join(',');
  const result = request(`${nextAPIURL}?action=${action}`, options);
  return result;

  // method is nextAPI's method.

  const { parameters, schema, RequestMethod } = payload;
  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest('@@next-request ', method, parameters, schema, options);
  }

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (process.env.NODE_ENV !== 'production') {
    // headers.append('Debug', 1);
  }

  const token = (options && options.token) || getLocalToken();
  if (token) {
    headers.append('Authorization', token);
  }

  options.method = RequestMethod || 'POST'; // next api process is always POST.
  options.body = JSON.stringify([{
    method,
    parameters,
    schema,
  }]);

  const newOption = { ...options, headers };
  console.log('============================', newOption);
  const response = await fetch(`${nextAPIURL}?m=${method}`, newOption);
  // checkQueryStatus(response);

  const data = await response.json();

  // error handling
  if (data && data.errs) {
    data.errs.map((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('NEXT-API-ERROR:', err);
      }
      return false;
    });
  }

  console.log('))))))))***', data);
  const ret = (data && data.data && data.data && data.data.length > 0 && data.data[0]) || {};
  console.log('))))))))***', ret);

  // const ret = { data, headers: {} };
  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }
  return ret;
}
