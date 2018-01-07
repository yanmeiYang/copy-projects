import dva, { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';


/////////////////////////////////
const app = dva();

const debug = require('debug')('aminer:engine');
const pref = require('debug')('pref:aminer:engine');

let instance;
const cache = {};
const engine = {

  model: (m) => {
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
  },

  router: (r) => {
    console.log("router to ", r);
    app.router(r);
  },

  start() {
    console.log("start ");
    // return app.start();
    if (!instance) {
      console.log("real start ");
      instance = app.start();
    }
    return this.instance;
  },
};

export { engine, connect, Link, router }
