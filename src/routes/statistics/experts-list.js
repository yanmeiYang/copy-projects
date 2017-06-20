/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Button, Input, Table, Icon } from 'antd';
import styles from './experts-list.less';
const InputGroup = Input.Group;


const columns = [{
  title: '姓名',
  dataIndex: 'name',
}, {
  title: '活动名称',
  dataIndex: 'activity_name',
  sorter: (a, b) => a.content - b.content,
}, {
  title: '贡献类别',
  dataIndex: 'category',
  sorter: (a, b) => a.level - b.level,
}, {
  title: '积分',
  dataIndex: 'integrated',
  sorter: (a, b) => a.integrated - b.integrated,
},{
  title: '内容评分',
  dataIndex: 'content',
  sorter: (a, b) => a.content - b.content,
},{
  title: '水平评分',
  dataIndex: 'level',
  sorter: (a, b) => a.level - b.level,
},{
  title: '态度',
  dataIndex: 'attitude',
  sorter: (a, b) => a.attitude - b.attitude,
},{
  title: '总分',
  dataIndex: 'total_score',
  sorter: (a, b) => a.total_score - b.total_score,
},];

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    key: i,
    name: `专家名称${i}`,
    activity_name:`活动名称${i}`,
    category: `贡献类别${i}`,
    content: i,
    level: 46 - i,
    integrated: i,
    attitude: i,
    total_score:4*i+(46-i),
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
