import React from 'react';
import classnames from 'classnames';
import styles from './information.less';
import * as profileUtils from '../../utils/profile-utils';

class Education extends React.Component {
  state={};
  render() {
    const profile = this.props.profile;
    const education = profile.contact && profile.contact.edu;
  return (
    <div className={classnames(styles.profile_info, 'container-wrong')}>

      <div className={styles.info_zone}>
        <div className={styles.title}><h2><i className="fa fa-graduation-cap fa-fw" /> Education</h2>
        </div>
        <div className={styles.spliter} />
        <div className={styles.expert_basic_info_left}>
          {education && <p> {education} </p>}
        </div>
      </div>
    </div>
  );
 }
}
export default Education;
