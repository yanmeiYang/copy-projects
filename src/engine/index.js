/**
 *  Created by BoGao on 2018-01-06;
 */
import React from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { withRouter } from 'react-router-dom';

import { Form } from 'antd';
import { Page, Models, withIntl } from './engine';

const FormCreate = Form.create;

// safe parse children.
const renderChildren = (children) => {
  const c = React.Children.map(children, (child) => {
    return child;
  });
  return c || false;
};

export {
  Page, Models,

  connect, renderChildren,

  Link, router, withRouter,

  withIntl, FormCreate,

};

