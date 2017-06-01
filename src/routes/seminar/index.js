/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Button, Icon } from 'antd';
import styles from './index.less';

const TabPane = Tabs.TabPane;

const Seminar = ({ location, dispatch, seminar, loading }) => {
  const { results, pagination } = seminar;
  const { pageSize } = pagination;

  function addBao() {
    dispatch(routerRedux.push({
      pathname: `/seminar/post`,
    }));
  }

  function goToDetail(id) {
    dispatch(routerRedux.push({
      pathname: `/seminar/${id}`,
    }));
  }

  return (
    <div className="card-container">
      <p type="primary" className={styles.addSeminar} onClick={addBao}>
        <Icon type="plus"/>&nbsp;发布新活动
      </p>
      <Tabs type="card" style={{ overflow: 'inherit' }}>
        <TabPane tab="未进行的活动" key="1">
          <div className={styles.seminar}>
            {
              results.slice(0, 5).map((result) => {
                const time = result.time.from.split('-');
                return (
                  <li key={result.id}>
                    <div className={styles.time}>
                      <em>{time[1]}月</em>
                      <div className={styles.bot}>
                        <span><b>{time[2].split('T')[0]}</b>日</span>
                        <strong>{result.location.city}</strong>
                      </div>
                    </div>
                    <div className={styles.con}>
                      <h3>
                        <a href='javascript:void(0)' onClick={goToDetail.bind(this,result.id)}>{result.title}</a>
                      </h3>
                      <div className={styles.info}>
                        <p>
                          <span className={styles.type}>
                              活动类型：{seminar.type === 0 ? 'seminar' : 'workshop'}
                            </span>
                          <span>
                              <em>关键字：</em>
                              数据挖掘 机器学习 人工智能
                            </span>
                        </p>
                        <p className={styles.location}>活动地点：{result.location.address}</p>
                      </div>
                    </div>
                  </li>
                )
              })
            }
          </div>
        </TabPane>
        <TabPane tab="已完成的活动" key="2">
          <div className={styles.seminar}>
            {
              results.slice(5, results.length - 1).map((result) => {
                const time = result.time.from.split('-');
                return (
                  <li key={result.id}>
                    <div className={styles.time}>
                      <em>{time[1]}月</em>
                      <div className={styles.bot}>
                        <span><b>{time[2].split('T')[0]}</b>日</span>
                        <strong>{result.location.city}</strong>
                      </div>
                    </div>
                    <div className={styles.con}>
                      <h3>
                        <a href='javascript:void(0)' onClick={goToDetail.bind(this,result.id)}>{result.title}</a>
                      </h3>
                      <div className={styles.info}>
                        <p>
                          <span className={styles.type}>
                              活动类型：{seminar.type === 0 ? 'seminar' : 'workshop'}
                            </span>
                          <span>
                              <em>关键字：</em>
                              数据挖掘 机器学习 人工智能
                            </span>
                        </p>
                        <p className={styles.location}>活动地点：{result.location.address}</p>
                      </div>
                    </div>
                  </li>
                )
              })
            };
          </div>
        </TabPane>
      </Tabs>

    </div>

  );
};


export default connect(({ seminar, loading }) => ({ seminar, loading }))(Seminar);
