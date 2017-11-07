import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import queryString from 'query-string';
import { compare } from 'utils';
// import styles from './index.less';
import TrendPrediction from './trend-prediction.js';

@connect(({ app }) => ({ app }))
@Auth
export default class TrendPredictionPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = { query: '' };

  componentWillMount() {
    let { query } = queryString.parse(location.search);
    query = query || ' ';
    if (query) {
      this.setState({ query });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { query } = queryString.parse(location.search);
    if (this.state.orgs !== query) {
      this.setState({ query });
    }
  }

  shouldComponentUpdate(nextProps, nextStates) {
    return compare(nextStates, this.state, 'query');
  }

  onSearch = (data) => {
    const { dispatch } = this.props;
    const { query } = data;
    if (query) {
      this.setState({ query });
      dispatch(routerRedux.push({ pathname: '/trend', search: `?query=${query}` }));
      dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query } });
    }
  };

  render() {
    return (
      <Layout query={this.state.query} onSearch={this.onSearch}>
        <div className="content-inner">
          <h1>技术趋势预测:</h1>
          <TrendPrediction query={this.state.query} />
        </div>
      </Layout>
    );
  }
}
