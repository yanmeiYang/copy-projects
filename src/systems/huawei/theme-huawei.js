/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import classnames from 'classnames';

import styles from './theme-huawei.less';

module.exports = {
  styles,

  logoZone: [
    <div className={classnames(styles.logoZones)}>
      <div className={classnames('header_logo')}>IMG</div>
      <div className={classnames('header_subTitle')}>知识洞察系统</div>
    </div>,
  ],

  footer: <div>版权所有 &copy; 清华大学，华为技术有限公司. 保留一切权利</div>,
};
