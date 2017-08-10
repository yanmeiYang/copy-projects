/**
 *  Created by BoGao on 2017-06-15;
 */
import React from 'react';
import { Link } from 'dva/router';
import { Tag } from 'antd';
import { Indices } from '../../components/widgets';
import { sysconfig } from '../../systems';
import * as personService from '../../services/person';
import { config } from '../../utils';
import styles from './person-list.less';
import * as profileUtils from '../../utils/profile-utils';

/**
 * @param param
 *
 */
class PersonList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.personLabel = props.personLabel;
  }

  state = { interestsI18n: {} };

  componentWillMount() {
    personService.getInterestsI18N((result) => {
      this.setState({ interestsI18n: result });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.persons === this.props.persons) {
      return false;
    }
    return true;
  }

  render() {
    console.log('refresh person list ');
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
            const activity_indices = person.activity_indices;
            // const tags = profileUtils.findTopNTags(person, 8);

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
                      {false && <span className="rank">会士</span>}
                    </h2>
                    {this.personLabel && this.personLabel(person)}
                  </div>}
                  <div className="zone">
                    <div className="contact_zone">
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
                      <span className="email"
                            style={{ backgroundImage: `url(${config.baseURL}${email})` }}>
                        <i className="fa fa-envelope fa-fw" />
                      </span>
                      }
                    </div>

                    {person.tags &&
                    <div className="tag_zone">
                      <div>
                        <h4><i className="fa fa-area-chart fa-fw" /> 研究兴趣:</h4>
                        <div className={styles.tagWrap}>
                          {
                            person.tags.slice(0, 8).map((item) => {
                              if (item.t === null || item.t === 'Null') {
                                return;
                              } else {
                                const tag = personService.returnKeyByLanguage(this.state.interestsI18n, item.t);
                                return (
                                  <Link
                                    to={`/${sysconfig.SearchPagePrefix}/${tag}/0/${sysconfig.MainListSize}`}
                                    key={Math.random()}>
                                    <Tag className={styles.tag}>{tag}</Tag>
                                  </Link>);
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

    // console.log("persons is ", this.props.persons);
  }
}

export default PersonList;
