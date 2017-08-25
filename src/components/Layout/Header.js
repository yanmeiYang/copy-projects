/**
 * Created by yutao on 2017/5/22.
 */
import React from 'react';
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
import * as seminarService from '../../services/seminar';
import locales from '../../locales';
import { saveLocale } from '../../utils/locale';


class Header extends React.PureComponent {
  // function Header({ app, location, dispatch, logout, onSearch }) {
  // constructor(props) {
  //   super(props);
  // }

  state = {
    query: 'test',
    logoutLoading: false,
  };

  // componentWillMount() {
  //   this.setState({ query: this.props.headerSearchBox.query });
  // }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.app.headerSearchBox && (
      nextProps.app.headerSearchBox !== this.props.app.headerSearchBox
      || this.props.app.headerSearchBox.query !== this.state.query)) {
      if (nextProps.app.headerSearchBox.query) {
        // console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox.query);
        this.setQuery(nextProps.app.headerSearchBox.query);
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

    return (
      <div className={styles.header}>
        <div className={styles.logoLine}>
          <Link className={styles.logo} to="/">
            <div className="logoImg" style={{
              background: `url("/sys/${sysconfig.SYSTEM}/header_logo.png")`,
              ...sysconfig.Header_LogoStyle,
            }} />

            {/* TODO Move config out of this place */}
            <div style={sysconfig.Header_SubTextStyle}>
              {sysconfig.Header_SubTextLogo}
            </div>
          </Link>

          <div className={styles.searchWrapper}>
            {headerSearchBox &&
            <KgSearchBox
              size="large" query={this.state.query} style={{ width: 500 }}
              {...headerSearchBox}
            />
            }
          </div>

          {process.env.NODE_ENV !== 'production' && false &&
          <span className="debug_area" style={{ marginRight: 20 }}>
            DEV:{JSON.stringify(this.props.app.roles)}
          </span>
          }

          {/* --------------- 菜单栏 -------------- */}
          <Menu
            selectedKeys={[location.pathname]}
            mode="horizontal"
            theme="light"
            className={styles.menu}
          >
            {/* <Menu.Item key="/users"> */}
            {/* <Link to="/"><Icon type="bars" />语言切换</Link> */}
            {/* </Menu.Item> */}

            {/*{app.user &&*/}
            {/*<Menu.Item key="/">*/}
            {/*<Link to="/"><Icon type="info-circle-o"/>信息中心</Link>*/}
            {/*</Menu.Item>*/}
            {/*}*/}
            {/*{(!app.user || !app.user.first_name) &&*/}
            {/*<Menu.Item key="/login">*/}
            {/*<Link to={`/login?from=${location.pathname}`}><Icon type="login" /></Link>*/}
            {/*</Menu.Item>*/}
            {/*}*/}


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

            {isAuthed(roles) && sysconfig.Header_UserName &&
            <Menu.Item key="/name" className={styles.emptyMenuStyle}>
              <span>{user.display_name}</span>
            </Menu.Item>
            }
            {/* TODO 不确定是否其他系统也需要显示角色 */}
            {sysconfig.SYSTEM === 'ccf' && roles && isAuthed(roles) &&
            <Menu.Item key="" className={styles.emptyMenuStyle}>
              <p className={roles.authority[0] !== undefined ? styles.isAuthority : ''}>
                <span>{roles.role[0]}</span>
                {roles.authority[0] !== undefined &&
                <span>
                  <br />
                  <span>{seminarService.getValueByJoint(roles.authority[0])}</span>
                </span>}
              </p>
            </Menu.Item>
            }
            <Menu.Item>
              <Dropdown overlay={menu} placement="bottomLeft">
                <a className="ant-dropdown-link">
                  <FM id="system.lang.show" defaultMessage="system.lang.show" />&nbsp;
                  <Icon type="down" />
                </a>
              </Dropdown>
            </Menu.Item>

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
            <Menu.Item key="/logout">
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

export default connect(({ app }) => ({ app }))(Header);
