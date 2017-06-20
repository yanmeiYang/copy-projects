/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: '名称',
  dataIndex: 'name1',
}, {
  title: '年度活动次数',
  dataIndex: 'activity_count',
}, {
  title: '特邀报告次数',
  dataIndex: 'report_count',
}];

//模拟数据
const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: Math.random(),
    name1: `转为名称 ${i}`,
    activity_count: i,
    report_count: i,
  });
}

class ActivityList extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
  };
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    return (
      <div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    )
  }
}

export default (ActivityList)
