/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import * as hole from 'utils/hole';
import { FormattedMessage as FM } from 'react-intl';
import { IndexHotLinks } from 'components/widgets';
import styles from './theme-demo.less';
// import * as Const from './const-acmfellow';

const infoZone = (
  <Link to={`/eb/${sysconfig.ExpertBase}/-/0/20`}
        className={classnames(styles.header_info)} key="0">
    My Experts
  </Link>);

module.exports = {
  themeName: 'common-white',
  styles,

  // Layout
  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        AMiner Demo
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

  // Expert Page

  ExpertBaseExpertsPage_TitleZone: [
    // <span>ACM Fellows</span>,
  ],

  ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link: false,

  ExpertBaseExpertsPage_MessageZone: [
    hole.DEFAULT_PLACEHOLDER,
  ],
};
