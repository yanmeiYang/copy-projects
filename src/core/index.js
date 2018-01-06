/**
 *  Created by BoGao on 2017-12-16;
 */
import { connect } from 'dva';
import * as engine from './engine';
import * as plugins from './plugins';
import * as system from './system';
import * as hole from './hole';
import Link from 'umi/link';
import router from 'umi/router';

export {
  engine, connect,
  plugins, system, hole,

  Link, router,
};

