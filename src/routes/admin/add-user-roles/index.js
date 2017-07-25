/**
 *  Created by BoGao on 2017-06-09;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs } from 'antd';
import styles from './index.less';
// import UniversalConfig from '../../common/universal-config';
import AddUserRolesByOrg from '../../common/add-role';
import { sysconfig } from '../../../systems';

const TabPane = Tabs.TabPane;
const { SysconfigDefaultCategory, SysConfigTabs, ShowConfigTab } = sysconfig;

class AddUserRoles extends React.Component {
  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    this.updateCategory('user_roles');
  }

  // shouldComponentUpdate(nextProps) {
  //   return this.props.adminSystemConfig.category !== nextProps.adminSystemConfig.category;
  // }

  // componentDidUpdate() {
  //   this.updateCategory('user_roles');
  // }

  // onTabChange = (activeKey) => {
  //   this.props.dispatch(routerRedux.push({
  //     pathname: `/admin/system-config/${activeKey}`,
  //   }));
  // };

  updateCategory = (category) => {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category },
    });
  };

  render() {
    // const sc = this.props.adminSystemConfig;
    // const defaultCategory = sc.category || SysconfigDefaultCategory;
    // const tabConfig = SysConfigTabs.filter(item => item.category === defaultCategory);

    return (
      <div className="content-inner">

        <AddUserRolesByOrg />

      </div>
    );
  }
}

export default connect(
  ({ adminSystemConfig, loading }) => ({ adminSystemConfig, loading }),
)(AddUserRoles);
