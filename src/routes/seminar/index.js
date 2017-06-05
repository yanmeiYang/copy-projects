/**
 * Created by yangyanmei on 17/5/26.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Tabs, Button, Icon, Input } from 'antd';
import styles from './index.less';
const Search = Input.Search;

const Seminar = ({ location, dispatch, seminar, loading }) => {
  const { results, pagination } = seminar;
  const { pageSize } = pagination;

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

  return (
    <div className="content-inner">
      <div className={styles.top}>
        <div className={styles.searchWrap}>
          <Input placeholder='请输入关键词。。。' />
          <Button type="primary">搜索</Button>
        </div>
        <Button type="primary" onClick={addBao}>
          <Icon type="plus"/>&nbsp;发布新活动
        </Button>
      </div>
      <div className={styles.seminar}>
        {
          results.map((result) => {
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
                    <a href='javascript:void(0)' onClick={goToDetail.bind(this, result.id)}>{result.title}</a>
                  </h3>
                  <div className={styles.info}>
                    <p>
                      <span className={styles.type}>
                          活动类型：{result.type === 0 ? 'seminar' : 'workshop'}
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
        <Button type='primary' className={styles.getMoreActivities}>More</Button>
      </div>

    </div>

  );
};


export default connect(({ seminar, loading }) => ({ seminar, loading }))(Seminar);
