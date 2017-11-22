/**
 * Created by yangyanmei on 17/9/19.
 */
import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import { PersonLabels } from 'components/widgets';
import { sysconfig } from 'systems';
import * as hole from 'utils/hole';
import { isLogin, isGod, isAuthed } from 'utils/auth';
import * as seminarService from 'services/seminar';
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

  logoZone: [
    <Link to="/" href="/" className={classnames(styles.logoZones)} key="0">
      <div className={classnames(styles.header_logo, 'icon')} />
      <div className={classnames(styles.header_subTitle, 'font-page-title')}>
        CCF 专家库
      </div>
    </Link>,
  ],

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

  //
  // Person List Component
  //
  PersonList_AfterTitleBlock: ({ param }) =>
    <PersonLabels person={param.person} labelMap={sysconfig.ExpertBases_ID2NameMap} />,

  // Layout:Header:HeaderInfoZone
  Header_UserAdditionalInfoBlock: param => {
    const { roles } = param;
    const authed = isAuthed(param && param.roles);
    return authed && (
      <p className={roles.authority[0] !== undefined ? styles.isAuthority : ''}>
        <span>{roles.role[0]}</span>
        {roles.authority[0] !== undefined &&
        <span> {seminarService.getValueByJoint(roles.authority[0])}</span>}
      </p>
    );
  },
};
