/**
 * Created by yangyanmei on 17/8/21.
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Icon } from 'antd';

const { Column, ColumnGroup } = Table;
const data = [{
  key: '1',
  firstName: 'John',
  lastName: 'Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  firstName: 'Jim',
  lastName: 'Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  firstName: 'Joe',
  lastName: 'Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];

class TobProfile extends React.Component {
  render() {
    return (
      <Table dataSource={data}>
        <ColumnGroup title="Name">
          <Column
            title="First Name"
            dataIndex="firstName"
            key="firstName"
          />
          <Column
            title="Last Name"
            dataIndex="lastName"
            key="lastName"
          />
        </ColumnGroup>
        <Column
          title="Age"
          dataIndex="age"
          key="age"
        />
        <Column
          title="Address"
          dataIndex="address"
          key="address"
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
          <a href="#">Action 一 {record.name}</a>
          <span className="ant-divider" />
          <a href="#">Delete</a>
          <span className="ant-divider" />
          <a href="#" className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a>
        </span>
          )}
        />
      </Table>
    );
  }
}
export default connect(({ tobProfile }) => ({ tobProfile }))(TobProfile);
