/* eslint-disable no-const-assign */
/*
 * created by BoGAo on 2017-07-10.
 */
import React from 'react';
import { connect } from 'dva';
import { Layout } from 'components/layout';
import queryString from 'query-string';
import { theme, applyTheme } from 'themes';
import { routerRedux } from 'engine';
import RelationGraph from './components/RelationGraph';
import styles from './index.less';

const tc = applyTheme(styles);

@connect()
export default class RelationGraphPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentWillMount() {
    let { query } = queryString.parse(location.search);
    query = query || '-';
    // const query = this.getQueryFromURL(this.props) || 'data mining';
    // this.dispatch({
    //   type: 'app/layout',
    //   payload: {
    //     headerSearchBox: { query, onSearch: this.onSearch },
    //     showFooter: false,
    //   },
    // });
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
    const { dispatch } = this.props;
    this.setState({ query });
    dispatch(routerRedux.push({ pathname: '/relation-graph', search: `?query=${query}` }));
  };

  getQueryFromURL = (props) => {
    return props && props.location && props.location.query
      && props.location.query.query;
  };

  titleBlock = <h1>关系图:</h1>;

  render() {
    console.log('>>> |||', this.state.query);
    return (
      <Layout contentClass={tc(['relationGraph'])} query={this.state.query}
              onSearch={this.onSearch}>
        <RelationGraph query={this.state.query} title={this.titleBlock} />
      </Layout>
    );
  }
}
