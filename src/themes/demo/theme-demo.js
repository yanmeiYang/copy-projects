/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
// import { sysconfig } from 'systems';
import { hole } from 'core';
import { FormattedMessage as FM } from 'react-intl';
import { IndexCenterZone } from 'systems/demo/components';
import styles from './theme-demo.less';

export default {
  themeName: 'common-white',
  styles,

  // Layout
  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        科技情报深度洞察
      </div>
    </Link>,
  ],

  infoZone: [],

  footer: (
    <div className={styles.footerText}>
      <div>Powered by：</div>
      <a href="https://aminer.org">
        <img src="/aminer_logo.png" alt="AMiner logo" className={styles.aminerLogo} />
      </a>
    </div>
  ),

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

  index_centerZone: [hole.DEFAULT_PLACEHOLDER, <IndexCenterZone key={0} />],

  // Expert Page

  ExpertBaseExpertsPage_TitleZone: [
    // <span>ACM Fellows</span>,
  ],

  ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link: false,

  ExpertBaseExpertsPage_MessageZone: [
    hole.DEFAULT_PLACEHOLDER,
  ],
};
