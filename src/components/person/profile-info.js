import React from 'react';
import classnames from 'classnames';
import styles from './profile-info.less';
import * as profileUtils from '../../utils/profile_utils';
import { VisResearchInterest } from '../../routes/vis';

class ProfileInfo extends React.Component {
  state = {};

  render() {
    const profile = this.props.profile;
    const name = profileUtils.displayNameCNFirst(profile.name, profile.name_zh);
    const pos = profileUtils.displayPosition(profile.pos);
    const aff = profileUtils.displayAff(profile);
    const phone = profile.contact && profile.contact.phone;
    const email = profileUtils.displayEmailSrc(profile);
    const homepage = profile.contact && profile.contact.homepage;

    return (
      <div className={classnames(styles.profile_info, 'container-wrong')}>
        <div className={styles.avatar_zone}>
          <img
            src={profileUtils.getAvatar(profile.avatar, '', 160)} className={styles.avatar}
            alt={profile.avatar} title={profile.name_zh}
          />
        </div>

        <div className={styles.info_zone}>
          {name &&
          <div className={styles.title}>
            <h1>{name}</h1>
            { false && <span className={styles.rank}>会士</span>}
          </div>}
          {name && <div className={styles.spliter} />}

          {pos && <span><i className="fa fa-briefcase fa-fw" /> {pos}</span>}
          {aff && <span><i className="fa fa-institution fa-fw" /> {aff}</span>}
          {phone && <span><i className="fa fa-phone fa-fw" /> {phone}</span>}
          {email && <span><i className="fa fa-envelope fa-fw" /> {email}</span>}
          {homepage && <span><i className="fa fa-globe fa-fw" /> {homepage}</span>}

          <span style={{ marginTop: 16 }} />
          <span className={styles.section_title}><i className="fa fa-area-chart fa-fw" /> 研究兴趣</span>
          <VisResearchInterest personId={profile.id} />

        </div>

        { false && <div>
          <div>Radar</div>
          <div>Tags</div>
        </div>
        }

      </div>
    );
  }
}

export default ProfileInfo;
