/**
 *  Created by BoGao on 2017-06-15;
 */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classnames from 'classnames';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import * as personService from 'services/person';
import { sysconfig } from 'systems';
import { config, compare, hole } from 'utils';
import * as display from 'utils/display';
import { Hole } from 'components';
import { Indices } from 'components/widgets';
import PersonTags from 'components/person/PersonTags';
// import { PersonTags } from 'components/person'; // this is bad.
import ViewExpertInfo from './view-expert-info';
import styles from './person-list.less';

const DefaultRightZoneFuncs = [
  param => <ViewExpertInfo person={param.person} key="1" />,
];

@connect()
export default class PersonList extends Component {
  static propTypes = {
    // className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string, // NOTE: 一般来说每个稍微复杂点的Component都应该有一个className.
    type: PropTypes.string,
    persons: PropTypes.array,
    expertBaseId: PropTypes.string,
    indicesType: PropTypes.string, // ["", text]
    showIndices: PropTypes.array,
    titleRightBlock: PropTypes.func, // A list of function
    rightZoneFuncs: PropTypes.array,
    didMountHooks: PropTypes.array,
    UpdateHooks: PropTypes.array,
    tagsLinkFuncs: PropTypes.func,
  };

  static defaultProps = {
    showIndices: sysconfig.PersonList_ShowIndices,
  };

  constructor(props) {
    super(props);
    this.persons = this.props.persons;
  }

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

  selectedThePerson = (person, e) => {
    console.log('111111111', person);
    console.log(`checked = ${e.target.checked}`);
  };

  render() {
    const { persons, expertBaseId, className, type, indicesType, showIndices } = this.props;
    const { rightZoneFuncs, titleRightBlock, bottomZoneFuncs, afterTitleBlock, tagsLinkFuncs } = this.props;
    const showPrivacy = false;

    return (
      <div className={classnames(styles.personList, className, styles[type])}>
        {!persons &&
        <div className={styles.empty}>
          <FM id="com.KgSearchBox.placeholder" defaultMessage="请输入姓名或者搜索词" />
        </div>}
        {persons && persons.length === 0 &&
        <div className={styles.empty}>
          No Results
          <FM id="com.PersonList.message.noResults" defaultMessage="No Results" />
        </div>}

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
          if (this.props.PersonList_PersonLink_NewTab === true) {
            personLinkParams.target = '_blank';
          }
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
                    <div className={styles.title_zone}>
                      {name &&
                      <div className={styles.title}>
                        <h2 className="section_headerxxx">
                          <a {...personLinkParams}>{name}</a>
                          {false && <span className={styles.rank}>会士</span>}
                        </h2>
                        {afterTitleBlock && afterTitleBlock({ param: { person, expertBaseId } })}
                      </div>}

                      {/* ---- TitleRightBlock ---- */}
                      {titleRightBlock && titleRightBlock({ param: { person, expertBaseId } })}
                    </div>
                    {/*{this.personRightButton && this.personRightButton(person)}*/}
                    <div className={classnames(styles.zone, styles.interestColumn)}>
                      <div className={styles.contact_zone}>
                        <Indices
                          indices={indices}
                          activity_indices={activity_indices}
                          showIndices={showIndices}
                          indicesType={indicesType}
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
                          className="fa fa-eye fa-fw" />{person.num_viewed}
                          <FM id="com.PersonList.label.views" defaultMessage="views" />
                        </span>}

                      </div>

                      {/* ---- Tags ---- */}
                      <PersonTags
                        className={styles.tagZone}
                        tags={person.tags}
                        tagsTranslated={person.tags_translated_zh}
                        tagsLinkFuncs={tagsLinkFuncs}
                        hideBorder
                      />

                    </div>
                  </div>
                </div>

                {/* ---- Right Zone ----
                {hole.fillFuncs(
                  rightZoneFuncs, // theme from config.
                  DefaultRightZoneFuncs, // default block.
                  { person, expertBaseId }, // parameters passed to block.
                  { containerClass: styles.person_right_zone }, // configs.
                )}
                */}

                <Hole
                  fill={rightZoneFuncs}
                  defaults={DefaultRightZoneFuncs}
                  param={{ person, expertBaseId }}
                  config={{ containerClass: styles.person_right_zone }}
                />

              </div>

              {/*---- Bottom Zone ---- */}
              <Hole
                fill={bottomZoneFuncs}
                param={{ person, expertBaseId, user: this.props.user }}
                config={{ containerClass: styles.personComment }}
              />

              {/*{hole.fillFuncs(*/}
              {/*bottomZoneFuncs, [],*/}
              {/*{ person, expertBaseId, user: this.props.user },*/}
              {/*{ containerClass: styles.personComment }, // TODO change name.*/}
              {/*)}*/}
            </div>
          );
        })
        }
      </div>
    );
  }
}
