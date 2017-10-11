/**
 *  Created by BoGao on 2017-06-15;
 */
/* eslint-disable camelcase */
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Tag, Tooltip } from 'antd';
import classnames from 'classnames';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import * as personService from 'services/person';
import { PersonComment } from 'systems/bole/components';
import { sysconfig } from 'systems';
import { config, compare } from 'utils';
import * as display from 'utils/display';
import * as profileUtils from 'utils/profile-utils';
import { Indices } from 'components/widgets';
import ViewExpertInfo from './view-expert-info';
import styles from './person-list.less';

const DefaultRightZoneFuncs = [
  param => <ViewExpertInfo person={param.person} key="1" />,
];

// FIXME 呵呵哒，personComment并不是默认的functions.
const DefaultBottomZoneFuncs = [];

@connect()
export default class PersonList extends PureComponent {
  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string, // NOTE: 一般来说每个稍微复杂点的Component都应该有一个className.
    persons: PropTypes.array,
    expertBaseId: PropTypes.string,
    titleRightBlock: PropTypes.func, // A list of function
    rightZoneFuncs: PropTypes.array,
    didMountHooks: PropTypes.array,
    UpdateHooks: PropTypes.array,
  };


  constructor(props) {
    super(props);
    // TODO 临时措施，国际化Interest应该从server端入手。
    personService.getInterestsI18N((result) => {
      this.interestsI18n = result;
    });
    this.persons = this.props.persons;
  }

  state = {};

  // 暂时没用到
  componentDidMount() {
    const { didMountHooks, persons } = this.props;
    if (didMountHooks && didMountHooks.length > 0) {
      for (const hook of didMountHooks) {
        if (hook) {
          hook({ param: { dispatch: this.props.dispatch, persons } });
        }
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return compare(this.props, nextProps, 'persons');
  }

  componentWillUpdate(nextProps) {
    const { UpdateHooks, persons, dispatch } = nextProps;
    if (UpdateHooks && UpdateHooks.length > 0) {
      for (const hook of UpdateHooks) {
        if (hook) {
          hook({ param: { dispatch, persons, expertBaseId: this.props.expertBaseId } });
        }
      }
    }
  }

  render() {
    const { persons, expertBaseId, user } = this.props;
    const { rightZoneFuncs, titleRightBlock, bottomZoneFuncs, afterTitleBlock } = this.props;

    const showPrivacy = false;
    const RightZoneFuncs = rightZoneFuncs || DefaultRightZoneFuncs;
    const BottomZoneFuncs = bottomZoneFuncs || DefaultBottomZoneFuncs;
    console.log('refresh person list ,', persons);

    return (
      <div className={styles.personList}>
        {persons && persons.length === 0 &&
        <div className={styles.empty}>No Results</div>
        }

        {persons && persons.map((person) => {
          const profile = person.profile || {};
          const name = display.personName(person.name, person.name_zh, sysconfig.Locale);
          const pos = profile.position;
          const aff = display.localValue(sysconfig.Locale, profile.affiliation, profile.affiliation_zh);

          const phone = showPrivacy && profile.phone;
          const email = showPrivacy && profile.email;

          // go into
          const indices = person.indices;
          const activity_indices = {}; // TODO use
          // const tags = profileUtils.findTopNTags(person, 8);

          const personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
          if (sysconfig.PersonList_PersonLink_NewTab) {
            personLinkParams.target = '_blank';
          }

          return (
            <div key={person.id}>
              <div className={styles.person}>
                <div className={styles.avatar_zone}>
                  <img src={display.personAvatar(person.avatar, '', 160)}
                       className={styles.avatar} alt={name} title={name} />
                </div>
                <div className={styles.info_zone}>
                  <div className={styles.info_zone_detail}>
                    {name &&
                    <div className={styles.title}>
                      <h2 className="section_header">
                        <a {...personLinkParams}>{name}</a>
                        {false && <span className={styles.rank}>会士</span>}
                      </h2>
                      {afterTitleBlock && afterTitleBlock({ param: { person, expertBaseId } })}
                    </div>}

                    {/* ---- TitleRightBlock ---- */}
                    {titleRightBlock && titleRightBlock({ param: { person, expertBaseId } })}
                    {/*{this.personRightButton && this.personRightButton(person)}*/}
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
                        <span style={{ minWidth: '158px' }}><i
                          className="fa fa-phone fa-fw" /> {phone}</span>
                        }

                        {email &&
                        <span style={{ backgroundImage: `url(${config.baseURL}${email})` }}
                              className="email"><i className="fa fa-envelope fa-fw" />
                        </span>
                        }

                        {false && person.num_viewed > 0 &&
                        <span className={styles.views}><i
                          className="fa fa-eye fa-fw" />{person.num_viewed} <FM
                          id="com.PersonList.label.views" defaultMessage="views" /></span>}

                      </div>

                      {person.tags &&
                      <div className={styles.tag_zone}>
                        <div>
                          <h4><i className="fa fa-area-chart fa-fw" /> 研究兴趣:</h4>
                          <div className={styles.tagWrap}>
                            {person.tags.slice(0, 8).map((item, idx) => {
                              if (item.t === null || item.t === 'Null') {
                                return false;
                              } else {
                                // const tag = personService.returnKeyByLanguage(this.interestsI18n, item.t);
                                const tag = { en: item };
                                const showTag = tag.zh ? tag.zh : tag.en;
                                const key = `${showTag}_${idx}`;
                                const linkJSX = (
                                  <Link
                                    to={`/${sysconfig.SearchPagePrefix}/${showTag}/0/${sysconfig.MainListSize}`}>
                                    <Tag className={styles.tag}>{showTag}</Tag>
                                  </Link>
                                );
                                return (
                                  <span key={key}>
                                    {tag.zh ?
                                      <Tooltip placement="top" title={tag.en}>{linkJSX}</Tooltip>
                                      : linkJSX}
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
              </div>

              {/* ---- Right Zone ---- */}
              {RightZoneFuncs && RightZoneFuncs.length > 0 &&
              <div className={styles.person_right_zone}>
                {RightZoneFuncs.map((blockFunc) => {
                  const param = { person, expertBaseId };
                  return blockFunc ? blockFunc({ param }) : false;
                })}
              </div>
              }

              {/* ---- Bottom Zone ---- */}
              {/*{BottomZoneFuncs && BottomZoneFuncs.length > 0 &&*/}
              {/*<div className={styles.personComment}>*/}
              {/*{BottomZoneFuncs.map((bottomBlockFunc) => {*/}
              {/*const param = { person, expertBaseId, user };*/}
              {/*return bottomBlockFunc ? bottomBlockFunc(param) : false;*/}
              {/*})}*/}
              {/*</div>*/}
              {/*}*/}
            </div>
          );
        })
        }
      </div>
    );
  }
}
