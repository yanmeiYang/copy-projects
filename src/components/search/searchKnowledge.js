/**
 * Created by yangyanmei on 17/8/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import TopicBarChart from '../../components/topicBarChart';
import styles from './searchKnowledge.less';


@connect()
export default class SearchKnowledge extends React.PureComponent {
  render() {
    const topic = this.props.topic;
    return (
      <div className={styles.searchKgContent}>
        <div className={styles.innerBox}>
          <h2>
            <strong>{topic.label}</strong>
            {topic.label_zh && <span>&nbsp; ({topic.label_zh})</span>}
            <hr className={styles.hrStyle} />
          </h2>
          <h4 className={styles.subTitleColor}>
            <strong>
              <Icon type="line-chart" /> &nbsp;
              Popularity Over Time:
            </strong>
          </h4>

          <TopicBarChart topic={topic} />

          {topic.desc &&
          <h4 className={styles.subTitleColor}>
            <strong>
              <Icon type="book" />&nbsp;
              Description:
            </strong>
          </h4>}
          {topic.desc && <p>{topic.desc}</p>}
          {topic.desc_zh && <p>{topic.desc_zh}</p>}
        </div>
      </div>
    );
  }
}
