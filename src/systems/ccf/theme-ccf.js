/**
 * Created by yangyanmei on 17/9/19.
 */
import React from 'react';
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

  sidebar: [
    <Menu key={0} {...menusProps} />,
    // <div key={1}>sadfasdfa</div>,
  ],

};
