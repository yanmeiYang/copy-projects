/**
 * Created by yangyanmei on 17/10/24.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import * as hole from 'utils/hole';
import { FormattedMessage as FM } from 'react-intl';
import { IndexHotLinks } from 'components/widgets';
import { IndexCenterZone } from '../../systems/alibaba/components';
import centerZoneLinks from '../../systems/alibaba/components/center-zone-links';
import styles from './theme-alibaba.less';
// import * as Const from './const-acmfellow';

module.exports = {
  themeName: 'common-white',
  styles,

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        学术资源地图
      </div>
    </Link>,
  ],

  // Layout

  // Index page
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      {/*<div className={classnames(styles.logo)}>*/}
      {/*<span alt="" className="icon" />*/}
      {/*</div>*/}
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],

  // Expert Page
  index_centerZone: [
    <IndexCenterZone
      key={0}
      links={centerZoneLinks}
      urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`} />,
  ],


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
