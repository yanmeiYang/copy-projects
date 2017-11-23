import React from 'react';
import classnames from 'classnames';
import styles from './information.less';
import * as profileUtils from '../../utils/profile-utils';

class Bio extends React.Component {
  state={};
  render() {
    const profile = this.props.profile;
    const bio = profile.contact && profile.contact.bio;
    let newBio = [];
    if (profile.contact && profile.contact.bio) {
      newBio = bio.split('<br />');
    }
  return (
    <div className={classnames(styles.profile_info, 'container-wrong')}>

      <div className={styles.info_zone}>
        <div className={styles.title}><h2><i className="fa fa-user fa-fw" /> Bio</h2>
          <span className={styles.rank}><i className="fa fa-edit fa-fw" /></span>
        </div>
        <div className={styles.spliter} />
        <div className={styles.expert_basic_info_left}>
          {bio &&
          <div>
              {newBio.map((item) => {
                return <div>
                  <p>{item} </p>
                  <br/>
                </div>;
              })}
          </div>
          }
        </div>
      </div>
    </div>
  );
 }
}
export default Bio;
