/**
 *  Created by BoGao on 2018-01-06;
 */
import React from 'react';
import { connect } from 'dva';
import * as engine from './engine';
import Link from 'umi/link';
import router from 'umi/router';

// safe parse children.
const renderChildren = (children) => {
  const c = React.Children.map(children, (child) => {
    return child;
  });
  return c || false;
};

export {
  engine, connect,

  Link, router,

  renderChildren,
};

