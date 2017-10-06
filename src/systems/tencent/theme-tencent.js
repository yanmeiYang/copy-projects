/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import * as defaults from 'utils/defaults';
import { FormattedMessage as FM } from 'react-intl';

import styles from './theme-tencent.less';

module.exports = {
  themeName: 'huawei-blue',

  styles,

  // Layout

  logoZone: [
    <Link to={'/'} className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
    </Link>,
  ],

  searchZone: defaults.IN_COMPONENT_DEFAULT,
  infoZone: defaults.IN_COMPONENT_DEFAULT,

  // footer: (
  //   <div className={styles.footerText}>
  //     {/*版权所有 &copy; 清华大学，华为技术有限公司.*/}
  //     <div>Powered by：</div>
  //     <a href="https://aminer.org">
  //       <img src="/aminer_logo.png" alt="AMiner logo" className={styles.aminerLogo} />
  //     </a>
  //   </div>
  // ),

  // Index page
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],
};