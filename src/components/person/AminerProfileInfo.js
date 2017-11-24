import React from 'react';
import classnames from 'classnames';
import styles from './AminerProfileInfo.less';
import { Indices } from '../../components/widgets';
import { Button } from 'antd';
import * as profileUtils from '../../utils/profile-utils';
import * as personService from '../../services/person';
import { VisResearchInterest } from '../../routes/vis';
import { sysconfig } from '../../systems';
import ViewExpertInfo from '../../components/person/view-expert-info';

class AminerProfileInfo extends React.Component {
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
    const name = profileUtils.displayNameCNFirst(profile.name_zh, profile.name);
    const pos = profileUtils.displayPosition(profile.pos);
    const aff = profileUtils.displayAff(profile);
    const phone = profile.contact && profile.contact.phone;
    const email = profileUtils.displayEmailSrc(profile);
    const homepage = profile.contact && profile.contact.homepage;
    const links = profile.links;

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
            <h1>{name}<i className="fa fa-check-circle-o fa-fw" /></h1>
            <span className={styles.rank}>
              <Button type="primary">
                <i className="fa fa-user-plus" /> Follow
              </Button>
            </span>
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
                <img className="emailImg" src={`https://api.aminer.org/api/${email}`} alt="email"
                     style={{ verticalAlign: 'middle' }} />
              </p>}
              {homepage &&
              <p className="hp">
                <a href={homepage} target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-globe fa-fw" /> {homepage}
                </a>
              </p>
              }
              <div className={styles.sec_header}>
                <span> <i className="fa fa-external-link-square fa-fw" />External Links</span>
                <span>
                  <Button size="small">
                    <i className="fa fa-edit fa-fw" /> Update
                  </Button>
                </span>
              </div>
              <div className={styles.linksZone}>
                {links && links.map((item) => {
                  if (item.url) {
                    switch (item.type) {
                      case 'gs':
                        return <span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <span className="fa-stack">
                            <i className="fa fa-circle fa-stack-2x" />
                            <i className="fa fa-graduation-cap fa-stack-1x fa-inverse" />
                          </span>
                          </a>
                        </span>;
                      case 'vl':
                        return <span>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <span className="fa-stack">
                               <i className="fa fa-circle fa-stack-2x" />
                               <i className="fa fa-youtube-play fa-stack-1x fa-inverse" />
                          </span>
                          </a>
                        </span>;
                      default:
                        return <span />;
                    }
                  }
                })}
              </div>
              <div style={{ marginTop: 10 }} />
              <p className="section_header"> <i className="fa fa-area-chart fa-fw" /> Research Interests</p>
              <VisResearchInterest personId={profile.id} disable_vis_chart={true} />
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

export default AminerProfileInfo;
