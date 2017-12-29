/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { sysconfig } from 'systems';
import { reflect } from 'utils';
import debug from 'utils/debug';

const ENABLED = sysconfig.GLOBAL_ENABLE_HOC;
const ENABLE_PROFILING = true;

/**
 * Profiling HOC TODO 无效
 */
function Profiling(ComponentClass) {
  return class ProfilingHoc extends Component {
    constructor(props) {
      super(props);
      this.count = 0;
    }

    componentWillMount = () => {
      if (!ENABLED || !ENABLE_PROFILING) {
        return false;
      }

      if (process.env.NODE_ENV !== 'production') {
        if (debug.LogHOC) {
          console.log('%c@@HOC: Profiling on ', 'color:orange',
            reflect.GetComponentName(ComponentClass));
        }
      }
    };

    // 不生效
    // componentWillUpdate = () => {
    //   this.count += 1;
    //   console.log('%cProfiling: %s (%d)', 'color:green',
    //     reflect.GetComponentName(ComponentClass), this.count);
    // };

    render() {
      this.count += 1;
      console.log('%cProfiling: %s.render(%d)', 'color:green',
        reflect.GetComponentName(ComponentClass), this.count);

      return <ComponentClass {...this.props} />;
    }
  };
}

export { Profiling };
