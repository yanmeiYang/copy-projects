/**
 */
import React from 'react';
import { connect } from 'dva';
import styles from './trend-prediction.less';
import child_process from 'child_process'

/**
 * Component
 * @param id
 */
class TrendPrediction extends React.PureComponent {
  componentDidMount(){

  }

  render() {
    return (
      <div className={styles.expertMap}>

      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(TrendPrediction);
