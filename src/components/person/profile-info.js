import React from 'react';
import styles from './profile-info.less';
import * as profileUtils from '../../utils/profile_utils';

class ProfileInfo extends React.Component {
  state = {};

  render() {
    // console.log('COMPONENT: ProfileInfo: ', this.props);

    const profile = this.props.profile;

    return (
      <div className={styles.profile_info}>
        <img
          src={profileUtils.getAvatar(profile.avatar, '', 160)} className={styles.avatar}
          alt={profile.avatar} title={profile.name_zh}
        />

        <h1>{profile.name_zh} {profile.name ? '(' + profile.name + ')' : ''}</h1>
        <div>{profileUtils.displayPosition(profile.pos)}</div>
        <div>{profileUtils.displayAff(profile)}</div>

        <div title="TODO only logined in user can see">
          {profile.contact && profile.contact.phone}
        </div>

        <div>{profileUtils.displayEmailSrc(profile)}</div>
        <div>{profile.contact && profile.contact.homepage}</div>

        <div>Radar</div>
        <div>Tags</div>
      </div>
    );
  }
}

export default ProfileInfo;
