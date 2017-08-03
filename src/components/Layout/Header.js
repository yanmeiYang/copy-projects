/**
 * Created by yutao on 2017/5/22.
 */
import React from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { isEqual } from 'lodash';
import styles from './Header.less';
import * as profileUtils from '../../utils/profile_utils';
import { sysconfig } from '../../systems';
import { KgSearchBox, SearchTypeWidgets } from '../../components/search';

class Header extends React.PureComponent {
  // function Header({ app, location, dispatch, logout, onSearch }) {
  constructor(props) {
    super(props);
  }

  state = {
    query: 'test',
  };

  // componentWillMount() {
  //   this.setState({ query: this.props.headerSearchBox.query });
  // }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.app.headerSearchBox && (
      nextProps.app.headerSearchBox !== this.props.app.headerSearchBox
      || this.props.app.headerSearchBox.query !== this.state.query)) {
      if (nextProps.app.headerSearchBox.query) {
        console.log('>>>>>>>>>>>>>>>>> ', nextProps.app.headerSearchBox.query);
        this.setQuery(nextProps.app.headerSearchBox.query);
      }
    }
  };

  setQuery = (query) => {
    this.setState({ query });
  };

  logoutAuth = () => {
    this.props.logout();
  };

  render() {
    const { headerSearchBox, user } = this.props.app;

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

    return (
      <div className={styles.header}>
        <div className={styles.logoLine}>
          <Link className={styles.logo} to="/">
            <div className="logoImg" style={{
              background: `url("/sys/${sysconfig.SYSTEM}/header_logo.png")`,
              ...sysconfig.Header_LogoStyle,
            }} />

            {/* TODO Move config out of this place */}
            <div style={sysconfig.Header_SubTextStyle}>{sysconfig.Header_SubTextLogo}</div>
          </Link>

          <div className={styles.searchWrapper}>
            {headerSearchBox &&
            <KgSearchBox
              size="large" query={this.state.query} style={{ width: 500 }}
              {...headerSearchBox}
            />
            }
          </div>

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

            {user.first_name &&
            <Menu.Item key="/account">
              <Link to={sysconfig.Header_UserPageURL} title={user.display_name}
                    style={{ lineHeight: '46px' }}>
                <img
                  src={profileUtils.getAvatar(user.avatar, user.id, 30)}
                  className={styles.roundedX}
                  style={{ width: 30, height: 30, verticalAlign: 'middle' }} />
                {/*<Icon type="frown-circle"/>个人账号*/}
              </Link>
            </Menu.Item>
            }

            {user.first_name &&
            <Menu.Item key="/logout">
              <div onClick={this.logoutAuth}><Icon type="logout" /></div>
            </Menu.Item>
            }

            {(!user || !user.first_name) &&
            <Menu.Item key="/404">
              <Link to={`/login?from=${location.pathname}`} style={{ lineHeight: '46px' }}>
                <Icon type="user" /> 登录
              </Link>
            </Menu.Item>
            }

            {/*<Menu.Item key="/hidden">*/}
            {/*<Link to="/"><Icon type="compass-circle" /></Link>*/}
            {/*</Menu.Item>*/}
          </Menu>
        </div>

        {headerSearchBox &&
        <SearchTypeWidgets
          config={sysconfig.HeaderSearch_TextNavi}
          query={this.state.query}
        />
        }

      </div>
    );
  }
}

export default connect(({ app }) => ({ app }))(Header);
