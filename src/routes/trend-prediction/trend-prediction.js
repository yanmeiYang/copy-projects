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
        <iframe className={styles.frame} src="http://localhost:8888/templates/trend.htm"></iframe>
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(TrendPrediction);
