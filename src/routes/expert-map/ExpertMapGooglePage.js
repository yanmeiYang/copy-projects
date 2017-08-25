/**
 * Created by Administrator on 2017/8/23.
 */
/**
 * Created by Administrator on 2017/8/21.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertGoogleMapPage.less';
import { Auth } from '../../hoc';

@connect(({ app, expertMap }) => ({ app, expertMap }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || 'data mining';
    const { type } = this.props.location.query;
    if (query) {
      // this.props.dispatch({ type: 'app/setQuery', query });
      this.setState({ query });
    }
    if (type) {
      this.setState({ mapType: type || 'google' });
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
      ? <ExpertGoogleMap {...options} />
      : <ExpertMap {...options} />;

    return (
      <div className={styles.content}>
        {mainBlock}
      </div>
    );
  }
}
