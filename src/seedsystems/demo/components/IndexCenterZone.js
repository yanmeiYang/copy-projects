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
          <Link to="/search/-" href="/search/-">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.expertSearch)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="index.title" defaultMessage="Expert Search" />
              </div>
            </div>
          </Link>
          <Link to="/expert-map" href="/expert-map">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.maps)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.ExpertMap" defaultMessage="Maps" />
              </div>
            </div>
          </Link>
          <Link to="/relation-graph" href="/relation-graph">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.relations)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.Relation" defaultMessage="Relations" />
              </div>
            </div>
          </Link>
          <Link to="/trend" href="/trend">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.topicTrend)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.TrendPrediction"
                    defaultMessage="Topic Trend" />
              </div>
            </div>
          </Link>

          <Link to="/cross" href="/cross">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.crossSearch)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.crossSearch"
                    defaultMessage="Cross" />
              </div>
            </div>
          </Link>
          <a href="https://ccf-beta.aminer.cn" target="_blank">
            <div className={styles.blockItem}>
              <div className={classnames(styles.clearMarginRight, styles.outerBackground)}>
                <span alt="" className={classnames('icon', styles.seminar)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.seminar"
                    defaultMessage="Seminar" />
              </div>
            </div>
          </a>
        </div>

      </div>
    );
  }
}
