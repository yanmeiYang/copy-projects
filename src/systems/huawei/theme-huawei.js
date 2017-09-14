/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import classnames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';
import { IndexInfoBox, PersonLabel, IndexCenterZone } from './components';

import styles from './theme-huawei.less';

module.exports = {
  styles,

  // Layout

  logoZone: [
    <div className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle)}>知识洞察系统</div>
    </div>,
  ],

  footer: <div className={styles.footerText}>版权所有 &copy; 清华大学，华为技术有限公司. </div>,

  // Index page
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <div>logo</div>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],

  index_centerZone: [<IndexCenterZone key={0} />],
};
