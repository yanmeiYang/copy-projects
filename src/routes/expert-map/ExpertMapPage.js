/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { applyTheme } from 'systems';
import queryString from 'query-string';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertMapPage.less';
import { Auth } from '../../hoc';

const tc = applyTheme(styles);

@connect(({ app, expertMap }) => ({ app, expertMap }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'baidu', // [baidu|google]
  };

  componentWillMount() {
    let { query, type } = queryString.parse(location.search);
    query = query || 'data mining';
    type = type || 'baidu';
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

  componentWillUnmount() {
    this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // const href = window.location.href.split('?query=')[0] + '?query=' + data.query;
      // window.location.href = href;
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-map',
        query: { query: data.query },
      }));
      this.props.dispatch({
        type: 'app/setQueryInHeaderIfExist',
        payload: { query: data.query },
      });
    }
  };

  // Tips: 不会根据state变化的jsx block放到外面。这样多次渲染的时候不会多次初始化;
  // titleBlock = <h1>专家地图:</h1>;

  render() {
    // 这代码写的太漂亮了。 -- someone 2017-8-16
    const { query, mapType } = this.state;
    const options = { query, mapType, title: this.titleBlock };
    const mainBlock = mapType === 'google'
      ? <ExpertGoogleMap {...options} />
      : <ExpertMap {...options} />;

    return (
      <Layout contentClass={tc(['expertMapPage'])}>
        {mainBlock}
      </Layout>
    );
  }
}
