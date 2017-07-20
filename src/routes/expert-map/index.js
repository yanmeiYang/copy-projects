/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';

class ExpertMapPage extends React.Component {

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

        <SearchBox
          size="large" btnText="搜索" style={{ width: 680 }}
          query={this.state.query}
          onSearch={this.onSearch}
        />

        {this.state.mapType === 'google' &&
        <ExpertGoogleMap query={this.state.query} mapType={this.state.mapType} />
        }

        {this.state.mapType === 'baidu' &&
        <ExpertMap query={this.state.query} mapType={this.state.mapType} />
        }

      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);

