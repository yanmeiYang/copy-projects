/* eslint-disable no-extend-native */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import config from './config';

/**
 * user in app model.
 * @param user
 */
function isLogin(user) {
  if (user && user.id) {
    return true;
  }
  return false;
}

module.exports = { isLogin };
