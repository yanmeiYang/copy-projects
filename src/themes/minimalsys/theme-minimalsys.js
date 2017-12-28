/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { hole } from 'core';
import AddToEBButton from 'routes/expert-base/AddToEBButton';
// import { FormattedMessage as FM } from 'react-intl';
import { IndexHotLinks } from 'components/widgets';
import { ExportExperts } from 'components/person';
import PersonCommentPlugin from 'plugins/PersonCommentsPlugin';
import styles from './theme-minimalsys.less';
// import * as Const from './const-acmfellow';

export default {
  themeName: 'common-white',
  styles,
  plugins: [PersonCommentPlugin()],

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

  //
  // Index page
  //

  index_centerZone: [
    <IndexHotLinks
      key={0}
      links={sysconfig.IndexPage_QuickSearchList}
      lang={sysconfig.Locale}
      // urlFunc={query => `/${sysconfig.SearchPagePrefix}/${query}/0/${sysconfig.MainListSize}`}
      urlFunc={query => `/eb/${sysconfig.ExpertBase}/${query}/0/${sysconfig.MainListSize}`}
    />,
  ],

  //
  // Person List Component
  //
  PersonList_TitleRightBlock: ({ param }) => (
    <div key="1">
      <AddToEBButton
        person={param.person}
        expertBaseId={param.expertBaseId}
        targetExpertBase={sysconfig.ExpertBase}
      />
    </div>),
  PersonList_RightZone: hole.EMPTY_ZONE_FUNC,
  PersonList_BottomZone: hole.IN_COMPONENT_DEFAULT,

  //
  // Expert Page
  //
  ExpertBaseExpertsPage_TitleZone: [
    // <span>ACM Fellows</span>,
  ],

  ExpertBaseExpertsPage_Title_SHOW_SeeAll_Link: false,

  ExpertBaseExpertsPage_MessageZone: [
    hole.DEFAULT_PLACEHOLDER,
  ],

  //
  // Search Page
  //
  SearchSorts_RightZone: [
    (params) => {
      const { expertBaseId, query, pageSize, current, filters, sortType } = params;
      return () => // 这里是一个二级Function调用.
        (<ExportExperts
            key="0" expertBaseId={expertBaseId}
            query={query} pageSize={pageSize} current={current} filters={filters} sort={sortType}
          />
        );
    },
  ],

};
