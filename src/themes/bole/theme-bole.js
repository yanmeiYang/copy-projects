/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { Button } from 'antd';
import * as hole from 'utils/hole';
import AddToEBButton from 'routes/expert-base/AddToEBButton';
import { PersonComment } from 'systems/bole/components';
import { FormattedMessage as FM } from 'react-intl';
import { IndexHotLinks } from 'components/widgets';
import styles from './theme-bole.less';
// import * as Const from './const-acmfellow';

module.exports = {
  themeName: 'common-white',
  styles,

  // Layout

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      {/*<div className={classnames(styles.header_logo, 'icon')} />*/}
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        伯乐系统
      </div>
    </Link>,
  ],

  infoZone: [
    <Link to={`/eb/${sysconfig.ExpertBase}/-/0/20`}
          className={classnames(styles.header_info)} key="0">
      My Experts
    </Link>,
  ],

  //
  // Index page
  //

  index_centerZone: [
    <IndexHotLinks
      key={0}
      links={sysconfig.IndexPage_QuickSearchList}
      lang={sysconfig.Locale}
      // urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
      urlFunc={query => `/eb/${sysconfig.ExpertBase}/${query}/0/${sysconfig.MainListSize}`}
    />,
  ],

  //
  // Person List Component
  //
  PersonList_TitleRightBlock: ({ param }) => (
    <div key="1">
      <AddToEBButton
        person={param.person}
        expertBaseId={param.expertBaseId}
        targetExpertBase={sysconfig.ExpertBase}
      />
    </div>),

  PersonList_RightZone: [
    param => {
      return (
        <div key="0">
          {param.person && param.expertBaseId !== 'aminer' &&
          <Link to={`/profile/merge/${param.person.id}/${param.person.name}`}>
            <Button>
              <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
            </Button>
          </Link>}
        </div>
      );
    },
  ],

  PersonList_BottomZone: [
    param => (
      <PersonComment
        key="1" person={param.person} user={param.user}
        expertBaseId={param.expertBaseId}
      />),
  ],

  //
  // Expert Page
  //
  ExpertBaseExpertsPage_TitleZone: [
    // <span>ACM Fellows</span>,
  ],

  ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link: false,

  ExpertBaseExpertsPage_MessageZone: [
    (payload) => {
      const querySegments = [];
      if (payload.term) {
        querySegments.push(payload.term);
      }
      if (payload.name) {
        querySegments.push(payload.name);
      }
      if (payload.org) {
        querySegments.push(payload.org);
      }
      const queryString = querySegments.join(', ');

      return (
        <div key={100}>
          {payload.total} Experts.
          {queryString && <span> related to "{queryString}".</span>}
        </div>
      );
    },
  ],
};
