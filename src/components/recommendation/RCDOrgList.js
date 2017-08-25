/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { Link } from 'dva/router';
import { Tag, Tooltip } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';

import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import * as personService from '../../services/person';
import { config } from '../../utils';
import styles from './RCDOrgList.less';
import * as profileUtils from '../../utils/profile-utils';

function clamp(text, length) {
  return text && text.length <= length
    ? text
    : `${text.slice(0, length)}...`;
}

export default class RCDOrgList extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.personLabel = props.personLabel;
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.orgs === this.props.orgs) {
      return false;
    }
    return true;
  }

  render() {
    const { orgs } = this.props;
    console.log('refresh Org list. ');
    return (
      <div className={styles.orgs}>
        <div className={styles.box}>
          {
            orgs && orgs.map((org) => {
              console.log('loop org: ', org.desc);
              return (
                <div key={org.id} className={styles.org}>
                  <div className={styles.titleArea}>
                    <h2 className={styles.title}><Link to="/rcd">{clamp(org.name, 40)}</Link></h2>
                  </div>
                  <div className={styles.desc}>{clamp(org.desc, 50)}</div>
                  <div className={styles.info}>
                    <FD value={org.create_time} />
                  </div>

                  {/*
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
                */}
                </div>

              );
            })
          }
        </div>
      </div>
    );

  }
}
