/**
 * Created by BoGao on 2017/10/6.
 */
import React from 'react';
import { Link } from 'engine';
import classnames from 'classnames';
import hole from 'core/hole';
import SelectiveAddAndRemove from 'components/expert-base/SelectiveAddAndRemove';
import { ExportExperts } from 'components/searchwidgets';
import PersonCommentPlugin from 'plugin/PersonCommentsPlugin';
import { IndexCenterZone } from 'systems/nsfcai/components';
import { FormattedMessage as FM } from 'react-intl';
import styles from './theme.less';

export default {
  themeName: 'common-white',
  styles,
  plugins: [PersonCommentPlugin()],

  // Layout

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        NSFC 三处专用
      </div>
    </Link>,
  ],

  infoZone: [
    <a key="0" href="/sys/nsfcai/系统使用说明.html" target="_blank"
       className={classnames(styles.header_info)}>
      使用说明
    </a>,
  ],

  //
  // Index page
  //
  index_bannerZone: [
    <div key="0" className={styles.index_bannerZone}>
      <h1 className={styles.text}>
        <FM id="index.title" defaultMessage="Expert Search" />
      </h1>
    </div>,
  ],
  // index_centerZone: [hole.DEFAULT_PLACEHOLDER, <IndexCenterZone key={0} />],

  //
  // Person List Component
  //
  PersonList_TitleRightBlock: ({ param }) => (
    <div key="1">
      <SelectiveAddAndRemove
        person={param.person}
        expertBaseId={param.expertBaseId}
        currentBaseChildIds={param.currentBaseChildIds}
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
    (payload) => {
      const querySegments = [];
      if (payload.term) {
        querySegments.push(payload.term);
      }
      if (payload.name) {
        querySegments.push(payload.name);
      }
      if (payload.org) {
        querySegments.push(payload.org);
      }
      const queryString = querySegments.join(', ');

      return (
        <div key={100} style={{ marginTop: 8 }}>
          {/*{payload.expertBaseName}*/}
          {payload.total} Experts.
          {queryString && <span> related to "{queryString}".</span>}
        </div>
      );
    },
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
