/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon, Spin } from 'antd';
import styles from './index.less';
import SearchSeminar from './search-seminar'
import ActivityList from '../../components/seminar/activityList';

const Seminar = ({ app, dispatch, seminar }) => {
  const { results, loading, offset, query, sizePerPage } = seminar;
  const { token, user, roles } = app;

  function addBao() {
    dispatch(routerRedux.push({
      pathname: `/seminarpost`,
    }));
  }

  function getMoreSeminar() {
    if (query) {
      let params = { query: query, offset: offset, size: sizePerPage };
      dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      let params = { offset: offset, size: sizePerPage, filter: { src: 'ccf' } };
      dispatch({ type: 'seminar/getSeminar', payload: params });
    }

  }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <SearchSeminar />
        {user.hasOwnProperty('first_name') && <Button type="primary" onClick={addBao}>
          <Icon type="plus"/>&nbsp;发布新活动
        </Button>}
      </div>
      <Spin spinning={loading}>
        <div className={styles.seminar}>
          {
            results.map((result) => {
              return (
                <div key={result.id + Math.random()}>
                  <ActivityList result={result} />
                </div>
              )
            })
          }
          {!loading && results.length > sizePerPage &&
          <Button type='primary' className={styles.getMoreActivities} onClick={getMoreSeminar.bind()}>More</Button>}
        </div>
      </Spin>

    </div>

  );
};


export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(Seminar);
