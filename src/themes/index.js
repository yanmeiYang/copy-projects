/**
 * Created by BoGao on 2017/10/10.
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import classnames from 'classnames';
import { System } from 'utils/system';

const theme = require(`themes/${System}/theme-${System}.js`);

/***************************************************
 * classes
 **************************************************/
// support only styles.className, not support global css.
const applyTheme = (styles) => {
  const themeStyles = theme.styles;
  return (classes, rawClasses) => {
    const results = [];
    if (classes) {
      classes.map((className) => {
        const c = styles[className];
        if (c) {
          results.push(c);
        }
        const c2 = themeStyles[className];
        if (c2) {
          results.push(c2);
        }
        return false;
      });
    }
    if (rawClasses) {
      results.push(...rawClasses);
    }
    return classnames(...results);
  };
};

module.exports = { theme, applyTheme };
