/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import { Tooltip } from 'antd';
import styles from './LeftLineInfoCluster.less';
import * as profileUtils from '../../utils/profile-utils';
import { HindexGraph } from '../../components/widgets';

class LeftLineInfoCluster extends React.PureComponent {

  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  render() {
    const persons = this.props.persons;
    const from = this.props.from;
    const to = this.props.to;
    console.log("--------------=============",from,to)
    if (!persons || persons.length <= 0) {
      return <div />;
    }

    let hindexSum = 0;
    const interests = {};
    persons.map((person) => {
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
    return (
      <div className={styles.rizCluste} >
        <div className={styles.name_bg}>
          <h2 className={styles.section_header}>Cluster of {persons.length} experts.</h2>
        </div>

        <div className={styles.info_bg}>
          <div><h3>From: </h3><div><h4>{from}</h4></div></div>
          <div><h3>To: </h3><div><h4>{to}</h4></div></div>
        </div>

        <div className={styles.info}>
          <HindexGraph persons={persons} />
        </div>

        <div className={styles.info_images} style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} >
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            const tooltip = (
              <div className="tooltip">
                {person.name}<br />
                Hindex: {person.indices && person.indices.h_index}
              </div>);
            return (
              <div key={person.id} className="imgOuter">
                <div className="imgBox">
                  <Tooltip title={tooltip}>
                    <img src={avatarUrl} />
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        <div className="info bg" style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          <h4 className="section_header"> Research Interests: </h4>
          {sortedInterest && sortedInterest.slice(0, 20).map((interest) => {
            return (
              <span key={interest.key}>{interest.key} ({interest.count})</span>
            );
          })}
        </div>

      </div>
    );
  }
}

export default connect()(LeftLineInfoCluster);
