/* eslint-disable no-const-assign */
/*
 * created by BoGAo on 2017-07-10.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';

import { routerRedux, Link } from 'dva/router';
import styles from './RelationGraphPage.less';
import RelationGraph from './RelationGraph';


class RelationGraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
  };

  componentWillMount() {
    const query = this.getQueryFromURL(this.props) || '';
    console.log('>>>>>>>>>>>>>> query is ', query);
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
    this.setState({ query });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  // const query = this.getQueryFromURL(this.props);
  // const nextQuery = this.getQueryFromURL(nextProps);
  // if (query !== nextQuery) {
  //   console.log('---------', nextQuery);
  //   this.setState({ nextQuery });
  //   return true;
  // }
  //
  // if (this.state.query !== nextState.query) {
  //   return true;
  // }
  //   return true;
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   this.onUpdate();
  // }
  //
  // onUpdate() {
  // }

  onSearch = ({ query }) => {
    console.log('>>> Search for', query);
    this.setState({ query });
    this.props.dispatch(routerRedux.push({
      pathname: '/relation-graph-page',
      query: { query },
    }));
  };

  getQueryFromURL = (props) => {
    return props && props.location && props.location.query
      && props.location.query.query;
  };

  titleBlock = <h1>关系图:</h1>;

  render() {
    console.log('>>> |||', this.state.query);
    return (
      <div className={classnames('content-inner', styles.page)}>
        <RelationGraph query={this.state.query} title={this.titleBlock} />
      </div>
    );
  }
}

export default connect(({}) => ({}))(RelationGraphPage);
