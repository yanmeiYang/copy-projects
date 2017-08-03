/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './ExpertTrajectoryPage.less';


class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google', // [baidu|google]
  };

  componentWillMount() {
    const query = (this.props.location && this.props.location.query
      && this.props.location.query.query) || 'data mining';
    const { type } = this.props.location.query;
    if (query) {
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

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-map',
        query: { query: data.query },
      }));
    }
  };

  render() {
    return (
      <div className={classnames('content-inner', styles.page)}>
        your contents; query in model is : {this.props.expertTrajectory.query}
      </div>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);
