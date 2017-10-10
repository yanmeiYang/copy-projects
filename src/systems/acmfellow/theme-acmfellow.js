/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import * as defaults from 'utils/defaults';
import { FormattedMessage as FM } from 'react-intl';
import styles from './theme-acmfellow.less';
import * as Const from './const-acmfellow';

module.exports = {
  themeName: 'common-white',
  styles,

  // Layout

  logoZone: [
    <Link to={'/'} className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        ACM Fellow
      </div>
    </Link>,
  ],

  infoZone: [
    <Link to={`/eb/${Const.ExpertBase}/-/0/20`}
          className={classnames(styles.header_info)} key="0">
      My Experts
    </Link>,
  ],

  // Index page
  ExpertBaseExpertsPage_Title: defaults.IN_COMPONENT_DEFAULT,


  // Expert Page

  ExpertBaseExpertsPage_Title: <span>ACM Fellow</span>,

};
