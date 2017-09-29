import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import styles from './TopicRightInfo.less';
import * as profileUtils from '../../utils/profile-utils';

class TopicRightInfo extends React.PureComponent {
  componentDidMount() {
  }

  render() {
    const trend = this.props.trend;
    return (
      <div className={styles.scrollable}>
        <div className={styles.border}>
          <div className={styles.name}>
            <span alt="" className={classnames('icon', styles.expertIcon)} />
            重要专家
          </div>
          <div className={styles.images}>
            {trend.person && trend.person.slice(0, 20).map((person) => {
              const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);
              const url = `https://aminer.org/profile/${person.id}`;
              return (
                <div key={person.id} className={styles.imgOuter}>
                  <div className={styles.imgBox}>
                    <a href={url} target="_blank"><img src={avatarUrl} alt="" /></a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.name}>
            <br />
            <span alt="" className={classnames('icon', styles.fieldIcon)} />
            重要论文
          </div>
          <div>
            {trend.paper && trend.paper.map((paper, i) => {
              const url = `https://aminer.org/archive/${paper.id}`;
              return (
                <div key={paper.id} className={styles.paper}>
                  <div>
                    <a href={url} target="_blank" className={styles.title}>({i + 1}) {paper.title}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(TopicRightInfo);
