/**
 *  Created by BoGao on 2017-06-15;
 */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'engine';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import { sysconfig } from 'systems';
import { config, compare } from 'utils';
import * as display from 'utils/display';
import { Hole } from 'components/core';
import { Indices } from 'components/widgets';
// import { PersonTags } from 'components/person'; // TODO this is bad. WHY
import { PersonTags, ViewExpertInfo } from 'components/person/widgets';
import styles from './PersonList.less';

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
    emptyPlaceHolder: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),

    // zones
    titleRightBlock: PropTypes.func, // A list of function
    rightZoneFuncs: PropTypes.array,
    // content: PropTypes.array, // TODO...
    contentBottomZone: PropTypes.array,

    // others:
    tagsLinkFuncs: PropTypes.func,
    UpdateHooks: PropTypes.array,
    didMountHooks: PropTypes.array,
  };

  static defaultProps = {
    showIndices: sysconfig.PersonList_ShowIndices,
    emptyPlaceHolder: (
      <FM id="com.KgSearchBox.placeholder" defaultMessage="请输入姓名或者搜索词" />
    ),
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
    console.log(`checked = ${e.target.checked}`);
  };

  defaultZones = {
    contentBottomZone: [({ person }) => (
      <PersonTags
        key={0}
        className={styles.tagZone}
        tags={person.tags}
        tagsTranslated={person.tags_translated_zh}
        tagsLinkFuncs={this.props.tagsLinkFuncs}
        hideBorder
      />
    )],
  };

  render() {
    const { persons, expertBaseId, className, type, indicesType, showIndices } = this.props;
    const { rightZoneFuncs, titleRightBlock, bottomZoneFuncs, afterTitleBlock } = this.props;
    const { contentBottomZone, emptyPlaceHolder } = this.props;
    const showPrivacy = false;

    return (
      <div className={classnames(styles.personList, className, styles[type])}>
        {!persons &&
        <div className={styles.empty}>
          {emptyPlaceHolder}
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
          const { indices } = person.indices;
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
                        </h2>
                        {afterTitleBlock && afterTitleBlock({ param: { person, expertBaseId } })}
                      </div>}

                      {/* ---- TitleRightBlock ---- */}
                      {titleRightBlock && titleRightBlock({ param: { person, expertBaseId } })}
                    </div>
                    {/*{this.personRightButton && this.personRightButton(person)}*/}
                    <div className={classnames(styles.zone, styles.interestColumn)}>
                      <div className={styles.contact_zone}>
                        {/* Must Has order style! */}
                        <Indices
                          indices={indices}
                          activity_indices={activity_indices}
                          showIndices={showIndices}
                          indicesType={indicesType}
                          style={{ order: 10 }}
                        />
                        {pos &&
                        <div style={{ order: 20 }}>
                          <i className="fa fa-briefcase fa-fw" /> {pos}
                        </div>}

                        {aff &&
                        <div style={{ order: 30 }}>
                          <i className="fa fa-institution fa-fw" /> {aff}
                        </div>}

                        {phone &&
                        <div style={{ order: 40, minWidth: '158px' }}>
                          <i className="fa fa-phone fa-fw" /> {phone}
                        </div>}

                        {email &&
                        <div className="email"
                             style={{
                               order: 50,
                               backgroundImage: `url(${config.baseURL}${email})`,
                             }}
                        ><i className="fa fa-envelope fa-fw" />
                        </div>
                        }

                        {false && person.num_viewed > 0 &&
                        <div style={{ order: 60 }} className={styles.views}><i
                          className="fa fa-eye fa-fw" />{person.num_viewed}
                          <FM id="com.PersonList.label.views" defaultMessage="views" />
                        </div>}

                      </div>

                      {/* ---- Tags/others ---- */}
                      <Hole
                        fill={contentBottomZone}
                        defaults={this.defaultZones.contentBottomZone}
                        param={{ person, expertBaseId }}
                        config={{ containerClass: '' }}
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
