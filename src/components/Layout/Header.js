/**
 * Created by yutao on 2017/5/22.
 */
import React from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { Link, } from 'dva/router';
import styles from './Header.less';
import * as profileUtils from '../../utils/profile_utils';
import { sysconfig } from '../../systems';
import { KgSearchBox, SearchTypeWidgets } from '../../components/search';

function Header({ app, search, location, dispatch, logout, onSearch }) {
  const { headerSearchBox } = app;
  // Use default search if not supplied.
  if (headerSearchBox && !headerSearchBox.onSearch) {
    headerSearchBox.onSearch = onSearch;
  }

  // TODO Header don't use search model. use app's model.
  const query = search ? search.query : '';

  function logoutAuth() {
    logout();
  }

  return (
    <div className={styles.header}>
      <div className={styles.logoLine}>
        <Link className={styles.logo} to="/">
          <div className="logoImg" style={{
            background: `url("/sys/${sysconfig.SYSTEM}/header_logo.png")`,
            ...sysconfig.Header_LogoStyle,
          }} />

          {/*<img*/}
          {/*src={`/sys/${sysconfig.SYSTEM}/header_logo.png`}*/}
          {/*style={sysconfig.Header_LogoStyle}*/}
          {/*alt={'logo'}*/}
          {/*/>*/}
          {/* TODO Move config out of this place */}
          <div style={sysconfig.Header_SubTextStyle}>{sysconfig.Header_SubTextLogo}</div>
        </Link>

        <div className={styles.searchWrapper}>
          {headerSearchBox &&
          <KgSearchBox
            size="large" query={query} style={{ width: 500 }}
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

          {app.user.first_name &&
          <Menu.Item key="/account">
            <Link to={sysconfig.Header_UserPageURL} title={app.user.display_name} style={{ lineHeight: '46px' }}>
              <img
                src={profileUtils.getAvatar(app.user.avatar, app.user.id, 30)}
                className={styles.roundedX}
                style={{ width: 30, height: 30, verticalAlign: 'middle' }} />
              {/*<Icon type="frown-circle"/>个人账号*/}
            </Link>
          </Menu.Item>
          }

          {app.user.first_name &&
          <Menu.Item key="/logout">
            <div onClick={logoutAuth}><Icon type="logout" /></div>
          </Menu.Item>
          }

          {(!app.user || !app.user.first_name) &&
          <Menu.Item key="/404">
            <Link to={`/login?from=${location.pathname}`} style={{ lineHeight: '46px' }}><Icon type="user" />登录</Link>
          </Menu.Item>
          }

          {/*<Menu.Item key="/hidden">*/}
          {/*<Link to="/"><Icon type="compass-circle" /></Link>*/}
          {/*</Menu.Item>*/}
        </Menu>
      </div>

      {headerSearchBox &&
      <SearchTypeWidgets config={sysconfig.HeaderSearch_TextNavi} query={query} />
      }

    </div>
  );
}

export default connect(({ app, search }) => ({ app, search }))(Header);
