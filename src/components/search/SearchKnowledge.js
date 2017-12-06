/**
 * Created by yangyanmei on 17/8/31.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { config, compare, classnames } from 'utils';
import * as strings from 'utils/strings';
import TopicBarChart from 'components/topicBarChart';
import styles from './SearchKnowledge.less';

// TODO change names.
@connect(({ search }) => ({
  /*query: search.query,*/ topic: search.topic,
  translatedLanguage: search.translatedLanguage,
  translatedText: search.translatedText,
}))
export default class SearchKnowledge extends Component {
  state = { query: '' };

  componentWillMount() {
    this.fetchData(this.props.query);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.translatedLanguage === 2) {
      this.setState({ query: nextProps.translatedText });
    } else {
      this.setState({ query: nextProps.query });
    }
  }

  shouldComponentUpdate(nextProps) {
    return compare(this.props, nextProps, 'topic', 'query', 'translatedLanguage', 'translatedText');
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.query !== this.state.query) {
      this.fetchData(nextState.query);
    }
  }

  fetchData = (query) => {
    const { dispatch } = this.props;
    if (!query) {
      return null;
    }
    const { term, name, org } = strings.destructQueryString(query);
    const fne = strings.firstNonEmpty(term, name, org);
    dispatch({ type: 'search/getTopicByMention', payload: { mention: fne } });
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
