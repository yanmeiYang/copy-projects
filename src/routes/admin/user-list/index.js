/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Table, Spin } from 'antd';
import { connect } from 'dva';
const { ColumnGroup, Column } = Table;

class UserList extends React.Component {
  componentDidMount() {
    this.props.dispatch({ type: 'auth/listUsersByRole', payload: { role: 'ccf', offset: 0, size: 10 } })
  }

  render() {
    const { listUsers, loading } = this.props.auth;
    return (
      <div>
        <Spin spinning={loading}>
          <Table
            dataSource={listUsers}
            bordered
            size="small"
            pagination={false}
          >
            <Column title="姓名" dataIndex="display_name" key="display_name"/>
            <Column title="单位" dataIndex="position" key="position"/>
            <Column title="性别" dataIndex="gender" key="gender"/>
            <Column title="角色" dataIndex="new_role" key="role"/>
            <Column title="权限" dataIndex="authority" key="committee"/>

          </Table>
        </Spin>
      </div>
    );
  }
}

export default connect(({ auth }) => ({ auth }))(UserList);
