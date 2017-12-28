/**
 * Created by yangyanmei on 17/9/16.
 */
import React, { PureComponent } from 'react';
import { sysconfig } from 'systems';
import classnames from 'classnames';
import { theme } from 'themes';
import { Menu, Icon, Dropdown, Button } from 'antd';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { TobButton, DevMenu } from 'components/2b';
import * as profileUtils from 'utils/profile-utils';
import { saveLocale } from 'utils/locale';
import { isLogin, isGod, isAuthed } from 'utils/auth';
import defaults from 'core/hole';
import locales from '../../locales';
import styles from './HeaderInfoZone.less';

const location = window.location;

export default class HeaderInfoZone extends PureComponent {
  state = {
    logoutLoading: false,
  };

  onChangeLocale = (locale) => {
    saveLocale(sysconfig.SYSTEM, locale);
    window.location.reload();
  };

  logoutAuth = () => {
    this.setState({ logoutLoading: true });
    this.props.logout();
  };

  loginPageUrl = () => {
    return location.pathname !== sysconfig.Auth_LoginPage
      ? `/login?from=${location.pathname}`
      : '/login';
  };

  render() {
    const { user, roles } = this.props.app;
    const UserNameBlock = isAuthed(roles)
      ? sysconfig.Header_UserNameBlock === defaults.IN_APP_DEFAULT
        ? <span>{user.display_name}</span>
        : sysconfig.Header_UserNameBlock
      : defaults.EMPTY_BLOCK;

    const menu = (
      <Menu style={{ boxShadow: '0 0 1px' }} selectedKeys={[sysconfig.Locale]}>
        {locales && locales.map((local) => {
          return (
            <Menu.Item key={local}>
              <span onClick={this.onChangeLocale.bind(this, local)}>
                <FM id={`system.lang.option_${local}`}
                    defaultMessage={`system.lang.option_${local}`} />
              </span>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const additionFunc = theme.Header_UserAdditionalInfoBlock;
    const AdditionalJSX = additionFunc && additionFunc({ user, roles });

    return (
      <div className={styles.headerInfoZone}>
        <Menu selectedKeys={[location.pathname]} mode="horizontal" theme="light">

          {/* 帮助 */}
          {isLogin(user) && sysconfig.ShowHelpDoc &&
          <Menu.Item key="/help">
            <Link to="/help">
              <FM id="header.label.help" defaultMessage="Help" />
            </Link>
          </Menu.Item>}

          {/*语言 */}
          {sysconfig.EnableLocalLocale &&
          <Menu.Item key="/language">
            <Dropdown overlay={menu} placement="bottomLeft">
              <a className={classnames('ant-dropdown-link')}>
                <span className={styles.longLanguage}>
                <FM id="system.lang.show" defaultMessage="system.lang.show" />&nbsp;
                </span>
                <span className={styles.simpleLanguage}>
                  <FM id="system.lang.simple" defaultMessage="system.lang.simple" />&nbsp;
                </span>
                <Icon type="down" />
              </a>
            </Dropdown>
          </Menu.Item>
          }

          {/* ---- 头像 & 用户名 ---- */}
          {isAuthed(roles) &&
          <Menu.Item key="/account">
            {sysconfig.Header_UserPageURL ?
              <Link to={sysconfig.Header_UserPageURL} title={user.display_name}
                    className={styles.headerAvatar}>
                <img src={profileUtils.getAvatar(user.avatar, user.id, 30)} />

                {/* 用户名 */}
                {UserNameBlock && <span className={styles.userName}>{UserNameBlock}</span>}

                {/* <Icon type="frown-circle"/>个人账号 */}
              </Link>
              :
              <div className={styles.headerAvatar}>
                <img src={profileUtils.getAvatar(user.avatar, user.id, 30)} />
                {UserNameBlock && <span className={styles.userName}>{UserNameBlock}</span>}
              </div>
            }
          </Menu.Item>
          }

          {AdditionalJSX &&
          <Menu.Item key="/additional" className={styles.additional}>{AdditionalJSX}</Menu.Item>}

          {isGod(roles) && false && // ----------------------- TODO
          <Menu.Item key="/devMenu">
            <DevMenu />
          </Menu.Item>}

          {isGod(roles) &&
          <Menu.Item key="/2bbtn">
            <TobButton />
          </Menu.Item>}


          {isAuthed(roles) &&
          <Menu.Item key="/logout">
            {/*className={styles.logoutText}*/}
            <div className={styles.logoutBtn} onClick={this.logoutAuth}>
              {this.state.logoutLoading ?
                <Icon type="loading" /> :
                <Icon type="logout" />
              }
              <FM id="header.exit_login" defaultMessage="Exit Login" />
            </div>
          </Menu.Item>
          }

          {(!isLogin(user) || !isAuthed(roles)) &&
          <Menu.Item key="/login">
            <Link to={this.loginPageUrl()}>
              <Icon type="user" />
              <FM id="header.login" defaultMessage="登录" />
            </Link>
          </Menu.Item>
          }
        </Menu>
      </div>
    );
  }
}
