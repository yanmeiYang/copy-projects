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

  componentWillMount() {
    this.fetchData();
  }

  shouldComponentUpdate(nextProps) {
    return compare(this.props, nextProps, 'topic', 'query', 'translatedLanguage', 'translatedText');
  }

  componentDidUpdate(prevProps) {
    // console.log('NOT>>> >>>>   ', this.props.translatedLanguage, this.props.translatedText);
    if (
      (prevProps.query !== this.props.query) ||
      (prevProps.translatedText !== this.props.translatedText
        && this.props.translatedLanguage === 1)
    ) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const { dispatch, query } = this.props;
    if (!strings.cleanQuery(query)) {
      return null;
    }
    // dispatch({ type: 'search/getTopicByMentionSuccess', payload: { data: { data: {} } } });

    // if is translated results, use translated english to fetch.
    const { translatedLanguage, translatedText } = this.props;
    // console.log('NOT>>>', translatedLanguage, translatedText, this.props.topic);
    // (!this.props.topic || !this.props.topic.categories)
    let mention;
    if (translatedLanguage === 2 && translatedText) {
      mention = translatedText;
    } else {
      mention = strings.firstNonEmptyQuery(query);
    }
    dispatch({ type: 'search/getTopicByMention', payload: { mention } });
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
