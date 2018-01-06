/**
 * Create by BoGao, 2018-01-06
 *
 * Wrapper for dva.
 */
import dva from 'dva';

const debug = require('debug')('aminer:engine');

const app = dva();

const cache = {};

const model = (m) => {
  debug("Add model %o", m);

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

const start = () => {
  debug("Engine start");
  return app.start();
};

const router = (router) => {
  return app.router(router);
};

export { model, router, start }
