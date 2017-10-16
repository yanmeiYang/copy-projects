/**
 * Created by Administrator on 2017/9/1.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { applyTheme } from 'systems';
import { Auth } from 'hoc';
import queryString from 'query-string';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertGoogleMapPage.less';

const tc = applyTheme(styles);

@connect(({ app, expertgoogleMap }) => ({ app, expertgoogleMap }))
@Auth
export default class ExpertGoogleMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
  };

  componentWillMount() {
    let { query, type } = queryString.parse(location.search);
    query = query || 'data mining';
    type = type || 'google';
    if (query) {
      // this.props.dispatch({ type: 'app/setQuery', query });
      this.setState({ query });
    }
    if (type) {
      this.setState({ mapType: type });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
  }
  componentWillReceiveProps(nextProps) {
    const { query } = queryString.parse(location.search);
    if (this.state.orgs !== query) {
      this.setState({ query });
    }
  }
  componentWillUnmount() {
    this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-googlemap',
        query: { query: data.query },
      }));
      this.props.dispatch({
        type: 'app/setQueryInHeaderIfExist',
        payload: { query: data.query },
      });
    }
  };

  // Tips: 不会根据state变化的jsx block放到外面。这样多次渲染的时候不会多次初始化;
  titleBlock = <h1>专家地图:</h1>;

  render() {
    // 这代码写的太漂亮了。 -- someone 2017-8-16
    const { query, mapType } = this.state;
    const options = { query, mapType, title: this.titleBlock };
    const mainBlock = mapType === 'baidu'
      ? <ExpertMap {...options} />
      : <ExpertGoogleMap {...options} />;

    return (
      <Layout contentClass={tc(['expertGoogleMapPage'])}>
        {mainBlock}
      </Layout>
    );
  }
}
