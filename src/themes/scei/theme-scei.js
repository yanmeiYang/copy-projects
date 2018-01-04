/**
 * Created by BoGao on 2017/9/13.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { hole } from 'core';
import { FormattedMessage as FM } from 'react-intl';

import styles from './theme-scei.less';

export default {
  themeName: 'huawei-blue',

  styles,

  // Layout

  logoZone: [
    <Link href="/" to="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle)}>
        深度智库
      </div>
    </Link>,
  ],

  searchZone: hole.IN_COMPONENT_DEFAULT,
  infoZone: hole.IN_COMPONENT_DEFAULT,

  PersonList_RightZone: [],
  // PersonList_RightZone: [
  //   hole.DEFAULT_PLACEHOLDER,
  //   () => {
  //     return (
  //       <div className={styles.feedback} key="0">
  //         <a href="http://ucircle.oa.com/aminer/requirement/create" target="_blank"
  //            rel="feedback">
  //           <i className="fa fa-exclamation-circle" />&nbsp;
  //           <FM id="com.PersonList.label.feedback" defaultMessage="反馈需求" />
  //         </a>
  //       </div>
  //     );
  //   },
  // ],

  // Index page
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],
};
