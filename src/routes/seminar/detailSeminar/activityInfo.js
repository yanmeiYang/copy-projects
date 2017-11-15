/**
 * Created by yangyanmei on 17/8/4.
 */
import React from 'react';
import * as seminarService from '../../../services/seminar';
import styles from './index.less';


class ActivityInfo extends React.PureComponent {
  render() {
    const summaryById = this.props.summaryById;
    return (
      <div className={styles.workshopTetail}>
        <h4 className="">
          <strong>
            主题: { summaryById.title }
          </strong>
        </h4>
        <h5>
          {new Date(summaryById.time.from).format('yyyy年MM月dd日')}
        </h5>
        {summaryById.img &&
        <div style={{ textAlign: 'center' }}>
          <img src={summaryById.img} alt="" style={{ width: '80%' }} />
        </div>}
        <p>
          <strong>活动类型: </strong>
          <span>&nbsp;{summaryById.category}</span>
        </p>
        <p>
          <strong>承办单位: &nbsp;</strong>
          {summaryById.organizer.map((item) => {
            return <span key={`${item}_${Math.random()}`}>{seminarService.getValueByJoint(item)} &nbsp;</span>;
          })}
        </p>
        <p>
          <strong>活动地点: </strong>
          {summaryById.location &&
          <span>&nbsp;{summaryById.location.city}</span>}
          {summaryById.location &&
          <span>&nbsp;{summaryById.location.address}</span>}
        </p>
        <p dangerouslySetInnerHTML={{ __html: summaryById.abstract.replace(/\n/g, '<br />') }} />
        <hr />
      </div>
    );
  }
}
export default (ActivityInfo);
