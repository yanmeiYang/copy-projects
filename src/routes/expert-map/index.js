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
import { sysconfig } from '../../systems';
import NProgress from 'nprogress';

const href = window.location.href;

class ExpertMapPage extends React.Component {

  state = {
    query: 'data mining',
  };

  componentWillMount() {
    const query = this.props.location.query.query;
    console.log('componentWillMount! update query to :', query);
    if (query) {
      this.setState({ query });
    }
  }

  onSearch = (data) => {
    if (!data.query) {
      return false;
    }
    this.setState({ query: data.query });
    this.props.dispatch(routerRedux.push({
      pathname: '/expert-map',
      query: { query: data.query },
    }));
  }

  render() {
    return (
      <div className={styles.content}>
        <h1>专家地图:</h1>

        <SearchBox
          size="large" btnText="搜索" style={{ width: 680 }}
          keyword={this.state.query}
          onSearch={this.onSearch}
        />

        {href.indexOf('/expert-googlemap') > 0 &&
        <ExpertGoogleMap query={this.state.query} />}

        {href.indexOf('/expert-map') > 0 &&
        <ExpertMap query={this.state.query} />}

        {sysconfig.SPECIAL_ExpertMapNoHeader &&
        <div className="HeaderMask" />
        }
      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);

