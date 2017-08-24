/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { Link } from 'dva/router';
import { Tag, Tooltip } from 'antd';
import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import * as personService from '../../services/person';
import { config } from '../../utils';
import styles from './RCDOrgList.less';
import * as profileUtils from '../../utils/profile-utils';

export default class RCDOrgList extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.personLabel = props.personLabel;
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.persons === this.props.persons) {
      return false;
    }
    return true;
  }

  render() {
    const { persons } = this.props;
    console.log('refresh person list ');
    return (
      <div className={styles.personList}>
        {
          persons && persons.map((person) => {
            const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
            const pos = profileUtils.displayPositionFirst(person.pos);
            const aff = profileUtils.displayAff(person);
            const phone = person.contact && person.contact.phone;
            const email = profileUtils.displayEmailSrc(person);
            // const homepage = person.contact && person.contact.homepage;
            const indices = person.indices;
            const activity_indices = person.activity_indices;
            // const tags = profileUtils.findTopNTags(person, 8);

            const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
            if (sysconfig.PersonList_PersonLink_NewTab) {
              personLinkParams.target = '_blank';
            }

            return (
              <div key={person.id} className={styles.person}>
                <div className={styles.avatar_zone}>
                  <img src={profileUtils.getAvatar(person.avatar, '', 90)}
                       className={styles.avatar} alt={name} title={name} />
                </div>

                <div className={styles.info_zone}>
                  {name &&
                  <div className={styles.title}>
                    <h2 className="section_header">
                      <a {...personLinkParams}>{name}</a>
                      {false && <span className={styles.rank}>会士</span>}
                    </h2>
                    {this.personLabel && this.personLabel(person)}
                  </div>}
                  <div className={styles.zone}>
                    <div className={styles.contact_zone}>
                      <Indices
                        indices={indices}
                        activity_indices={activity_indices}
                        showIndices={sysconfig.PersonList_ShowIndices}
                      />
                      {pos && <span><i className="fa fa-briefcase fa-fw" /> {pos}</span>}
                      {aff && <span><i className="fa fa-institution fa-fw" /> {aff}</span>}

                      {phone &&
                      <span style={{ minWidth: '158px' }}>
                        <i className="fa fa-phone fa-fw" /> {phone}
                      </span>
                      }
                      {email &&
                      <span style={{ backgroundImage: `url(${config.baseURL}${email})` }}
                            className="email"><i className="fa fa-envelope fa-fw" />
                      </span>
                      }
                    </div>

                    {person.tags &&
                    <div className={styles.tag_zone}>
                      <div>
                        <h4><i className="fa fa-area-chart fa-fw" /> 研究兴趣:</h4>
                        <div className={styles.tagWrap}>
                          {
                            person.tags.slice(0, 8).map((item) => {
                              if (item.t === null || item.t === 'Null') {
                                return false;
                              } else {
                                const tag = personService.returnKeyByLanguage(this.interestsI18n, item.t);
                                const showTag = tag.zh !== '' ? tag.zh : tag.en;
                                return (
                                  <span key={Math.random()}>
                                    {tag.zh ? <Tooltip placement="top" title={tag.en}>
                                      <Link
                                        to={`/${sysconfig.SearchPagePrefix}/${showTag}/0/${sysconfig.MainListSize}`}
                                        key={Math.random()}>
                                        <Tag className={styles.tag}>{showTag}</Tag>
                                      </Link>
                                    </Tooltip> : <Link
                                      to={`/${sysconfig.SearchPagePrefix}/${showTag}/0/${sysconfig.MainListSize}`}
                                      key={Math.random()}>
                                      <Tag className={styles.tag}>{showTag}</Tag>
                                    </Link>}
                                  </span>
                                );
                              }
                            })
                          }
                        </div>
                      </div>
                    </div>
                    }

                  </div>
                </div>

              </div>
            );
          })
        }
      </div>
    );

  }
}
