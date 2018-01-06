/**
 * Create by BoGao, 2018-01-06
 *
 * Wrapper for dva.
 */
import dva from 'dva';

const debug = require('debug')('aminer:engine');
const pref = require('debug')('pref:aminer:engine');

const app = dva();

// TODO umi initialize DVA.

const cache = {};

const model = (m) => {
  debug("Try add model %s.", m.namespace);

  // development check
  if (process.env.NODE_ENV !== 'production') {
    if (!m || !m.namespace) {
      console.error("Can't read namespace from model ", m);
      return;
    }
  }

  if (cache[m.namespace]) {
    // debug("Can't add model with the exist namespace %s.", m.namespace);
    return;
  }

  // Add model to dva.
  app.model(m);

  // Don't need to save model instance to avoid unnecessary memory-leak.
  cache[m.namespace] = true;
};

const router = (router) => {
  app.router(router);
};

let engineInstance;

const start = () => {
  if (!engineInstance) {
    pref("Engine start.");

    engineInstance = app.start();

    pref("Engine start success.");
    debug("Engine start success.");
  }
  return engineInstance;
};

export { model, router, start }
