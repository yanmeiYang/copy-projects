/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: '序号',
  dataIndex: 'number',
}, {
  title: '活动名称',
  dataIndex: 'name1',
}, {
  title: '时间',
  dataIndex: 'time',
}, {
  title: '地点',
  dataIndex: 'address',
}, {
  title: '报告数量',
  dataIndex: 'count',
},
];

//模拟数据
const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: Math.random(),
    number: i,
    name1: `活动名称 ${i}`,
    time: i,
    address: `北京${i}`,
    count: i,
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
