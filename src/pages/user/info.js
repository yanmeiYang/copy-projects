/**
 * Created by yangyanmei on 17/7/27.
 */
import React from 'react';
import { connect, Page, Link } from 'engine';
import { Button } from 'antd';
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import { Auth } from 'hoc';
import { sysconfig } from 'systems';
import * as auth from 'utils/auth';
import { Maps } from 'utils/immutablejs-helpers';
import styles from './info.less';

const tc = applyTheme(styles);

@Page({ models: [require('models/auth')] })
@connect(({ app }) => ({ app }))
@Auth
export default class UserInfo extends React.Component {
  render() {
    const [user, roles] = Maps.getAll(this.props.app, 'user', 'roles');
    return (
      <Layout searchZone={[]} contentClass={tc(['userInfo'])} showNavigator={true}>
        <h1>账号信息:</h1>
        <div>
          <h3>姓名: {user.display_name}</h3>
          <h3>邮箱: {user.email}</h3>
        </div>
        {auth.isSuperAdmin(roles) &&
        <div style={{ marginTop: 20 }}>
          <h3>您是系统管理员
            {sysconfig.UserInfo_Batch_Signup &&
            <Button type="primary" style={{ marginLeft: 10 }}>
              <Link to="/registered/batch">批量创建用户</Link>
            </Button>
            }
            <Button type="primary" style={{ marginLeft: 10 }}>
              <Link to="/registered">创建用户</Link>
            </Button>
            <Button type="primary" style={{ marginLeft: 10 }}>
              <Link to="/admin/users">用户列表</Link>
            </Button>
          </h3>
        </div>}
      </Layout>
    );
  }
}
