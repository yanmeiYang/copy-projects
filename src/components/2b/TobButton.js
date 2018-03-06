/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'engine';
import { system } from 'core';
import { RequireGod } from 'hoc';
import { sysconfig, getAllSystemConfigs, AvailableSystems } from 'systems';
import { Icon, Dropdown, Menu, Layout } from 'antd';
import { classnames } from 'utils';
import styles from './TobButton.less'

@connect(({ app }) => ({ app }))
@RequireGod
export default class TobButton extends PureComponent {
  state = {
    isVisible: false,
  };

  onclick = (sys) => {
    const { user } = this.props.app;
    system.saveSystem(sys, user);
    window.location.reload();
  };

  dfa = {
    none: 'yes',
    yes: 'all',
    all: 'none',
  };

  setDebug = () => {
    const { dispatch, app } = this.props;
    const debug = app && app.get('debug');
    const { HighlightHoles } = debug || {};
    dispatch({ type: 'app/setDebug', payload: { HighlightHoles: this.dfa[HighlightHoles] } });
  };

  handleVisibleChange = (flag) => {
    this.setState({ isVisible: flag });
  };

  render() {
    // TODO @alice style ==> .less file.
    // TODO @alice 并且菜单的高度为浏览器高的62%。
    // TODO @alice 向下滚动时，始终显示在页面顶端。

    const { app } = this.props;
    const { HighlightHoles } = app && app.get('debug') || {};
    // const allSystemConfigs = getAllSystemConfigs(); // singleton
    const allSystemConfigs = AvailableSystems;

    const menu = (
      <div>
        <Layout className={styles.menu}>
          <Layout.Sider width={150}>
            <Menu selectedKeys={[sysconfig.SYSTEM]}>
              <Menu.Item className={styles.headerMenuItem}>快速切换系统</Menu.Item>
              <Menu.Divider />

              {allSystemConfigs && allSystemConfigs.map(sys => (
                <Menu.Item key={sys}>
                  <div onClick={this.onclick.bind(this, sys)} className={styles.syslogo}>
                    <img src={`/sys/${sys}/favicon.ico`} />
                    <span>{sys}</span>
                  </div>
                </Menu.Item>
              ))}

              {/*{allSystemConfigs && allSystemConfigs.map(src => (*/}
              {/*<Menu.Item key={src.SYSTEM}>*/}
              {/*<div onClick={this.onclick.bind(this, src.SYSTEM)} className={styles.syslogo}>*/}
              {/*<img src={`/sys/${src.SYSTEM}/favicon.ico`} />*/}
              {/*<span>{src.SYSTEM}</span>*/}
              {/*</div>*/}
              {/*</Menu.Item>*/}
              {/*))}*/}

            </Menu>
          </Layout.Sider>

          <Layout.Content>
            <Menu>
              <Menu.Item className={styles.headerMenuItem}>开发者工具</Menu.Item>
              <Menu.Divider />
              <Menu.Item>
                <Link to="/2b"><Icon type="home" />后台管理</Link>
              </Menu.Item>
              <Menu.Divider />

              <Menu.Item>
                <div onClick={this.setDebug.bind(this)}>
                  Holes调试: {HighlightHoles}
                </div>
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item>
                <Link to="/cross"><Icon type="close" />交叉搜索</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/tools/compareperson">姓名比较工具</Link>
              </Menu.Item>

            </Menu>
          </Layout.Content>
        </Layout>
      </div>
    );
    return (
      <div>
        <Dropdown overlay={menu} trigger={['click']} visible={this.state.isVisible}
                  onVisibleChange={this.handleVisibleChange}>
          <Icon type="appstore-o" className={classnames(styles.icon, "noTextIcon")} />
        </Dropdown>
      </div>
    );
  }
}

