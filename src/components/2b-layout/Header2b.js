import React from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import styles from './Header2b.less';
import * as profileUtils from '../../utils/profile-utils';
import { sysconfig } from '../../systems';
import { SearchTypeWidgets } from '../../components/search';

class Header2b extends React.PureComponent {
  state = {
    query: 'test',
  };

  // componentWillMount() {
  //   this.setState({ query: this.props.headerSearchBox.query });
  // }
  logoutAuth = () => {
    this.props.logout();
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

    if (process.env.NODE_ENV !== 'production') {
      const { app } = this.props;
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log('app.user:', app.user);
      console.log('app.token:', app.token ? app.token.slice(0, 10) : app.token);
      console.log('app.roles:', app.roles);
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    }

    return (
      <div className={styles.header}>
        <div className={styles.logoLine}>
          <Link className={styles.logo} to="/">
            <div className="logoImg" style={{
              background: 'url("/aminer_logo.png")',
              width: '80px',
              height: '38px',
              backgroundPosition: '8px 2px',
              backgroundSize: ' auto 32px',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'white',
            }} />

            {/* TODO Move config out of this place */}
            <div>后台管理界面</div>
          </Link>

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
            {/* TODO 不确定是否其他系统也需要显示角色 */}
            {sysconfig.SYSTEM === 'ccf' &&
            <Menu.Item key="" className={styles.showRoles}>
              <p className={roles.authority[0] !== undefined ? styles.isAuthority : ''}>
                <span>{roles.role[0]}</span>
                {roles.authority[0] !== undefined &&
                <span>
                  <br />
                  <span>{roles.authority[0]}</span>
                </span>}
              </p>
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
          navis={sysconfig.HeaderSearch_TextNavi}
          query={this.state.query}
        />
        }

      </div>
    );
  }
}

export default connect(({ app }) => ({ app }))(Header2b);
