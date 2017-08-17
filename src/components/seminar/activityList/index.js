/**
 * Created by yangyanmei on 17/6/21.
 */

import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { sysconfig } from '../../../systems';
import * as auth from '../../../utils/auth';
import { Auth } from '../../../hoc';

@connect(({ seminar, app }) => ({ seminar, app }))
@Auth
export default class ActivityList extends React.Component {
  goToDetail = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/seminar/${id}`,
    }));
  };

  goToRating = (id) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/seminar/expert-rating/${id}`,
    }));
  };

  render() {
    const { result, app } = this.props;
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
            <Link to={`/seminar/expert-rating/${result.id}`}>
              {result.title}
            </Link>
          </h3>
          {auth.isAuthed(app.roles) && !this.props.hidetExpertRating && sysconfig.ShowRating &&
          <Button type="" className={styles.viewTheActivityBtn} size="small"
                  onClick={this.goToRating.bind(this, result.id)}>专家评分</Button>}
          <div className={styles.info}>
            <p>
              <span className={styles.type}>
                  活动类型：{result.category}
              </span>
            </p>
            <p>
              <span>
                <span>承办单位：</span>
                {
                  result.organizer.map((item, index) => {
                    return (
                      <span key={Math.random()}>
                        <span>{item}</span>
                        {index < result.organizer.length - 1 && <span>,&nbsp;</span>}
                      </span>
                    );
                  })
                }
              </span>
            </p>
            <p>
              <span>
                <span>活动标签：</span>
                {
                  result.tags.map((item, index) => {
                    return (
                      <span key={Math.random()}>
                        <span>{item}</span>
                        {index < result.tags.length - 1 && <span>,&nbsp;</span>}
                      </span>
                    );
                  })
                }
              </span>
            </p>
            <p>活动地点：{result.location.address}</p>
          </div>
        </div>
      </li>
    );
  }
}
