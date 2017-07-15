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
        <div className="naviItem">
          <Link to="https://cn.aminer.org/ego">学者关系网络</Link>
        </div>
        <div className="naviItem">
          <Link to="/expert-map">全球人才分布图</Link>
        </div>
        <div className="naviItem">
          <Link to="/knowledge-graph">知识图谱</Link>
        </div>
        <div className="naviItem">
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
