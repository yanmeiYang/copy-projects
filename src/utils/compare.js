/* eslint-disable no-extend-native */
import { isEqual } from 'lodash';

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

// props & nextProps is js object. values in them are immutable.
const imCompare = (props, nextProps, model, key) => {
  if (!props || !nextProps) {
    return false;
  }
  if (model) {
    const modelA = props[model];
    const modelB = nextProps[model];
    if (modelA && modelB) {
      return modelA.get(key) === modelB.get(key)
    }
  } else {
    // model is null or '', directly compare key.
    return props[key] === nextProps[key];
  }
  return false
};
export { compare, compareDeep, imCompare };
