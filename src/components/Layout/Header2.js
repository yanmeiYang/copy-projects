/**
 * Created by yutao on 2017/5/22.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Menu, Icon, Dropdown } from 'antd';
import { Link } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import { isEqual } from 'lodash';
import styles from './Header.less';
import * as profileUtils from '../../utils/profile-utils';
import { sysconfig } from '../../systems';
import { KgSearchBox, SearchTypeWidgets } from '../../components/search';
import { isLogin, isGod, isAuthed } from '../../utils/auth';
import { TobButton, DevMenu } from '../../components/2b';
import locales from '../../locales';
import { saveLocale } from '../../utils/locale';
import defaults from '../../systems/utils';

@connect(({ app }) => ({ app }))
export default class Header extends PureComponent {
  state = {
    query: '',
    logoutLoading: false,
  };

  // componentWillMount() {
  //   this.setState({ query: this.props.headerSearchBox.query });
  // }

  componentWillReceiveProps = (nextProps) => {
    // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox);
    if (nextProps.app.headerSearchBox) {
      // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox.query);
      // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox !== this.props.app.headerSearchBox);
      if (nextProps.app.headerSearchBox !== this.props.app.headerSearchBox
        || this.props.app.headerSearchBox.query !== this.state.query) {
        // if (nextProps.app.headerSearchBox.query) {
        this.setQuery(nextProps.app.headerSearchBox.query);
        // }
      }
    }
  };

  onChangeLocale = (locale) => {
    saveLocale(sysconfig.SYSTEM, locale);
    window.location.reload();
  };

  setQuery = (query) => {
    this.setState({ query });
  };

  logoutAuth = () => {
    this.setState({ logoutLoading: true });
    // this.forceUpdate(() => console.log('forceUpdate Done!'));
    this.props.logout();
    // this.setState({ logoutLoading: false });
  };

  loginPageUrl = () => {
    return location.pathname !== sysconfig.Auth_LoginPage
      ? `/login?from=${location.pathname}`
      : '/login';
  };

  render() {
    const { headerSearchBox, user, roles } = this.props.app;

    // Use default search if not supplied.
    if (headerSearchBox) {
      const oldSearchHandler = headerSearchBox.onSearch;
      headerSearchBox.onSearch = (query) => {
        this.setState({ query: query.query });
        if (oldSearchHandler) {
          oldSearchHandler(query);
        }
      };
    }

    if (process.env.NODE_ENV !== 'production' && false) {
      const { app } = this.props;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log('app.user:', app.user);
      // console.log('app.token:', app.token ? app.token.slice(0, 10) : app.token);
      console.log('app.roles:', app.roles);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    }

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

    const UserNameBlock = isAuthed(roles)
      ? sysconfig.Header_UserNameBlock === defaults.IN_APP_DEFAULT
        ? <span>{user.display_name}</span>
        : sysconfig.Header_UserNameBlock
      : defaults.EMPTY_BLOCK;

    return (
      <div className={styles.header}>
        <div className={styles.logoLine}>
          <Link className={styles.logo} to="/">
            <div className="logoImg" style={{
              background: `url("/sys/${sysconfig.SYSTEM}/header_logo.png")`,
              ...sysconfig.Header_LogoStyle,
            }} />

            {/* TODO Move config out of this place */}
            <div className={styles.subTextLogo} style={sysconfig.Header_SubTextStyle}>
              {sysconfig.Header_SubTextLogo}
            </div>
          </Link>

          {/* --------------- Search Box -------------- */}
          <div className={styles.searchWrapper}>
            {headerSearchBox &&
            <KgSearchBox
              size="large" query={this.state.query}
              className={styles.searchBox}
              {...headerSearchBox}
            />}
          </div>

          {/* --------------- Search Box -------------- */}
          {sysconfig.Header_RightZone && sysconfig.Header_RightZone.length > 0 &&
          <div className={styles.xxx}>
            {sysconfig.Header_RightZone.map(zoneFunc => (zoneFunc ? zoneFunc() : false))}
          </div>
          }

          {process.env.NODE_ENV !== 'production' && false &&
          <span className="debug_area" style={{ marginRight: 20 }}>
            DEV:{JSON.stringify(this.props.app.roles)}
          </span>
          }

          {/* --------------- 菜单栏 -------------- */}
          <div className={styles.menu}>
            <Menu selectedKeys={[location.pathname]} className={styles.menu}
                  mode="horizontal" theme="light">

              {/* <Menu.Item key="/users"> */}
              {/* <Link to="/"><Icon type="bars" />语言切换</Link> */}
              {/* </Menu.Item> */}

              {isAuthed(roles) &&
              <Menu.Item key="/account">
                <Link to={sysconfig.Header_UserPageURL} title={user.display_name}
                      className="headerAvatar">
                  <img src={profileUtils.getAvatar(user.avatar, user.id, 30)}
                       alt={user.display_name} />
                  {/* <Icon type="frown-circle"/>个人账号 */}
                </Link>
              </Menu.Item>
              }

              {UserNameBlock &&
              <Menu.Item key="/name" className={styles.emptyMenuStyle}>
                {UserNameBlock}
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

              {isGod(roles) &&
              <Menu.Item key="/devMenu">
                <DevMenu />
              </Menu.Item>}

              {isGod(roles) &&
              <Menu.Item key="/2bbtn">
                <Link to="/2b"><TobButton /></Link>
              </Menu.Item>}

              {isLogin(user) && sysconfig.ShowHelpDoc &&
              <Menu.Item key="/help">
                <Link to="/help">
                  <FM id="header.label.help" defaultMessage="Help" />
                </Link>
              </Menu.Item>}

              {isAuthed(roles) &&
              <Menu.Item key="/logout" className={styles.logoutText}>
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
                  <Icon type="user" /> 登录
                </Link>
              </Menu.Item>
              }
            </Menu>
          </div>
        </div>

        {headerSearchBox &&
        <SearchTypeWidgets
          navis={sysconfig.HeaderSearch_TextNavi}
          query={this.state.query}
        />
        }

      </div>
    );
  }
}