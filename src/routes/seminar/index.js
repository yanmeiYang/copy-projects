/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon, Spin, Col } from 'antd';
import { config } from '../../utils';
import styles from './index.less';
import SearchSeminar from './search-seminar';
import NewActivityList from '../../components/seminar/newActivityList';
// import ActivityList from '../../components/seminar/activityList';

const Seminar = ({ app, dispatch, seminar }) => {
  const { results, loading, offset, query, sizePerPage } = seminar;
  const { user } = app;

  function addBao() {
    dispatch(routerRedux.push({
      pathname: '/seminar-post',
    }));
  }

  function getMoreSeminar() {
    if (query) {
      const params = { query, offset, size: sizePerPage };
      dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      const params = { offset, size: sizePerPage, filter: { src: config.source } };
      dispatch({ type: 'seminar/getSeminar', payload: params });
    }
  }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <SearchSeminar />
        {user.hasOwnProperty('first_name') && <Button type="primary" onClick={addBao}>
          <Icon type="plus" />&nbsp;发布新活动
        </Button>}
      </div>
      <Spin spinning={loading}>
        <div className="seminar">
          <Col lg={{ span: 12, offset: 3 }}>
            {
              results.map((result) => {
                return (
                  <div key={result.id + Math.random()}>
                    <NewActivityList result={result} hidetExpertRating="false" style={{ marginTop: 20 }} />
                  </div>
                );
              })
            }
            {!loading && results.length > sizePerPage &&
            <Button type="primary" className="getMoreActivities" onClick={getMoreSeminar.bind()}>More</Button>}
          </Col>
        </div>
      </Spin>

    </div>

  );
};


export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(Seminar);
