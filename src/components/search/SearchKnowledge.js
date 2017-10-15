/**
 * Created by yangyanmei on 17/8/31.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { config, compare, classnames } from 'utils';
import TopicBarChart from 'components/topicBarChart';
import styles from './SearchKnowledge.less';

// TODO change names.
@connect(({ search }) => ({ /*query: search.query,*/ topic: search.topic }))
export default class SearchKnowledge extends Component {
  componentWillMount() {
    this.fetchData();
  }

  shouldComponentUpdate(nextProps) {
    return compare(this.props, nextProps, 'topic', 'query');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { dispatch, query } = this.props;
    if (!query) {
      return null;
    }
    dispatch({ type: 'search/getTopicByMention', payload: { mention: query } });
  };

  render() {
    const { topic, className } = this.props;
    if (!topic || topic.length <= 0 || !topic.label || topic.label.toLowerCase() === 'null') {
      return null;
    }
    return (
      <div className={classnames(styles.searchKgContent, className)}>
        {topic.label && topic.label.toLowerCase() !== 'null' &&
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
