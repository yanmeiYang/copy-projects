/* eslint-disable react/no-multi-comp */
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { sysconfig } from 'systems';
import * as authUtil from 'utils/auth';
import { reflect } from 'utils';
import * as debug from 'utils/debug';

const ENABLED = sysconfig.GLOBAL_ENABLE_HOC;

const hasAuthInfo = props => props && props.app && props.app.user && props.app.roles;

/**
 * 自动引入新的资源的HOC.
 * @param ComponentClass
 * @returns {AuthHoc}
 * @constructor
 */
function RequireRes(resources) {
  return function RequireResources(ComponentClass) {
    return class RequireResHOC extends Component {
      componentWillMount = () => {
        const name = ComponentClass.displayName || ComponentClass.name ||
          reflect.GetComponentName(ComponentClass);
        if (process.env.NODE_ENV !== 'production') {
          if (debug.LogHOC) {
            console.log('%c@@HOC: @RequireRes on %s', 'color:yellow', name);
          }
        }
      };

      componentWillMount = () => {
        let res = resources || [];
        if (typeof resources === 'string') {
          res = [resources];
        }
        this.props.dispatch({ type: 'app/requireResource', res });
      };

      render() {
        return <ComponentClass {...this.props} />;
      }
    };
  }
}

export { RequireRes };
