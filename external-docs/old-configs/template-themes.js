/**
 * Created by BoGao on 2017/10/10.
 *
 * $$ NOTE $$ ${system}
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import classnames from 'classnames';
import { plugins } from 'core';
import theme from 'themes/##{system}##/theme-##{system}##';
// const theme = require('themes/##{system}##/theme-##{system}##.js');

// init something.
plugins.initPlugins(theme.plugins);

/***************************************************
 * Methods
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

export { theme, applyTheme };
