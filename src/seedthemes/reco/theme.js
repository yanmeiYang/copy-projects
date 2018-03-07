/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import { Link } from 'engine';
import classnames from 'classnames';
import hole from 'core/hole';
import { IndexHotLinks } from 'components/widgets';
import { sysconfig } from 'systems';
import styles from './theme.less';

export default {
  themeName: 'common-white',

  styles,

  // Layout

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo1, 'icon1')} />
      <div className={styles.line}>|</div>
      <div className={classnames(styles.header_logo2, 'icon2')}>
      </div>
    </Link>,
  ],
  infoZone: [
    <Link to="/" href="/"
          className={classnames(styles.header_info)} key="0">
      Project List
    </Link>,
  ],
  searchZone: hole.IN_COMPONENT_DEFAULT,
  // infoZone: hole.IN_COMPONENT_DEFAULT,
  rightZone: hole.IN_COMPONENT_DEFAULT,

  footer: (
    <div className={styles.footerText}>
      <div> 2005 - 2016 © AMiner. All Rights Reserved.</div>
      <a href="https://aminer.org">
        <img src="/aminer_logo.png" alt="AMiner logo" className={styles.aminerLogo} />
      </a>
      <a href="http://www.ckcest.cn/">
        <img src="/sys/aminer/ckcest.png" alt="Ckcest logo" className={styles.aminerLogo} />
      </a>
      <a href="http://www.ikcest.org/">
        <img src="/sys/aminer/ikcest.png" alt="ikcest logo" className={styles.aminerLogo} />
      </a>
    </div>
  ),

  // Index page

  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <h className={styles.text}>Data
        <span className={styles.dot}></span> Knowledge
        <span className={styles.dot}></span> Intelligence
      </h>
    </div>,
  ],

  //index_centerZone: [hole.DEFAULT_PLACEHOLDER, <IndexCenterZone key={0} />],
  index_centerZone: [
    <IndexHotLinks
      key={0}
      links={sysconfig.IndexPage_QuickSearchList}
      lang={sysconfig.Locale}
      urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
      withComma
      //urlFunc={query => `/eb/${sysconfig.ExpertBase}/${query}/0/${sysconfig.MainListSize}`}
    />,
  ],

  // Expert Page

  ExpertBaseExpertsPage_Title: hole.IN_COMPONENT_DEFAULT,
};
