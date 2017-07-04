import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { arrayToTree, queryArray } from '../../utils';
import styles from './Menu.less';

const Menus = ({
                 siderFold, darkTheme, location, handleClickNavMenu,
                 navOpenKeys, changeOpenKeys, menu, roles,
               }) => {
  // 生成树状
  const menuTree = arrayToTree(menu.filter(_ => _.mpid !== -1), 'id', 'mpid');
  const levelMap = {};
  const admin = roles.admin;

  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.mpid) {
          levelMap[item.id] = item.mpid;
        }
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon}/>}
              {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.id} className={`${item.router === '/registered' && !admin ? styles.hideCreateUser : ''}`}>
          <Link to={item.router}>
            {item.icon && <Icon type={item.icon}/>}
            {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}
          </Link>
        </Menu.Item>
      );
    });
  };
  const menuItems = getMenus(menuTree, siderFold);

  // 保持选中
  const getAncestorKeys = (key) => {
    const map = {};
    const getParent = (index) => {
      const result = [String(levelMap[index])];
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0]);
      }
      return result;
    };
    for (const index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index);
      }
    }
    return map[key] || [];
  };

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !(navOpenKeys.indexOf(key) > -1));
    const latestCloseKey = navOpenKeys.find(key => !(openKeys.indexOf(key) > -1));
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  };

  const menuProps = !siderFold ? {
    onOpenChange,
    openKeys: navOpenKeys,
  } : {};


  // 寻找选中路由
  let currentMenu;
  let defaultSelectedKeys;
  for (const item of menu) {
    if (item.router && pathToRegexp(item.router).exec(location.pathname)) {
      currentMenu = item;
      break;
    }
  }
  const getPathArray = (array, current, pid, id) => {
    const result = [String(current[id])];
    const getPath = (item) => {
      if (item && item[pid]) {
        result.unshift(String(item[pid]));
        getPath(queryArray(array, item[pid], id));
      }
    };
    getPath(current);
    return result;
  };
  if (currentMenu) {
    defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id');
  }

  return (
    <Menu
      {...menuProps}
      mode={siderFold ? 'vertical' : 'inline'}
      theme={darkTheme ? 'dark' : 'light'}
      onClick={handleClickNavMenu}
      defaultSelectedKeys={defaultSelectedKeys}
    >
      {menuItems}
    </Menu>
  );
};


export default Menus;
