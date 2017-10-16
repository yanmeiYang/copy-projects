/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import styles from './LeftInfoZoneCluster.less';
import * as profileUtils from '../../utils/profile-utils';
import { HindexGraph } from '../../components/widgets';

class LeftInfoZoneCluster extends React.PureComponent {
  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const persons = this.props.persons;
    if (!persons || persons.length <= 0) {
      return <div />;
    }

    let hindexSum = 0;
    const interests = {};
    persons.map((person) => {
      const indices = person.indices;
      // sum hindex
      if (indices) {
        hindexSum += indices.h_index;
      }
      persons.sort((a, b) => b.indices.h_index - a.indices.h_index);
      // interests
      if (person.tags && person.tags.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count + 1;
          return null;
        });
      }
      if (person.tags_zh && person.tags_zh.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count + 1;
          return null;
        });
      }
      if (person.tags_zh && person.tags_zh && person.tags_zh.length > 0) {
        person.tags.map((tag) => {
          const count = interests[tag.t] || 0;
          interests[tag.t] = count - 1;
          return null;
        });
      }
      return null;
    });

    // sort interests.
    let sortedInterest = Object.keys(interests).map((tag) => {
      return { key: tag, count: interests[tag] };
    });
    sortedInterest = sortedInterest.sort((a, b) => b.count - a.count);
    // TODO 人头按Hindex排序。
    // TODO 显示Hindex分段.
    const avg = (hindexSum / persons.length).toFixed(0);
    return (
      <div className={styles.rizCluster}>
        {/*<div className="name bg">*/}
        {/*<h2 className="section_header">Cluster of {persons.length} experts.</h2>*/}
        {/*</div>*/}
        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.titleIcon)} />
          H-index分布
        </div>

        <div className={styles.hindexInfo}>
          <HindexGraph persons={persons} avg={avg} />
        </div>

        {/* images*/}
        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.expertIcon)} />
          专家&nbsp;
          <span className={styles.statistics}>(&nbsp;
            <span className={styles.count}>{persons.length}</span>
            人 )</span>
        </div>
        <div className={styles.images}>
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            const tooltip = (
              <div className={styles.tooltip}>
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className={styles.imgOuter}>
                <div className={styles.imgBox}>
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.fieldIcon)} />
          研究领域
          {/*<span className={styles.statistics}>(&nbsp;*/}
          {/*<sapn className={styles.count}>{persons.length}</sapn>*/}
          {/*人 )*/}
          {/*</span>*/}
        </div>

        <div className={styles.keywords}>
          {/*<h4 className="section_header"> Research Interests: </h4>*/}
          {sortedInterest && sortedInterest.slice(0, 20).map((interest) => {
            return (
              <div key={interest.key}>{interest.key} ({interest.count})</div>
            );
          })}
        </div>

      </div>
    );
  }
}

export default connect()(LeftInfoZoneCluster);
