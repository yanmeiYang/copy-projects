/**
 * Created by BoGao on 2017/7/15.
 */
import React, { PureComponent } from 'react';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import styles from './index-info-box.less';

class IndexInfoBox extends PureComponent {
  render() {
    return (
      <div className={styles.bigNavi}>
        <Link to="/relation-graph-page">
          <div className={styles.blockItem}>
            {/* <Link to="/uniSearch/Data%20Mining/0/30?view=relation-view">学者关系</Link> */}
            <div className={styles.blockImg}>
              <img src="/sys/huawei/relation-graph-page.png" alt="学者关系" />
            </div>
            <span>
              <FM id="com.searchTypeWidget.label.Relation" defaultMessage="Relations" />
            </span>
          </div>
        </Link>
        <Link to="/expert-map">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/expert-map.png" alt="" />
            </div>
            <span>
              <FM id="com.searchTypeWidget.label.ExpertMap" defaultMessage="Maps" />
            </span>
          </div>
        </Link>
        <Link to="/knowledge-graph">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/knowledge-graph.png" alt="" />
            </div>
            <span>
              <FM id="com.searchTypeWidget.label.KnowledgeGraph"
                  defaultMessage="Knowledge Graph" />
            </span>
          </div>
        </Link>
        <Link to="/trend">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/trend-prediction.png" alt="" />
            </div>
            <span>
              <FM id="com.searchTypeWidget.label.TrendPrediction" defaultMessage="Topic Trend" />
            </span>
          </div>
        </Link>

        <div className="naviItem" style={{ display: 'none' }}>
          2016最具影响力
          <a href="https://cn.aminer.org/mostinfluentialscholar"
             target="_blank" rel="noopener noreferrer">学者
          </a>，
          <a href="https://cn.aminer.org/ranks/org"
             target="_blank" rel="noopener noreferrer">机构排名
          </a>
        </div>

      </div>
    );
  }
}

export default IndexInfoBox;
