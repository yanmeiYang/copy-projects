/**
 * Created by yangyanmei on 17/11/15.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import AddToEBDropdown from 'routes/expert-base/AddToEBDropdown';
import { hole } from 'core';
import { FormattedMessage as FM } from 'react-intl';
import { sysconfig } from 'systems';

import styles from './theme-yocsef.less';

export default {
  themeName: 'huawei-blue',

  styles,

  // Layout

  logoZone: [
    <Link href="/" to="/" className={classnames(styles.logoZones)} key="0">
      {/*<div className={classnames(styles.header_logo, 'icon')} />*/}
      <div className={classnames(styles.header_subTitle)}>
        YOCSEF 智库管理
      </div>
    </Link>,
  ],

  infoZone: [
    <Link href="/eb" to="/eb" className={classnames(styles.header_info)} key="0">
      My Experts
    </Link>,
  ],

  searchZone: hole.IN_COMPONENT_DEFAULT,

  // Index page
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],

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
      const currentExpertBase = sysconfig.MyExpert_List.filter(expertBase => expertBase.id === payload.id);
      return (
        <div key={100}>
          {payload.total} Experts in&nbsp;
          {currentExpertBase.length > 0 && <span>{currentExpertBase[0].title}</span>}.
          {queryString && <span> related to "{queryString}".</span>}
        </div>
      );
    },
  ],

  //
  // Person List Component
  //
  PersonList_TitleRightBlock: ({ param }) => (
    <div key="1">
      <AddToEBDropdown
        person={param.person}
        expertBaseId={param.expertBaseId}
        targetExpertBase={sysconfig.ExpertBase}
      />
    </div>),

  PersonList_RightZone: hole.EMPTY_ZONE_FUNC,

};
