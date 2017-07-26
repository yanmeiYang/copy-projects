/**
 */
import React from 'react';
import { connect } from 'dva';
import styles from './trend-prediction.less';

/**
 * Component
 * @param id
 */
class TrendPrediction extends React.PureComponent {
  componentDidMount(){

  }

  render() {
    return (
      <div className={styles.trend}>
        <iframe className={styles.frame} src="http://47.94.231.103:8877/index.html"></iframe>
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(TrendPrediction);
