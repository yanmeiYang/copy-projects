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

// ShadowCompare: if any rest changes, return true; else return false;
const compare = (props1, props2, ...rest) => {
  // console.log('~~~~~~~~~~~~~~~~ compare', props1, props2, rest);
  if (props1 && props2 && rest && rest.length > 0) {
    for (let i = 0; i < rest.length; i += 1) {
      const key = rest[i];
      const item1 = props1[key];
      const item2 = props2[key];
      if (item1 !== item2) {
        return true;
      }
    }
  }
  return false;
};

module.exports = { ReactHelper, compare };
