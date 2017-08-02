/**
 * Created by yangyanmei on 17/7/20.
 */
import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const CommitteeColor = '3px outset #ff7f0e';
const DivisionColor = '3px outset #1f77b4';

class NewActivityList extends React.Component {
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
    const { result, style, app } = this.props;
    const timeFrom = new Date(result.time.from);
    const timeTo = new Date(result.time.to);
    if (result.organizer.length > 0) {
      style.borderLeft = result.organizer[0].includes('专业委员会') ? CommitteeColor : DivisionColor;
    }
    let expertRating;
    if (app.roles.admin) {
      expertRating = true;
    } else if (app.roles.role[0] && app.roles.role[0].includes('专员') && app.roles.role[0].includes(result.category)) {
      expertRating = true;
    } else {
      expertRating = app.roles.authority.includes(result.organizer[0]);
    }
    return (
      <div className={styles.seminar_item} style={style}>
        <div className={styles.seminar_title}>
          <h2>
            <Link to={`/seminar/${result.id}`}>
              {result.title}
            </Link>
          </h2>
          <div>
            {expertRating && !JSON.parse(this.props.hidetExpertRating) &&
            <Button type="primary" className={styles.viewTheActivityBtn} size="small"
                    onClick={this.goToRating.bind(this, result.id)}>专家评分</Button>}
          </div>
        </div>
        <div className={styles.seminar_message}>
          <div>
            <p>活动类型：{result.category}</p>
            <p>活动时间：{timeFrom.format('yyyy年MM月dd日')}
              {timeFrom.getDate() < timeTo.getDate() &&
              <span>~ {timeTo.getDate()}日</span>}
            </p>
            <p>活动地点：{result.location.city} {result.location.address}</p>
          </div>
          <div>
            <div className={styles.seminar_orgAndTag}>
              <div>承办单位：</div>
              <div>
                {
                  result.organizer.map((item) => {
                    return (
                      <p key={Math.random()}>
                        <span>{item}</span>
                      </p>
                    );
                  })
                }
              </div>
            </div>
            {result.tags.length > 0 &&
            <div className={styles.seminar_orgAndTag}>
              <div>活动标签：</div>
              <div>
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
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ seminar, app }) => ({ seminar, app }))(NewActivityList);
