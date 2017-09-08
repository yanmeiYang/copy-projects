/**
 *  Created by BoGao on 2017-06-15;
 */
/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'dva/router';
import { Tag, Tooltip } from 'antd';
import classnames from 'classnames';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import ViewExpertInfo from './view-expert-info';
import * as personService from '../../services/person';
import { config } from '../../utils';
import styles from './person-list.less';
import * as profileUtils from '../../utils/profile-utils';
import { PersonRemoveButton } from '../../systems/bole/components';


const DEFAULT_RIGHT_CONTENT = <ViewExpertInfo />;
class PersonList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.personLabel = props.personLabel;
    // this.personRightButton = props.personRightButton;

    // TODO 临时措施，国际化Interest应该从server端入手。
    personService.getInterestsI18N((result) => {
      this.interestsI18n = result;
    });
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.persons === this.props.persons) {
      return false;
    }
    return true;
  }

  render() {
    const { persons, rightZoneFuncs, personRemove } = this.props;
    console.log('refresh person list ');

    const showPrivacy = false;

    return (
      <div className={styles.personList}>
        {
          persons && persons.map((person) => {
            const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
            const pos = profileUtils.displayPosition(person.pos);
            const aff = profileUtils.displayAff(person);

            const phone = showPrivacy && person.contact && person.contact.phone;
            const email = showPrivacy && profileUtils.displayEmailSrc(person);

            // const homepage = person.contact && person.contact.homepage;
            const indices = person.indices;
            const activity_indices = person.activity_indices;
            // const tags = profileUtils.findTopNTags(person, 8);

            const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
            if (sysconfig.PersonList_PersonLink_NewTab) {
              personLinkParams.target = '_blank';
            }

            return (
              <div key={person.id}>
                <div className={styles.person}>
                  <div className={styles.avatar_zone}>
                    <img src={profileUtils.getAvatar(person.avatar, '', 160)}
                         className={styles.avatar} alt={name} title={name} />
                  </div>

                  <div className={styles.info_zone}>
                    <div>
                      {name &&
                      <div className={styles.title}>
                        <h2 className="section_header">
                          <a {...personLinkParams}>{name}</a>
                          {false && <span className={styles.rank}>会士</span>}
                        </h2>
                        {this.personLabel && this.personLabel(person)}
                        {/*{this.personRightButton && this.personRightButton(person)}*/}
                      </div>}
                      <div className={classnames(styles.zone, styles.interestColumn)}>
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

                          {person.num_viewed > 0 &&
                          <span className={styles.views}>
                        <i className="fa fa-eye fa-fw" />{person.num_viewed}&nbsp;
                            <FM id="com.PersonList.label.views" defaultMessage="views" />
                      </span>}

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
                  <div className={styles.person_right_zone}>
                    {
                      (rightZoneFuncs && rightZoneFuncs.length > 0) ? rightZoneFuncs.map((item) => {
                        if (item) {
                          return item(person);
                        } else {
                          return '';
                        }
                      }) : DEFAULT_RIGHT_CONTENT
                    }
                    <div>
                      { personRemove && personRemove(person) }
                    </div>
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

export default PersonList;
