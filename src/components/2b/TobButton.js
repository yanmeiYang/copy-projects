/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { system } from 'core';
import { RequireGod } from 'hoc';
import { sysconfig, getAllSystemConfigs } from 'systems';
import { Icon, Dropdown, Menu } from 'antd';

@connect(({ app }) => ({ app: { user: app.user, roles: app.roles } }))
@RequireGod
export default class TobButton extends PureComponent {
  onclick = (sys) => {
    const { user } = this.props.app;
    system.saveSystem(sys, user);
    window.location.reload();
  };

  render() {
    const allSystemConfigs = getAllSystemConfigs();
    const menu = (
      <Menu selectedKeys={[sysconfig.SYSTEM]} style={{ boxShadow: '0 0 1px' }}>
        {allSystemConfigs && allSystemConfigs.map((src) => {
          return (
            <Menu.Item key={src.SYSTEM}>
              <div onClick={this.onclick.bind(this, src.SYSTEM)}>
                <img src={`/sys/${src.SYSTEM}/favicon.ico`}
                     style={{ width: '10px', height: '10px' }} />
                <span style={{ marginLeft: '5px' }}>{src.SYSTEM}</span>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <Link to="/2b">
            <Icon type="appstore-o" className="noTextIcon"
                  style={{ fontSize: 16, padding: '15px 8px' }} />
          </Link>
        </Dropdown>
      </div>
    );
  }
}

