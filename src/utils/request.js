/* eslint-disable no-param-reassign,prefer-destructuring */
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import { cloneDeep } from 'lodash';
import { AES } from 'crypto-js';
import pathToRegexp from 'path-to-regexp';
import { getLocalToken } from 'utils/auth';
import { escapeURLBracket, unescapeURLBracket } from 'utils/strings';
import { apiDomain, nextAPIURL, YQL, CORS, JSONP, strict } from './config';
import * as debug from './debug';


// TODO retrieve final buildings.

export default function request(url, options) {
  // 为了兼容之前的调用方法。
  options = options || {};
  options.method = options.method || 'get';
  if (url) {
    options.url = url;
  }
  // options.url = encodeURI(options.url);

  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest('❯ Request',
      options.method, options.url && options.url.replace(apiDomain, ''), options,
    );
  }
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (window.location.origin !== origin) {
      if (JSONP && JSONP.indexOf(origin) > -1) {
        options.fetchType = 'JSONP';
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL';
      } else {
        options.fetchType = 'CORS';
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response;
    const data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data;
    // if (data instanceof Array) {
    //   data = {
    //     list: data,
    //   };
    // }
    const result = {
      success: true,
      message: statusText,
      statusCode: status,
      data, // ...data
    };
    if (process.env.NODE_ENV !== 'production') {
      debug.logRequestResult('❯❯ Response:',
        options.method, options.url && options.url.replace(apiDomain, ''), '\n>', result,
      );
    }

    if (options.nextapi && data && data.data && data.data.length > 0) {
      // dev: print warn messages.
      for (const d of data.data) {
        if (process.env.NODE_ENV !== 'production' && d.warn) {
          console.warn('API Warning:', d.warn);
        }
      }

      // this is a fix; if only one query, return result. if many TODO;
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

      printNEXTAPIDebugLog(data);

    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return Promise.reject({ success: false, statusCode, message: msg });
  });
}

const printNEXTAPIDebugLog = (data) => {
  if (data.errs && data.errs.length > 0) {
    for (const err of data.errs) {
      console.error('NEXT_API_ERROR: ', err.Error);
      if (err.Details) {
        for (const msg of err.Details) {
          console.log('\t', msg);
        }
      }
    }
  }
};

const fetch = (options) => {
  let {
    method = 'get',
    data = {},
    fetchType,
    url,
    body, // This is a fix.
  } = options;

  // backward-compatibility: translate body back into data:
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
    let escapedUrl = escapeURLBracket(url);
    if (escapedUrl.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = escapedUrl.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      escapedUrl = escapedUrl.slice(domain.length);
    }
    const match = pathToRegexp.parse(escapedUrl);
    escapedUrl = pathToRegexp.compile(escapedUrl)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + unescapeURLBracket(escapedUrl);

    // process !post mode data.
    // let newUrl = '';
    // if (options &&
    //   !(options.method && options.method.toUpperCase() === 'POST')
    //   && options.data) {
    //   const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    //   const queryString = queryList.join('&');
    //   newUrl = `${newUrl}?${queryString}`;
    // }
    // console.log('> TODO 没用的newUrl', newUrl);
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

  // enable debug in next api.
  if (process.env.NODE_ENV !== 'production' && options.nextapi) {
    headers.debug = 1;
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

  // TODO temp: test something:
  if (options.nextapi) {
    const text = JSON.stringify(cloneData);
    const key = '==typeof o?(r=o,o={}):o=o||{}:(r=o,o=a||{},a=void 0))';
    const ciphertext = AES.encrypt(text, key);
    // console.log('crypto:', text);
    // console.log('crypto:', ciphertext.toString());
  }


  let result;
  switch (method.toLowerCase()) {
    case 'get':
      result = axios.get(encodeURI(url), { params: cloneData, headers });
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
export async function nextAPI(payload) {
  if (!payload) {
    console.error('Error! parameters can\'t be null when call nextApi');
  }
  const { method, type, ...options } = payload;
  options.method = method || 'post';
  options.nextapi = true;
  const actions = [];
  if (options.data) {
    for (const query of options.data) {
      actions.push(`${query.action}+${query.eventName}`);
      delete query.eventName;
    }
  }
  // const actions = options.data && options.data.map(query => `${query.action}+${query.eventName}`);
  const actionName = actions && actions.join(',');

  const url = `${nextAPIURL}/${type || 'query'}?a=${actionName}`;
  const result = request(url, options);
  return result;
}

export async function wget(url) {
  const token = getLocalToken();
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', token);
  }
  const options = { url, headers };
  const data = await fetch(options);
  if (data && data.status >= 200 && data.status < 300) {
    return data.data;
  } else if (data.data) {
    return data.data;
  } else {
    throw new Error(`WGET Error: ${data.status}: ${data.statusText}`);
  }
}
