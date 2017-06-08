/**
 * Created by yutao on 2017/5/22.
 */

import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import logoImg from '../../assets/ccf_logo.png';
import styles from './Header.less';

function Header({ location }) {
  return (
    <div className={styles.header}>
      <Link className={styles.logo} to="/">
        <img alt={'logo'} src={logoImg} />
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
        <Menu.Item key="/">
          <Link to="/"><Icon type="info-circle-o" />信息中心</Link>
        </Menu.Item>
        <Menu.Item key="/404">
          <Link to="/"><Icon type="frown-circle" />个人账号</Link>
        </Menu.Item>
        <Menu.Item key="/hidden">
          <Link to="/"><Icon type="compass-circle" /></Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default Header;
