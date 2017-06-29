/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Button, Input, Table, Icon } from 'antd';
import styles from './experts-list.less';
const InputGroup = Input.Group;


const columns = [{
  title: '专家',
  dataIndex: 'name',
}, {
  title: '参加过的活动次数',
  dataIndex: 'activity_count',
  sorter: (a, b) => a.content - b.content,
}, {
  title: '总贡献度',
  dataIndex: 'category',
  sorter: (a, b) => a.level - b.level,
},{
  title: '演讲内容(平均分)',
  dataIndex: 'content',
  sorter: (a, b) => a.content - b.content,
},{
  title: '演讲水平',
  dataIndex: 'level',
  sorter: (a, b) => a.level - b.level,
},{
  title: '态度',
  dataIndex: 'attitude',
  sorter: (a, b) => a.attitude - b.attitude,
}];

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    name: `专家名称${i}`,
    activity_count: i,
    category: i,
    content: i,
    level: 46 - i,
    attitude: i,
  });
}

class ExpertsList extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
  };
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onSearch = () => {
    console.log('search');
  };


  render() {

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div className={styles.top}>
          <div style={{ marginBottom: 5 }} className={styles.exportExperts}>
            <Button
              type="primary"
              onClick={this.start}
              disabled={!hasSelected}
              size='large'
            >
              Export
            </Button>
          </div>

          <InputGroup className={styles.filterByYear}>
            <Input size='large' placeholder='输入年份'/>
            <Button size='large' type='primary'>搜索</Button>
          </InputGroup>
          <Button type='default' size='large' className={styles.fixedTime}>去年</Button>
          <Button type='default' size='large' className={styles.fixedTime}>前年</Button>


          {/*<span style={{ marginLeft: 8 }}>*/}
          {/*{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}*/}
          {/*</span>*/}
        </div>

        <Table rowSelection={rowSelection} columns={columns} dataSource={data} style={{ marginTop: 10 }}/>
      </div>
    )
  }
}

export default (ExpertsList)