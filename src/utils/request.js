/**
 * Created by yutao on 2017/5/25.
 */
import fetch from 'dva/fetch';
import { baseURL } from './config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // TODO move out, don't process auth here.
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // location.href = '/';
  }

  const error = new Error(response.statusText);
  error.response = response;
  try {
    throw error;
  } catch (e) {
    console.log(e);
  }
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
    console.log('@@request ', url, options);
  }

  let newUrl = baseURL + url;

  // process !post mode data.
  if (options &&
    !(options.method && options.method.toUpperCase() === 'POST')
    && options.data) {
    const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    const queryString = queryList.join('&');
    newUrl = `${newUrl}?${queryString}`;
  }

  const headers = new Headers();
  if (options && (options.data || options.body)) {
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
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
