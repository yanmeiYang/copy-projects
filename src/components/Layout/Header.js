/**
 * Created by yutao on 2017/5/22.
 */

import React from 'react';
import { connect } from 'dva';
import { Menu, Icon, Tooltip } from 'antd';
import { Link } from 'dva/router';
import logoImg from '../../assets/ccf_logo.png';
import profileUtils from '../../utils/profile_utils';
import styles from './Header.less';

const Header = ({ app, location, logout }) => {
  function logoutAuth() {
    logout()
  }

  return (
    <div className={styles.header}>
      <Link className={styles.logo} to="/">
        <img alt={'logo'} src={logoImg}/>
        {/* TODO Move config out of this place */}
        <div>CCF 专家库</div>
      </Link>
      <Menu
        selectedKeys={[location.pathname]}
        mode="horizontal"
        theme="light"
        className={styles.menu}
      >
        {/*<Menu.Item key="/users">*/}
        {/*<Link to="/"><Icon type="bars" />语言切换</Link>*/}
        {/*</Menu.Item>*/}

        {/*{app.user.hasOwnProperty('first_name') &&*/}
        {/*<Menu.Item key="/welcome">*/}
          {/*<Link to="/">欢迎：{app.user.display_name}</Link>*/}
        {/*</Menu.Item>*/}
        {/*}*/}
        {/*{!app.user.hasOwnProperty('first_name') &&*/}
        {/*<Menu.Item key="/login">*/}
          {/*<Link to="/login"><Icon type="login"/></Link>*/}
        {/*</Menu.Item>*/}
        {/*}*/}

        {app.user &&
        <Menu.Item key="/">
          <Link to="/"><Icon type="info-circle-o"/>信息中心</Link>
        </Menu.Item>
        }
        {!app.user.hasOwnProperty('first_name') &&
        <Menu.Item key="/login">
          <Link to="/login"><Icon type="login"/></Link>
        </Menu.Item>
        }

        {app.user.hasOwnProperty('first_name') &&
        <Menu.Item key="/account">
          <Link to={`/person/${app.user.id}`} title={app.user.display_name}>

            <img src={profileUtils.getAvatar(app.user.avatar, app.user.id, 30)}  className={styles.roundedX}
                 style={{ marginTop: 5, width: 30, height: 30, verticalAlign: 'middle' }}/>
            {/*<Icon type="frown-circle"/>个人账号*/}
          </Link>
        </Menu.Item>
        }
        {app.user.hasOwnProperty('first_name') &&
        <Menu.Item key="/logout">
          <div onClick={logoutAuth} style={{ lineHeight: '63px' }}><Icon type="logout"/></div>
        </Menu.Item>
        }
        {!app.user &&
        <Menu.Item key="/404">
          <Link to="/login"><Icon type="frown-circle" />登录</Link>
        </Menu.Item>
        }

        {/*<Menu.Item key="/hidden">*/}
          {/*<Link to="/"><Icon type="compass-circle" /></Link>*/}
        {/*</Menu.Item>*/}
      </Menu>
    </div>
  );
}

export default connect(({ app }) => ({ app }))(Header);
