/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ExpertMap from './expert-map.js';
import styles from './index.less';
import SearchBox from '../../components/SearchBox';

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

  // showtype = (e) => {
  //   const typeid = e.target && e.target.getAttribute('data');
  //   const tli = document.getElementById('menu0').getElementsByTagName('li');
  //   ExpertMap.test1();
  //   let currentclass = '';
  //   for (let i = 0; i < tli.length; i += 1) {
  //     if (tli[i].className !== '') {
  //       currentclass = tli[i].className;
  //     }
  //   }
  //   for (let i = 0; i < tli.length; i += 1) {
  //     if (i === typeid) {
  //       tli[i].className = currentclass;
  //     } else {
  //       tli[i].className = '';
  //     }
  //   }
  // };

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

        <ExpertMap query={this.state.query} />
      </div>
    );
  }
}

export default connect(({ expertMap }) => ({ expertMap }))(ExpertMapPage);
