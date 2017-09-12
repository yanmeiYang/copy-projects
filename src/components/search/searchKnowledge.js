/**
 * Created by yangyanmei on 17/8/31.
 */
import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
// import { compare } from 'utils';
import TopicBarChart from 'components/topicBarChart';
import styles from './searchKnowledge.less';


@connect(({ search }) => ({ search }))
export default class SearchKnowledge extends React.PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'search/getTopicByMention',
      payload: {
        mention: this.props.query,
      },
    });
  }
  // TODO later
  // shouldComponentUpdate(nextProps, nextState) {
  //   return compare(this.props, nextProps, 'topic');
  // }

  render() {
    const topic = this.props.search.topic;
    return (
      <div className={styles.searchKgContent}>
        {
          topic.label && topic.label.toLowerCase() !== 'null' &&
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
        }

      </div>
    );
  }
}
