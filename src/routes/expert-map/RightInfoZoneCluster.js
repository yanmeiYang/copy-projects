/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import { Tooltip, Icon } from 'antd';
import classnames from 'classnames';
import styles from './RightInfoZoneCluster.less';
import * as profileUtils from '../../utils/profile-utils';
import { HindexGraph } from '../../components/widgets';

let flag = false;

class RightInfoZoneCluster extends React.PureComponent {
  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  showPersonelInfo = (person) => {
    console.log(person);
  };

  showMore = () => {
    if (flag) {
      document.getElementById('images').style.display = 'none';
      document.getElementById('showNum').innerHTML = 'more...';
      flag = false;
    } else {
      document.getElementById('images').style.display = '';
      document.getElementById('showNum').innerHTML = 'less...';
      flag = true;
    }
  };

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
                    <img src={avatarUrl} alt="" onClick={this.showPersonelInfo.bind(this, person)} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.images} id="images" style={{ display: 'none' }}>
          {persons && persons.slice(20, persons.length).map((person) => {
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
                    <img src={avatarUrl} alt="" onClick={this.showPersonelInfo.bind(this, person)} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
        <div style={styles.showMore}>
          <a className="ant-dropdown-link" href="#" onClick={this.showMore} >
            <span id="showNum">more...</span>
          </a>
          <br />
        </div>
        <div className={styles.name}>
          <span alt="" className={classnames('icon', styles.fieldIcon)} />
          研究领域
        </div>
        <div className={styles.keywords}>
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

export default connect()(RightInfoZoneCluster);
