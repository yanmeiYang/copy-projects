/**
 *  Created by BoGao on 2017-07-16;
 */
import React from 'react';
import { connect } from 'dva';
import styles from './RightInfoZoneCluster.less';
import * as profileUtils from '../../utils/profile_utils';


class RightInfoZoneCluster extends React.PureComponent {

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
      // console.log(person);
      const indices = person.indices;
      // sum hindex
      if (indices) {
        hindexSum += indices.h_index;
      }
      for (let i = 0; i < persons.length; i++) {
        for (let j = persons.length - 1; j > i; j--) {
          if (persons[j].indices.h_index > persons[j - 1].indices.h_index) {
            const temp = persons[j];
            persons[j] = persons[j - 1];
            persons[j - 1] = temp;
          }
        }
      }
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
      <div className="rizPersonInfo">
        <div className="name bg">
          <h2 className="section_header">Cluster of {persons.length} experts.</h2>
        </div>

        <div className="info bg">
          <span>Sum of H-index: {hindexSum}</span>
          <span>Avg of H-index: {(hindexSum / persons.length).toFixed(0)}</span>
        </div>

        <div className="images bg">
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            return (
              <div key={person.id} className="imgOuter">
                <div className="imgBox">
                  <img src={avatarUrl} />
                  {/* <div key={person.id}>{person.name}</div>*/}
                </div>
                <div className="tooltip">
                  {person.name}<br />
                  Hindex:{person.indices && person.indices.hindex }
                </div>
              </div>
            );
          })}
        </div>

        <div className="info bg">
          Research Interests:
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

export default connect()(RightInfoZoneCluster);
