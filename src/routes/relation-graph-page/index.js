/* eslint-disable no-const-assign */
/*
 * created by BoGAo on 2017-07-10.
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import styles from './index.less';
import RelationGraph from '../relation-graph/RelationGraph';
import { sysconfig } from '../../systems';
import SearchBox from '../../components/SearchBox';


class RelationGraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    currentQuery: 'data mining',
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || '';
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
    this.setState({ query });
  }

  onSearch = ({ query }) => {
    this.setState({ currentQuery: query });
    // dispatch(routerRedux.push({
    //   pathname: `/${sysconfig.SearchPagePrefix}/${query}/0/30`,
    // }
    // ));
  };

  render() {
    return (
      <div className={styles.page}>
        <div className={styles.normal}>
          <h1>关系图</h1>
          <div className={styles.overBox}>
            <RelationGraph query={this.state.currentQuery} />
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({}) => ({}))(RelationGraphPage);
