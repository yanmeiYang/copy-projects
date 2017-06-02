import React from 'react';
import classnames from 'classnames';
import styles from './profile-info.less';
import * as profileUtils from '../../utils/profile_utils';

class ProfileInfo extends React.Component {
  state = {};

  render() {
    const profile = this.props.profile;

    return (
      <div className={classnames(styles.profile_info, 'container-wrong')}>
        <div className={styles.avatar_zone}>
          <img
            src={profileUtils.getAvatar(profile.avatar, '', 160)} className={styles.avatar}
            alt={profile.avatar} title={profile.name_zh}
          />
        </div>

        <div className={styles.info_zone}>
          <div className={styles.title}>
            <h1>{profile.name_zh} {profile.name ? '（' + profile.name + '）' : ''}</h1>

            { false && <span className={styles.rank}>会士</span>}

          </div>
          <div className={styles.spliter} />

          <div>{profileUtils.displayPosition(profile.pos)}</div>
          <div>{profileUtils.displayAff(profile)}</div>

          <div title="TODO only logined in user can see">
            {profile.contact && profile.contact.phone}
          </div>

          <div>{profileUtils.displayEmailSrc(profile)}</div>
          <div>{profile.contact && profile.contact.homepage}</div>
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
