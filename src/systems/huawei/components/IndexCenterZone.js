/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import styles from './IndexCenterZone.less';

export default class IndexCenterZone extends React.PureComponent {
  render() {
    return (
      <div className={styles.bigNavi}>
        <div className={styles.inner}>
          <Link to="/relation-graph-page">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.relations)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.Relation" defaultMessage="Relations" />
              </div>
            </div>
          </Link>
          <Link to="/dispatch-expert-map">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.maps)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.ExpertMap" defaultMessage="Maps" />
              </div>
            </div>
          </Link>
          <Link to="/knowledge-graph">
            <div className={styles.blockItem}>
              <div className={styles.outerBackground}>
                <span alt="" className={classnames('icon', styles.kgGraph)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.KnowledgeGraph"
                    defaultMessage="Knowledge Graph" />
              </div>
            </div>
          </Link>
          <Link to="/trend-prediction">
            <div className={styles.blockItem}>
              <div className={classnames(styles.clearMarginRight, styles.outerBackground)}>
                <span alt="" className={classnames('icon', styles.topicTrend)} />
              </div>
              <div className={styles.iconDesc}>
                <FM id="com.searchTypeWidget.label.TrendPrediction" defaultMessage="Topic Trend" />
              </div>
            </div>
          </Link>
        </div>

        <div className="naviItem" style={{ display: 'none' }}>
          2016最具影响力
          <a href="https://cn.aminer.org/mostinfluentialscholar"
             target="_blank" rel="noopener noreferrer">学者</a>，
          <a href="https://cn.aminer.org/ranks/org"
             target="_blank" rel="noopener noreferrer">机构排名</a>
        </div>

      </div>
    );
  }
}
