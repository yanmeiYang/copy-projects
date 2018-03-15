/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Link } from 'engine';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import styles from './IndexCenterZone.less';

export default class IndexCenterZone extends React.PureComponent {
  render() {
    return (
      <div className={styles.bigNavi}>
        <div className={styles.inner}>
          <Link to="/expertbase" href="/expertbase">
            <div className={styles.blockItem}>
              <div className={classnames(styles.outerBackground)}>
                <span alt="" className={classnames('icon', styles.crossSearch)} />
              </div>
              <div className={styles.iconDesc}>
                AI
              </div>
            </div>
          </Link>
        </div>

      </div>
    );
  }
}
