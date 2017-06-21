/**
 * Created by yangyanmei on 17/6/21.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import styles from  './index.less';

class ActivityList extends React.Component {
  goToDetail = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/seminar/${id}`,
    }));
  };

  render() {
    const { result } = this.props;
    const time = result.time.from.split('-');
    return (
      <li>
        <div className={styles.time}>
          <em>{time[1]}月</em>
          <div className={styles.bot}>
            <span><b>{time[2].split('T')[0]}</b>日</span>
            <strong>{result.location.city}</strong>
          </div>
        </div>
        <div className={styles.con}>
          <h3>
            <a href='javascript:void(0)' onClick={this.goToDetail.bind(this, result.id)}>
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
  }
}

export default connect(({ seminar }) => ({ seminar }))(ActivityList);
