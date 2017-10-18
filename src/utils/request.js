/**
 * Created by yutao on 2017/5/25.
 */
import fetch from 'dva/fetch';
import { baseURL, nextAPIURL } from './config';
import * as auth from './auth';
import * as debug from './debug';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // TODO move out, don't process auth here.
  if (response.status === 401) {
    // console.log('xxxxxxxxxx', response);
    // throw error;
    // auth.removeLocalAuth();
    // location.href = '/';
  }

  if (response.status >= 404 && response.statusText === 'Not Found') {
    throw error;
  }

  // Special case: for knowledge graph, query not found will return
  // {"status":false,"message":"data.not_found"} // code 404

  const error = new Error(response.statusText);
  error.response = response;
  // try {
  //   throw error;
  // } catch (e) {
  //   console.error('---- Catch Error: ---- ', e);
  // }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} withToken True if request with token.
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest('@@request ', url, options);
  }

  let base = baseURL;
  if (options && options.baseURL !== undefined) {
    base = options.baseURL;
  }
  let newUrl = base + url;

  // process !post mode data.
  if (options &&
    !(options.method && options.method.toUpperCase() === 'POST')
    && options.data) {
    const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    const queryString = queryList.join('&');
    newUrl = `${newUrl}?${queryString}`;
  }

  const headers = new Headers();
  if (options && options.specialContentType) {
    headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'text/plain');
  } else if (options && (options.data || options.body)) {
    // Fix a bug
    if (options.method && options.method !== 'FETCH') {
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
    }
  }

  const token = (options && options.token) || localStorage.getItem('token');
  if (token) {
    headers.append('Authorization', token);
  }

  const newOption = { ...options, headers };
  const response = await fetch(newUrl, newOption);

  checkStatus(response);

  const data = await response.json();

  const ret = { data, headers: {} };
  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }
  return ret;
}

// TODO merge to request, use options.baseURL instead.
export async function externalRequest(url, options) {
  let newUrl = url;
  if (options && !(options.method && options.method.toUpperCase() === 'POST') && options.data) {
    const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    const queryString = queryList.join('&');
    newUrl = `${newUrl}?${queryString}`;
  }
  const headers = new Headers();

  if (options) {
    if (options.data || options.body) {
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
    }
  }
  const newOption = { ...options, headers };
  const response = await fetch(newUrl, newOption);
  checkStatus(response);
  const data = await response.json();
  const ret = {
    data,
    headers: {},
  };
  // if (response.headers.get('x-total-count')) {
  //   ret.headers['x-total-count'] = response.headers.get('x-total-count');
  // }

  return ret;
}


export async function wget(url) {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', token);
  }
  const newOption = { headers };
  const response = await fetch(url, newOption);

  checkStatus(response);

  const data = await response.json();
  return data;
}

/**
 * Requests a URL, returning a promise.
 * Request Format：
 * {
 *  "method" :"search",
 *  "parameters":{"a":"c"},
 *  "schema":{"a":"c"}
 *  }
 */
export async function queryAPI(payload) {
  // method is nextAPI's method.
  const { method, parameters, schema, RequestMethod, ...options } = payload;

  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest('@@next-request ', method, parameters, schema, options);
  }

  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (process.env.NODE_ENV !== 'production') {
    // headers.append('Debug', 1);
  }

  const token = (options && options.token) || localStorage.getItem('token');
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

function checkQueryStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // TODO move out, don't process auth here.
  if (response.status === 401) {
    // console.log('xxxxxxxxxx', response);
    // throw error;
    // auth.removeLocalAuth();
    // location.href = '/';
  }

  if (response.status >= 404 && response.statusText === 'Not Found') {
    throw error;
  }

  // Special case: for knowledge graph, query not found will return
  // {"status":false,"message":"data.not_found"} // code 404

  const error = new Error(response.statusText);
  error.response = response;
  // try {
  //   throw error;
  // } catch (e) {
  //   console.error('---- Catch Error: ---- ', e);
  // }
}
