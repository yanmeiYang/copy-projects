/* eslint-disable react/no-unused-prop-types,react/require-default-props */
/**
 *  Created by BoGao on 2017-08-14;
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { system } from 'utils';
import { connect } from 'dva';
import { RequireGod } from 'hoc';
import { getDefaultSystemConfigs, CurrentSystemConfig } from 'systems';
import { Icon, Dropdown, Menu } from 'antd';

@connect(({ app }) => ({ app }))
@RequireGod
export default class TobButton extends PureComponent {
  state = {};
  onclick = (sys) => {
    const { user } = this.props.app;
    console.log('on change sys', sys);
    system.saveSystem(sys, user);
    window.location.reload();
  };

  render() {
    const sysconfigs = system.AvailableSystems.map((sys) => {
      const conf = getDefaultSystemConfigs(sys, sys);
      const currentSystem = CurrentSystemConfig[sys];
      Object.keys(currentSystem).map((key) => {
        conf[key] = currentSystem[key];
        return null;
      });
      return conf;
    });
    const menu = (
      <Menu selectedKeys={[system.Source]} style={{ boxShadow: '0 0 1px' }}>
        {sysconfigs && sysconfigs.map((src) => {
          return (
            <Menu.Item key={src.SYSTEM}>
              <div onClick={this.onclick.bind(this, src.SYSTEM)}>
                <img src={`/sys/${src.SYSTEM}/favicon.ico`}
                     style={{ width: "10px", height: "10px" }} />
                <span style={{ marginLeft: "5px" }}>{src.SYSTEM}</span>
              </div>
            </Menu.Item>
          )
        })}
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={menu}>
          <Link to="/2b"><Icon type="appstore-o" className="noTextIcon"
                               style={{ fontSize: 16 }} /></Link>
        </Dropdown>
      </div>
    );
  }
}

