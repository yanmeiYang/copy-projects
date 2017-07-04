/**
 *  Created by BoGao on 2017-06-15;
 */
import React from 'react';
import { routerRedux, Link } from 'dva/router';
import { Tooltip, Tag } from 'antd';
import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import { config } from '../../utils';
import styles from './person-list.less';
import * as profileUtils from '../../utils/profile_utils';
import * as personService from '../../services/person';
import * as pubService from '../../services/publication';

/**
 * @param param
 *
 */
class PersonList extends React.PureComponent {
  state = {};

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.pubs && this.props.pubs) {
  //     if (nextProps.profile.id === this.props.profile.id) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  render() {
    return (
      <div className={styles.personList}>
        {
          this.props.persons.map((person) => {
            const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
            const pos = profileUtils.displayPositionFirst(person.pos);
            const aff = profileUtils.displayAff(person);
            const phone = person.contact && person.contact.phone;
            const email = profileUtils.displayEmailSrc(person);
            const homepage = person.contact && person.contact.homepage;
            const indices = person.indices;
            const tags = findTopNTags(person, 8);

            const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
            if (sysconfig.PersonList_PersonLink_NewTab) {
              personLinkParams.target = '_blank';
            }

            return (
              <div key={person.id} className="item">
                <div className="avatar_zone">
                  <img
                    src={profileUtils.getAvatar(person.avatar, '', 90)}
                    className="avatar"
                    alt={name}
                    title={name}
                  />
                </div>

                <div className="info_zone">
                  {name &&
                  <div className="title">
                    <h2 className="section_header">
                      <a {...personLinkParams}>{name}</a>
                      { false && <span className="rank">会士</span>}
                    </h2>
                  </div>}
                  <div className="zone">
                    <div className="contact_zone">
                      <Indices indices={indices} />

                      {pos && <span><i className="fa fa-briefcase fa-fw" /> {pos}</span>}
                      {aff && <span><i className="fa fa-institution fa-fw" /> {aff}</span>}

                      {phone &&
                      <span style={{ minWidth: '158px' }}>
                        <i className="fa fa-phone fa-fw" /> {phone}
                      </span>}
                      {email &&
                      <span className="email"><i className="fa fa-envelope fa-fw" />
                        <img
                          src={`${config.baseURL}${email}`}
                          alt="email"
                          style={{ verticalAlign: 'middle' }}
                        />
                      </span>
                      }
                    </div>

                    {tags &&
                    <div className="tag_zone">
                      <div>
                        <h4><i className="fa fa-area-chart fa-fw" />研究兴趣:</h4>
                        <div className={styles.tagWrap}>
                          {
                            tags.map((tag) => {
                              return (
                                <Link to={`/search/${tag.t}/0/30`} key={Math.random()}>
                                  <Tag className={styles.tag}>{tag.t}</Tag>
                                </Link>);
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

    // console.log("persons is ", this.props.persons);
  }
}

function findTopNTags(person, n) {
  // let listA = person.tags || [];
  // let listB = person.tags_zh || [];
  // if (sysconfig.PreferredLanguage === 'cn') {
  //   listB = person.tags || [];
  //   listA = person.tags_zh || [];
  // }
  // console.log(person.tags, person.tags_zh);
  // return [...listA.slice(0, n), "---", ...listB.slice(0, n)];
  let tags = [];
  if (sysconfig.PreferredLanguage === 'cn') {
    tags = person.tags_zh ? person.tags_zh.slice(0, n) : null;
  } else {
    tags = person.tags ? person.tags.slice(0, n) : null;
  }
  if (!tags || tags.length === 0) {
    tags = person.tags ? person.tags.slice(0, n) : [];
  }
  return tags;
}


export default PersonList;
