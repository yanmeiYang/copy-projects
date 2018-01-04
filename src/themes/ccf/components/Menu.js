import React, { Component } from 'react';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import { cloneDeep } from 'lodash';
import { getMenusByUser } from 'utils/menu';
import styles from './Menu.less';
// TODO use <NavLink> instead; https://reacttraining.com/react-router/web/api/Link

@connect(({ app, location }) => ({ app, location }))
export default class Menus extends Component {
  // siderFold, location, handleClickNavMenu,
  //   navOpenKeys, changeOpenKeys,

  render() {
    // console.log('>>>MENU:::: app is ', this.props.app);
    const { navOpenKeys } = this.props.app;
    const { siderFold, handleClickNavMenu, dispatch } = this.props;
    const { user, roles } = this.props.app;
    const changeOpenKeys = (openKeys) => {
      localStorage.setItem(`navOpenKeys`, JSON.stringify(openKeys));
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } });
    };
    const darkTheme = false;
    const menu = getMenusByUser(user, roles)[0];
    // 生成树状
    const menuTree = arrayToTree(menu.filter(_ => _.mpid !== -1), 'id', 'mpid');
    const levelMap = {};

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
              title={<span>{item.icon && <Icon type={item.icon} />}
                {(!siderFoldN || menuTree.indexOf(item) < 0) && item.name}</span>}
            >
              {getMenus(item.children, siderFoldN)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.id}>
            <Link to={item.router}>
              {item.icon && <Icon type={item.icon} />}
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
      if (item.router && pathToRegexp(item.router).exec(window.location.pathname)) {
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
        className={styles.menu}
        {...menuProps}
        mode={siderFold ? 'vertical' : 'inline'}
        theme={darkTheme ? 'dark' : 'light'}
        // onClick={handleClickNavMenu}
        defaultSelectedKeys={defaultSelectedKeys}
      >
        {menuItems}
      </Menu>
    );
  }
}


/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  const data = cloneDeep(array);
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
};
