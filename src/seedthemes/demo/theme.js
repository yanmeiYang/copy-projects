/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import classnames from 'classnames';
// import { sysconfig } from 'systems';
import { resRoot } from 'core';
import { Link, router } from 'engine';
import hole from 'core/hole';
import { FormattedMessage as FM } from 'react-intl';
import { IndexCenterZone } from 'systems/demo/components';
import styles from './theme.less';

export default {
  themeName: 'common-white',
  styles,

  // Layout
  logoZone: [
    // TODO umi Router.
    <div className={classnames(styles.logoZones, 'header-logo')} key="0">
      <Link to="/">
        <div className={classnames(styles.header_logo, 'icon')} />
      </Link>
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        <Link to="/">科技情报深度洞察</Link>
      </div>
    </div>,
  ],

  infoZone: [],

  footer: (
    <div className={styles.footerText}>
      <div>Powered by：</div>
      <Link to="/">
        <img src={`${resRoot}/aminer_logo.png`} alt="AMiner logo" className={styles.aminerLogo} />
      </Link>
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
