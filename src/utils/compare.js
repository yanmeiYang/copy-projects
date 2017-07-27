/* eslint-disable no-extend-native */
import classnames from 'classnames';
import { cloneDeep } from 'lodash';
import config from './config';
import { getMenusByUser } from './menu';
import request from './request';
import { color } from './theme';

class ReactHelper {

  create(oldProps, newProps) {
    this.oldProps = oldProps;
    this.newProps = newProps;

    return function () {
    }
  }
}

module.exports = { ReactHelper };
