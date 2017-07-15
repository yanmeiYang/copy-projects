import React from 'react';
import { Icon, Switch } from 'antd';
import styles from './Layout.less';
import Menus from './Menu';

const Sider = ({
                 siderFold, darkTheme, location,
                 changeTheme, navOpenKeys, changeOpenKeys, menu,
               }) => {

  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  };

  return (
    <div style={{ paddingTop: 20 }}>
      {/*<div className={styles.logo}>*/}
      {/*<img alt={'logo'} src={config.logo} />*/}
      {/*{siderFold ? '' : <span>{config.name}</span>}*/}
      {/*</div>*/}

      <Menus {...menusProps} />

      {false && !siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Switch Theme</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Dark"
                unCheckedChildren="Light" />
      </div> : ''}
    </div>
  );
};

export default Sider;
