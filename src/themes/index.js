/**
 * Created by BoGao on 2017/10/10.
 */
/* eslint-disable prefer-template,import/no-dynamic-require */
import React from 'react';
import classnames from 'classnames';
import { System } from 'utils/system';

const theme = require(`themes/${System}/theme-${System}.js`);

/***************************************************
 * Plugin-system bootstrap.
 **************************************************/
// do some cache things.
const pluginsModelMap = new Map(); // router key => module funcs array.

if (theme.plugins && theme.plugins.length > 0) {
  const plugins = [];
  theme.plugins.forEach((plugin) => {
    plugins.push(...plugin);
  });

  //   theme.plugins.map((plugin) => {
  plugins.forEach((plugin) => {
    const routerKeys = typeof plugin.router === 'string'
      ? [plugin.router]
      : plugin.router;

    for (const routerKey of routerKeys) {
      const modules = pluginsModelMap.get(routerKey);
      if (!modules) {
        pluginsModelMap.set(routerKey, [...plugin.modules]);
      } else {
        modules.push(...plugin.modules);
      }
      // console.log('====', routerKey, pluginsModulesMap.get(routerKey));
    }
  });
}

const applyPluginModules = (namespace, routerConfig) => {
  // console.log('theme.plugins::::', theme.plugins);
  // console.log('routerConfig::::', routerConfig);
  const newRouterConfig = {};
  Object.keys(routerConfig).forEach((key) => {
    const value = routerConfig[key]; // value is router.
    const pluginModelFuncs = pluginsModelMap.get(`${namespace}.${key}`);
    if (pluginModelFuncs && pluginModelFuncs.length > 0) {
      const funcs = [value.models, ...pluginModelFuncs];
      value.models = () => {
        const pluginModels = [];
        for (const pluginFunc of funcs) {
          pluginModels.push(...pluginFunc());
        }
        return pluginModels;
      };
    }
    newRouterConfig[key] = value;
  });
  return newRouterConfig;
};


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

module.exports = { theme, applyTheme, applyPluginModules };
