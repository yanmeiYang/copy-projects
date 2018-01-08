/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'engine';
import { system } from 'core';
import { RequireGod } from 'hoc';
import { sysconfig, getAllSystemConfigs } from 'systems';
import { Icon, Dropdown, Menu, Layout } from 'antd';

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
    const { HighlightHoles = 'none' } = app || {};
    dispatch({ type: 'app/setDebug', payload: { HighlightHoles: this.dfa[HighlightHoles] } });
  };

  handleVisibleChange = (flag) => {
    this.setState({ isVisible: flag });
  };

  render() {
    // TODO @alice style ==> .less file.
    // TODO @alice 并且菜单的高度为浏览器高的62%。
    // TODO @alice 向下滚动时，始终显示在页面顶端。

    const { HighlightHoles } = this.props && this.props.app;
    const allSystemConfigs = getAllSystemConfigs();
    const menu = (
      <div>
        <Layout style={{ height: '624px', background: '#fff', boxShadow: '0 0 1px' }}>
          <Layout.Sider width={150} style={{ marginBottom: '20px' }}>
            <Menu selectedKeys={[sysconfig.SYSTEM]} style={{ width: '150px' }}>
              <Menu.Item style={{ height: '30px', lineHeight: '30px', margin: '3px' }}>
                <h3>快速切换系统</h3>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Divider />
              {allSystemConfigs && allSystemConfigs.map((src) => {
                return (
                  <Menu.Item key={src.SYSTEM}
                             style={{ height: '30px', lineHeight: '30px', margin: '3px' }}>
                    <div onClick={this.onclick.bind(this, src.SYSTEM)}>
                      <img src={`/sys/${src.SYSTEM}/favicon.ico`}
                           style={{ width: '10px', height: '10px' }} />
                      <span style={{ marginLeft: '5px' }}>{src.SYSTEM}</span>
                    </div>
                  </Menu.Item>
                );
              })}
            </Menu>
          </Layout.Sider>
          <Layout.Content style={{ Height: '584px' }}>
            <Menu style={{ width: '250px' }}>
              <Menu.Item style={{ height: '30px', lineHeight: '30px', margin: '3px' }}>
                <h3>
                  开发者工具
                </h3>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Divider />
              <Menu.Item>
                <Link to="/2b">
                  快速管理
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/toolscompare">
                  姓名比较工具
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div onClick={this.setDebug.bind(this)}>
                  Holes调试: {HighlightHoles}
                </div>
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
              </Menu.Item>
              <Menu.Item>
                11111111
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
          <Icon type="appstore-o" className="noTextIcon"
                style={{ fontSize: 16, padding: '15px 8px' }} />
        </Dropdown>
      </div>
    );
  }
}

