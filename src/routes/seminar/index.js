/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Icon, Spin } from 'antd';
import styles from './index.less';
import SearchSeminar from './search-seminar'

const Seminar = ({ app, dispatch, seminar }) => {
  const { results, loading, offset, query, sizePerPage } = seminar;
  const { token } = app;

  function addBao() {
    dispatch(routerRedux.push({
      pathname: `/seminarpost`,
    }));
  }

  function goToDetail(id) {
    dispatch(routerRedux.push({
      pathname: `/seminar/${id}`,
    }));
  }

  function getMoreSeminar() {
    if (query) {
      let params = { query: query, offset: offset, size: sizePerPage };
      dispatch({ type: 'seminar/searchActivity', payload: params });
    } else {
      let params = { offset: offset, size: sizePerPage };
      dispatch({ type: 'seminar/getSeminar', payload: params });
    }

  }

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <SearchSeminar />
        {token&&<Button type="primary" onClick={addBao}>
          <Icon type="plus"/>&nbsp;发布新活动
        </Button>}
      </div>
      <Spin spinning={loading}>
        <div className={styles.seminar}>
          {
            results.map((result) => {
              const time = result.time.from.split('-');
              return (
                <li key={result.id+Math.random()}>
                  <div className={styles.time}>
                    <em>{time[1]}月</em>
                    <div className={styles.bot}>
                      <span><b>{time[2].split('T')[0]}</b>日</span>
                      <strong>{result.location.city}</strong>
                    </div>
                  </div>
                  <div className={styles.con}>
                    <h3>
                      <a href='javascript:void(0)' onClick={goToDetail.bind(this, result.id)}>
                        {result.title}
                      </a>
                    </h3>
                    <div className={styles.info}>
                      <p>
                      <span className={styles.type}>
                          活动类型：{result.type === 0 ? 'seminar' : 'workshop'}
                        </span>
                        {/*<span>*/}
                          {/*<em>关键字：</em>*/}
                          {/*数据挖掘 机器学习 人工智能*/}
                        {/*</span>*/}
                      </p>
                      <p className={styles.location}>活动地点：{result.location.address}</p>
                    </div>
                  </div>
                </li>
              )
            })
          }
          {!loading&&results.length>sizePerPage&&<Button type='primary' className={styles.getMoreActivities} onClick={getMoreSeminar.bind()}>More</Button>}
        </div>
      </Spin>

    </div>

  );
};


export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(Seminar);
