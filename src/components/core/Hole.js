import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { classnames } from 'utils';
import { hole } from 'core';
import styles from './Hole.less';

@connect(({ app }) => ({ debug: app.debug }))
export default class Hole extends Component {

  static propTypes = {
    name: PropTypes.string,
    fill: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    defaults: PropTypes.array,
    param: PropTypes.object,
    config: PropTypes.object,
    // other configs.
  };

  static defaultProps = {
    name: 'HOLE',
  };

  render() {
    const { name, fill, defaults, param, config, children, debug } = this.props;

    const holeContent = param
      ? hole.fillFuncs(fill, defaults, param, config)
      : hole.fill(fill, defaults);

    // DEBUG ONLY
    if (process.env.NODE_ENV !== 'production') {
      switch (debug && debug.HighlightHoles) {
        case 'yes':
          if (!holeContent) {
            return false;
          }
        case 'all':
          return (
            <div className={classnames({
              [styles.debugHoleBox]: true,
              [styles.empty]: !holeContent,
            })}>
              <div className={styles.debugTitle}>{name}</div>
              <div className={styles.debugContent}>
                {holeContent}
              </div>
            </div>
          );
        case 'none':
          return holeContent;
        default:
      }
    }

    return holeContent;
  }
}
