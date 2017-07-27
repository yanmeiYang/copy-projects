/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './index.less';

class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    // this.query = this.props.location.query;
  }

  state = {
    query: 'data mining',
    mapType: 'baidu', // [baidu|google]
  };

  componentWillMount() {
    const query = this.props.location.query;
    if (query.query) {
      this.setState({ query });
    }
    if (query.type) {
      this.setState({ mapType: query.type || 'baidu' });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query: query.query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
  }

  componentWillUnmount() {
    this.dispatch({ type: 'app/layout', payload: { showFooter: true } });
  };

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-map',
        query: { query: data.query },
      }));
    }
  };

  // Tips: 不会根据state变化的jsx block放到外面。这样多次渲染的时候不会多次初始化;
  titleBlock = <h1>专家地图:</h1>;

  render() {
    return (
      <div className={styles.content}>

        {this.state.mapType === 'baidu' &&
        <ExpertMap query={this.state.query} mapType={this.state.mapType}
                   title={this.titleBlock} />
        }

        {this.state.mapType === 'google' &&
        <ExpertGoogleMap query={this.state.query} mapType={this.state.mapType} />
        }

      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);

