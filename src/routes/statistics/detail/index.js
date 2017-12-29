/**
 * Created by yangyanmei on 17/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Spin, Button } from 'antd';
import { Layout } from 'routes';
import { queryURL } from 'utils';
import NewActivityList from '../../../components/seminar/newActivityList';
import styles from './index.less';

// import ActivityList from '../../../components/seminar/activityList';


class StatisticsDetail extends React.Component {
  state = {
    filter: {},
  };
  componentWillMount = () => {
    let payload = {};
    if (queryURL('category') === null) {
      payload = { organizer: queryURL('organizer') };
    } else {
      payload = { organizer: queryURL('organizer'), category: queryURL('category') };
    }
    this.setState({ filter: payload });
    const offset = this.props.statistics.getSeminarOffset;
    const size = this.props.statistics.getSeminarSize;
    this.props.dispatch({
      type: 'statistics/getSeminarsByOrgAndCat',
      offset,
      size,
      payload,
    });
  };
  getMoreSeminar = () => {
    const offset = this.props.statistics.getSeminarOffset;
    const size = this.props.statistics.getSeminarSize;
    const payload = this.state.filter;
    this.props.dispatch({
      type: 'seminar/getSeminar',
      offset,
      size,
      payload,
    });
  };

  render() {
    const { loading, seminarsByOrgAndCat, sizePerPage } = this.props.statistics;
    return (
      <Layout contentClass={styles.statisticsDetail} searchZone={[]}>

        <h3>
          {queryURL('category') &&
          <span><strong>活动类型：</strong> {queryURL('category')}</span>}
          {queryURL('organizer') &&
          <span style={{ marginLeft: 15 }}>
            <strong>承办单位：</strong> {queryURL('organizer')} </span>}
        </h3>
        <Spin spinning={loading}>
          <div className="seminar" style={{ minHeight: '350px', marginTop: 20, flexDirection: 'column' }}>
            {
              seminarsByOrgAndCat.map((result) => {
                return (
                  <div key={`${result.id}_${Math.random()}`}>
                    <NewActivityList result={result} hidetExpertRating="true"
                                     style={{ marginTop: 10, maxWidth: 1000 }} />
                  </div>
                );
              })
            }
            {!loading && seminarsByOrgAndCat.length > sizePerPage &&
            <Button type="primary" className="getMoreActivities"
                    onClick={this.getMoreSeminar.bind()}>More</Button>}
          </div>
        </Spin>
      </Layout>
    );
  }
}

export default connect(({ app, statistics }) => ({ app, statistics }))(StatisticsDetail);
