/**
 * Created by yangyanmei on 17/9/19.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import * as hole from 'utils/hole';
import Menu from './components/Menu';
import styles from './theme-ccf.less';

const menusProps = {
  // menu,
  siderFold: false,
  darkTheme: false,
  location,
  // navOpenKeys,
  // changeOpenKeys,
};

module.exports = {
  themeName: 'common-white',
  styles,

  infoZone: [
    <a key="0" href="/sys/ccf/Instructions/index.html"
       className={classnames(styles.header_info)}>
      帮助
    </a>,
  ],

  sidebar: [
    <Menu key={0} {...menusProps} />,
    // <div key={1}>sadfasdfa</div>,
  ],

};
