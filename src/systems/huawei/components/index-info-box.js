/**
 * Created by BoGao on 2017/7/15.
 */
import React from 'react';
import { Link } from 'dva/router';
import styles from './index-info-box.less';

class IndexInfoBox extends React.PureComponent {
  render() {
    return (
      <div className={styles.bigNavi}>
        <Link to="/relation-graph-page">
          <div className={styles.blockItem}>
            {/* <Link to="/uniSearch/Data%20Mining/0/30?view=relation-view">学者关系</Link> */}
            <div className={styles.blockImg}>
              <img src="/sys/huawei/relation-graph-page.png" alt="学者关系" />
            </div>
            <span>学者关系</span>
          </div>
        </Link>
        <Link to="/dispatch-expert-map">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/expert-map.png" alt="人才地图" />
            </div>
            <span>人才地图</span>
          </div>
        </Link>
        <Link to="/knowledge-graph">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/knowledge-graph.png" alt="知识图谱" />
            </div>
            <span>知识图谱</span>
          </div>
        </Link>
        <Link to="/trend-prediction">
          <div className={styles.blockItem}>
            <div className={styles.blockImg}>
              <img src="/sys/huawei/trend-prediction.png" alt="技术趋势" />
            </div>
            <span>技术趋势</span>
          </div>
        </Link>

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

export default IndexInfoBox;
