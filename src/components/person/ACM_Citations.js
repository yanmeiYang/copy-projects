import React from 'react';
import classnames from 'classnames';
import * as profileUtils from '../../utils/profile-utils';
import styles from './information.less';

class AcmCitations extends React.Component {
  state={};
  render() {
    const profile = this.props.profile;
    const citation = profileUtils.displayCitation(profile.acm_citations);
    const country = profileUtils.displayCountry(profile.acm_citations);
    const year = profileUtils.displayYear(profile.acm_citations);
  return (
    <div className={classnames(styles.profile_info, 'container-wrong')}>

      <div className={styles.info_zone}>
        <div className={styles.title}><h2><i className="fa fa-book fa-fw" /> ACM Citations</h2>
        </div>
        <div className={styles.spliter} />
        <div className={styles.expert_basic_info_left}>
          {country && year && <p> {country} - {year} </p>}
          {citation && <p className={styles.italic}> {citation} </p>}
        </div>
      </div>
    </div>
  );
 }
}
export default AcmCitations;
