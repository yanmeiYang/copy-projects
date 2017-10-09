/**
 * Created by yangyanmei on 17/9/16.
 */
import React, { PureComponent } from 'react';
import { sysconfig } from 'systems';
import { Menu, Icon, Dropdown } from 'antd';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { TobButton, DevMenu } from 'components/2b';
import * as profileUtils from 'utils/profile-utils';
import { saveLocale } from 'utils/locale';
import { isLogin, isGod, isAuthed } from 'utils/auth';
import defaults from 'systems/utils';
import locales from '../../locales';
import styles from './HeaderInfoZone.less';


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

          {/* 语言 */}
          {sysconfig.EnableLocalLocale &&
          <Menu.Item>
            <Dropdown overlay={menu} placement="bottomLeft">
              <a className="ant-dropdown-link">
                <FM id="system.lang.show" defaultMessage="system.lang.show" />&nbsp;
                <Icon type="down" />
              </a>
            </Dropdown>
          </Menu.Item>
          }

          {/* 头像&用户名 */}
          {isAuthed(roles) &&
          <Menu.Item key="/account">
            <Link to={sysconfig.Header_UserPageURL} title={user.display_name}
                  className="headerAvatar">
              <img src={profileUtils.getAvatar(user.avatar, user.id, 30)}
                   alt={user.display_name} />

              {/* 用户名 */}
              {UserNameBlock && <span>{UserNameBlock}</span>}

              {/* <Icon type="frown-circle"/>个人账号 */}
            </Link>
          </Menu.Item>
          }


          {/*/!* TODO 不确定是否其他系统也需要显示角色 TODO ccf specified. *!/*/}
          {/*{sysconfig.SYSTEM === 'ccf' && roles && isAuthed(roles) &&*/}
          {/*<Menu.Item key="role" className={styles.emptyMenuStyle}>*/}
          {/*<p className={roles.authority[0] !== undefined ? styles.isAuthority : ''}>*/}
          {/*<span>{roles.role[0]}</span>*/}
          {/*{roles.authority[0] !== undefined &&*/}
          {/*<br />*/}
          {/*<span>{seminarService.getValueByJoint(roles.authority[0])}</span>*/}
          {/*</span>}*/}
          {/*</p>*/}
          {/*</Menu.Item>*/}
          {/*}*/}


          {isGod(roles) && false && // ----------------------- TODO
          <Menu.Item key="/devMenu">
            <DevMenu />
          </Menu.Item>}

          {isGod(roles) &&
          <Menu.Item key="/2bbtn">
            <Link to="/2b"><TobButton /></Link>
          </Menu.Item>}


          {isAuthed(roles) &&
          <Menu.Item key="/logout">
            {/*className={styles.logoutText}*/}
            <div onClick={this.logoutAuth}>
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
