/* eslint-disable no-const-assign */
/*
 * copied from relation-graph
 * created by LuoGan on 2017-11-25.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { Layout } from 'routes';
import queryString from 'query-string';
import { applyTheme } from 'themes';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import TopicRelation from './topic-relation';

const tc = applyTheme(styles);

@connect()
export default class TopicRelationPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentWillMount() {
    let { query } = queryString.parse(location.search);
    query = query || 'data mining';
    this.setState({ query });
  }

  onSearch = ({ query }) => {
    const { dispatch } = this.props;
    this.setState({ query });
    dispatch(routerRedux.push({ pathname: '/topic-relation', search: `?query=${query}` }));
    dispatch({ type: 'app/setQueryInHeaderIfExist', payload: { query } });
  };

  getQueryFromURL = (props) => {
    return props && props.location && props.location.query
      && props.location.query.query;
  };

  titleBlock = <h1>关键词关系图:</h1>;

  render() {
    console.log('>>> |||', this.state.query);
    return (
      <TopicRelation query={this.state.query} title={this.titleBlock} />
    );
  }
}
