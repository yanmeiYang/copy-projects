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

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const persons = this.props.persons;

    let hindexSum = 0;
    persons.map((person) => {
      const indices = person.indices;
      if (indices) {
        hindexSum += indices.h_index;
      }
      return null;
    });
    if (!persons || persons.length <= 0) {
      return <div />;
    }
    return (
      <div className="rizPersonInfo">
        <div className="name bg">
          <h2 className="section_header">Cluster of {persons.length} experts.</h2>
        </div>

        <div className="info bg">
          <span>Sum of H-index: {hindexSum}</span>
          <span>Avg of H-index: {hindexSum / persons.length}</span>
        </div>

        <div className="images bg">
          {persons && persons.slice(0, 20).map((person) => {
            const avatarUrl = profileUtils.getAvatar(person.avatar, person.id, 50);

            return (
              <div className="imgBox" key={person.id}>
                <img src={avatarUrl} />
                {/*<div key={person.id}>{person.name}</div>*/}
              </div>
            );
          })}
        </div>

        <div className="info bg">
          Research Interests:
        </div>

      </div>
    );
  }
}

export default connect()(RightInfoZoneCluster);
