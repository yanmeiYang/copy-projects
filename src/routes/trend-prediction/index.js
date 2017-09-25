import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
// import styles from './index.less';
import TrendPrediction from './trend-prediction.js';
import { Auth } from '../../hoc';

@connect(({ app }) => ({ app }))
@Auth
export default class TrendPredictionPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'baidu', // [baidu|google]
  };

  componentWillMount() {
    const { query } = queryString.parse(location.search);
    if (query) {
      this.setState({ query });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        // showFooter: false,
      },
    });
  }

  onSearch = (data) => {
    const { dispatch } = this.props;
    const { query } = data;
    if (query) {
      this.setState({ query });
      dispatch(routerRedux.push({ pathname: '/trend-prediction', query: { query } }));
      dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query } });
    }
  };

  render() {
    return (
      <div className="content-inner">
        <h1>技术趋势预测:</h1>
        <TrendPrediction query={this.state.query} />
      </div>
    );
  }
}
