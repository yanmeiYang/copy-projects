/**
 * Created by yangyanmei on 17/8/31.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
// import { compare } from 'utils';
import TopicBarChart from 'components/topicBarChart';
import styles from './searchKnowledge.less';


@connect(({ search }) => ({ search }))
export default class SearchKnowledge extends Component {
  componentWillMount() {
    // this.props.dispatch({
    //   type: 'search/getTopicByMention',
    //   payload: {
    //     mention: this.props.query,
    //   },
    // });
    // console.log('=======00981',);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.search.query !== this.props.search.query) {
      return true;
    }
    if (nextProps.search.topic !== this.props.search.topic) {
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps) {
    // if (nextProps.query !== this.props.query) {
    //   console.log('=======00983', );
    //   this.props.dispatch({
    //     type: 'search/getTopicByMention',
    //     payload: {
    //       mention: nextProps.query,
    //     },
    //   });
    //   console.log('=======00984', );
    // }
  }


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
