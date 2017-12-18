/**
 *  Created by BoGao on 2017-06-15;
 */
let plugins; // set by themes.

// plugin router map; router key => module funcs array.
const pluginsModelMap = new Map();

// called on init.
const initPlugins = (systemPlugins) => {
  plugins = systemPlugins;
  console.log('==== initPlugins', systemPlugins);

  // init pluginModelMap.
  if (plugins && plugins.length > 0) {
    const allPlugins = [];
    plugins.forEach((plugin) => {
      allPlugins.push(...plugin);
    });
    plugins = allPlugins;

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
      }
    });
  }
};

//
// Functions
//

/***************************************************
 * Plugin-system bootstrap.
 **************************************************/
// do some cache things.


const applyPluginModules = (namespace, routerConfig) => {
  console.log('====applyPluginModules');
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

// eslint-disable-next-line camelcase
const applyPluginToAPI = (nextapi, api_plugin_key) => {
  if (plugins && plugins.length > 0) {
    console.log('000000', plugins);
    plugins.forEach((plugin) => {
      if (plugin && plugin[api_plugin_key]) {
        const apiPlugin = plugin[api_plugin_key];
        if (apiPlugin.parameters) {
          nextapi.addParam(apiPlugin.parameters);
        }
        if (apiPlugin.schema) {
          nextapi.addSchema(apiPlugin.schema);
        }
      }
    });
    // TODO ... merge filters, sorts, havings, etc...
  }
};


module.exports = {
  plugins,
  initPlugins,
  applyPluginToAPI,
  applyPluginModules,
};
