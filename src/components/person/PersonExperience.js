import React from 'react';
import classnames from 'classnames';
import styles from './information.less';

class Experience extends React.Component {
  state={};
  render() {
  return (
    <div className={classnames(styles.profile_info, 'container-wrong')}>

      <div className={styles.info_zone}>
        <div className={styles.title}><h2><i className="fa fa-briefcase fa-fw" /> Experience</h2>
          <span className={styles.rank}>Add experience</span>
        </div>
        <div className={styles.spliter} />
      </div>
    </div>
  );
 }
}
export default Experience;
