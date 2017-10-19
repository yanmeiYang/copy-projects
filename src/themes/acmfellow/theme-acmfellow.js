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
import styles from './theme-acmfellow.less';
// import * as Const from './const-acmfellow';

module.exports = {
  themeName: 'common-white',
  styles,

  // Layout

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        ACM Fellow
      </div>
    </Link>,
  ],

  infoZone: [
    <Link to={`/eb/${sysconfig.ExpertBase}/-/0/20`}
          className={classnames(styles.header_info)} key="0">
      All ACM Fellows
    </Link>,
  ],

  // Index page

  index_centerZone: [
    <IndexHotLinks
      key={0}
      links={sysconfig.IndexPage_QuickSearchList}
      lang={sysconfig.Locale}
      // urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
      urlFunc={query => `/eb/${sysconfig.ExpertBase}/${query}/0/${sysconfig.MainListSize}`}
    />,
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
