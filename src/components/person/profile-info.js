import React from 'react';
import classnames from 'classnames';
import styles from './profile-info.less';
import { Indices } from '../../components/widgets';
import * as profileUtils from '../../utils/profile-utils';
import * as personService from '../../services/person';
import { VisResearchInterest } from '../../routes/vis';
import { sysconfig } from 'systems';
import ViewExpertInfo from '../../components/person/view-expert-info';

class ProfileInfo extends React.Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.profile && this.props.profile) {
      if (nextProps.profile.id === this.props.profile.id) {
        return false;
      }
    }
    return true;
  }

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
            {false && <span className={styles.rank}>会士</span>}
            {true &&
            <a
              href={personService.getAMinerProfileUrl(profile.name, profile.id)}
              target="_blank" rel="noopener noreferrer"
            >
              <span className={styles.rank}>
                更多 <i className="fa fa-share" aria-hidden="true"></i>
              </span>
            </a>}
          </div>}
          {name && <div className={styles.spliter} />}
          <div className={styles.expert_basic_info}>
            <div className={styles.expert_basic_info_left}>
              {profile && profile.indices &&
              <Indices indices={profile.indices} activity_indices={this.props.activity_indices}
                       showIndices={sysconfig.PersonList_ShowIndices} />
              }

              {pos && <p> <i className="fa fa-briefcase fa-fw" /> {pos}</p>}
              {aff && <p> <i className="fa fa-institution fa-fw" /> {aff}</p>}
              {phone && <p> <i className="fa fa-phone fa-fw" /> {phone}</p>}
              {email &&
              <p>
                <i className="fa fa-envelope fa-fw" />
                <img className="emailImg" src={`${email}`} alt="email"
                     style={{ verticalAlign: 'middle' }} />
              </p>}
              {homepage &&
              <p className="hp">
                <a href={homepage} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-globe fa-fw" /> {homepage}
                </a>
              </p>
              }
              <span style={{ marginTop: 16 }} />
              <p className="section_header"> <i className="fa fa-area-chart fa-fw" /> 研究兴趣</p>
              <VisResearchInterest personId={profile.id} disable_vis_chart={true} />
            </div>
            <div>
              <ViewExpertInfo person={profile} />
            </div>
          </div>
          {/* TODO 这里放一个可以手工添加修改的tabs. */}

        </div>
        {/*{console.log('=========', profile)}*/}
        {false && <div>
          <div>Radar</div>
          <div>Tags</div>
        </div>
        }

      </div>
    );
  }
}

export default ProfileInfo;
