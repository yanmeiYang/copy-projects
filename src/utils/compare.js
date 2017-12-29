/* eslint-disable no-extend-native */
import { isEqual } from 'lodash';
import classnames from 'classnames';
import config from './config';
import { getMenusByUser } from './menu';
import request from './request';
import { color } from './theme';

// ShadowCompare: if any rest changes, return true; else return false;
const compare = (props1, props2, ...rest) => {
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

const compareDeep = (props1, props2, ...rest) => {
  if (props1 && props2 && rest && rest.length > 0) {
    for (let i = 0; i < rest.length; i += 1) {
      const key = rest[i];
      const item1 = props1[key];
      const item2 = props2[key];
      if (!isEqual(item1, item2)) {
        return true;
      }
    }
  }
  return false;
};

export { compare, compareDeep };
