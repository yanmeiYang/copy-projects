/**
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';

class TrendPredictionPage extends React.Component {

  state = {
    query: 'data mining',
    mapType: 'baidu', // [baidu|google]
  };

  componentWillMount() {
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-map',
        query: { query: data.query },
      }));
    }
  };

  render() {
    return (
      <div className={styles.content}>
        <h1>专家地图:</h1>
      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(TrendPredictionPage);

