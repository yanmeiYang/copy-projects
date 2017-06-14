/**
 * Created by yutao on 2017/5/25.
 */
import fetch from 'dva/fetch';
import { baseURL } from './config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  let newUrl = baseURL + url;
  if (options && !(options.method && options.method.toUpperCase() === 'POST') && options.data) {
    const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    const queryString = queryList.join('&');
    newUrl = `${newUrl}?${queryString}`;
  }
  const token = localStorage.getItem('token');
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Content-Type', 'application/json');
  if (token) {
    headers.append('Authorization', token);
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
