/**
 * Created by yangyanmei on 17/10/24.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import * as hole from 'utils/hole';
import { FormattedMessage as FM } from 'react-intl';
import { IndexInfoBox, PersonLabel, IndexCenterZone } from '../../systems/huawei/components';
import styles from './theme-thrcb.less';

module.exports = {
  themeName: 'huawei-blue',

  styles,

  //
  // Layout
  //

  logoZone: [
    <a key="0" href="/" className={classnames(styles.logoZones)}>
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        清华人才办
      </div>
    </a>,
  ],

  searchZone: hole.IN_COMPONENT_DEFAULT,
  infoZone: hole.IN_COMPONENT_DEFAULT,
  rightZone: hole.IN_COMPONENT_DEFAULT,

  // footer: (
  //   <div className={styles.footerText}>
  //     {/*版权所有 &copy; 清华大学，华为技术有限公司.*/}
  //     <div>Powered by：</div>
  //     <a href="https://aminer.org">
  //       <img src="/aminer_logo.png" alt="AMiner logo" className={styles.aminerLogo} />
  //     </a>
  //   </div>
  // ),

  Header_UserAdditionalInfoBlock: hole.EMPTY_BLOCK_FUNC,

  //
  // Index page
  //

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

  // index_centerZone: [hole.DEFAULT_PLACEHOLDER, <IndexCenterZone key={0} />],

  //
  // Person List Component
  //
  PersonList_TitleRightBlock: hole.EMPTY_BLOCK_FUNC,
  PersonList_RightZone: hole.IN_COMPONENT_DEFAULT,
  PersonList_BottomZone: hole.IN_COMPONENT_DEFAULT,

  //
  // Expert Page
  //

  ExpertBaseExpertsPage_TitleZone: hole.IN_COMPONENT_DEFAULT,
  ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link: true,
  ExpertBaseExpertsPage_MessageZone: hole.IN_COMPONENT_DEFAULT,

  //
  // Search Page
  //
  SearchSorts_RightZone: hole.IN_COMPONENT_DEFAULT,
};
