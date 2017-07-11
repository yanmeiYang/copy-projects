/**
 * Created by yangyanmei on 17/6/21.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { Button } from 'antd'
import { connect } from 'dva';
import styles from  './index.less';

class ActivityList extends React.Component {
  goToDetail = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/seminar/${id}`,
    }));
  };

  goToRating = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/seminar/expert-rating/${id}`,
    }))
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
          {this.props.app.roles.admin &&
          <Button type='' className={styles.viewTheActivityBtn} size='small'
                  onClick={this.goToRating.bind(this, result.id)}>专家评分</Button>}
          <div className={styles.info}>
            <p>
              <span className={styles.type}>
                  活动类型：{result.category}
                </span>
              <span>
                <span>承办单位：</span>
                {
                  result.organizer.map((item, index) => {
                    return (<span key={Math.random()}>
                      <span>{item}</span>
                      {index < result.organizer.length - 1 && <span>,&nbsp;</span>}
                    </span>)
                  })
                }
              </span>
            </p>
            <p className={styles.location}>活动地点：{result.location.address}</p>
          </div>
        </div>
      </li>
    )
  }
}

export default connect(({ seminar, app }) => ({ seminar, app }))(ActivityList);
