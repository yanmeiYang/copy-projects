/**
 * Created by yangyanmei on 17/7/27.
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button } from 'antd';
import * as auth from '../../../utils/auth';
import * as profileUtils from '../../../utils/profile-utils';
import styles from './index.less';

class UserInfo extends React.Component {
  render() {
    const { user, roles } = this.props.app;
    return (
      <div style={{ margin: '50px 50px' }}>
        <div>
          <h3>姓名: {user.display_name}</h3>
          <h3>邮箱: {user.email}</h3>
        </div>
        {auth.isSuperAdmin(roles) &&
        <div style={{ marginTop: 20 }}>
          <h3>您是系统管理员
            <Button type="primary" style={{ marginLeft: 10 }}><Link to="/registered">创建用户</Link></Button>
            <Button type="primary" style={{ marginLeft: 10 }}><Link to="/admin/users">用户列表</Link></Button>
          </h3>

        </div>}


      </div>
    );
  }
}

export default connect(({ app }) => ({ app }))(UserInfo);
