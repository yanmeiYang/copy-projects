/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import * as hole from 'utils/hole';
import { FormattedMessage as FM } from 'react-intl';
import { IndexInfoBox, PersonLabel, IndexCenterZone } from './components';

import styles from './theme-huawei.less';

module.exports = {
  themeName: 'huawei-blue',

  styles,

  // Layout

  logoZone: [
    <Link to={'/'} className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        知识洞察系统
      </div>
    </Link>,
  ],

  searchZone: hole.IN_COMPONENT_DEFAULT,
  infoZone: hole.IN_COMPONENT_DEFAULT,
  rightZone: hole.IN_COMPONENT_DEFAULT,

  footer: (
    <div className={styles.footerText}>
      {/*版权所有 &copy; 清华大学，华为技术有限公司.*/}
      <div>Powered by：</div>
      <a href="https://aminer.org">
        <img src="/aminer_logo.png" alt="AMiner logo" className={styles.aminerLogo} />
      </a>
    </div>
  ),

  // Index page

  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <div className={classnames(styles.logo)}>
        <span alt="" className="icon" />
      </div>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],

  index_centerZone: [hole.DEFAULT_PLACEHOLDER, <IndexCenterZone key={0} />],

  // Expert Page

  ExpertBaseExpertsPage_Title: hole.IN_COMPONENT_DEFAULT,
};
