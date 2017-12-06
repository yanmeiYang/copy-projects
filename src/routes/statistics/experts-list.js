/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Button, Input, Table, Icon } from 'antd';
import { Link } from 'dva';
import { getTwoDecimal } from '../../utils';
import { displayNameCNFirst } from '../../utils/profile-utils';
import styles from './experts-list.less';

const InputGroup = Input.Group;
const columns = [
  {
    title: '专家',
    dataIndex: '',
    sorter: (a, b) => {
      const aName = `${a.n_zh} (${a.n})`;
      const bName = `${b.n_zh} (${b.n})`;
      return aName.localeCompare(bName);
    },
    render(text) {
      return (<a href={`/person/${text.id}`}
                 target="_blank"> {displayNameCNFirst(text.n, text.n_zh)} </a>);
    },
  },
  {
    title: '总贡献度',
    dataIndex: 'contrib',
    sorter: (a, b) => a.contrib - b.contrib,
    render(text, record) {
      return getTwoDecimal(parseFloat(record.contrib), 2);
    },
  }, {
    title: '审稿次数',
    dataIndex: '审稿活动',
    sorter: (a, b) => a.审稿活动 - b.审稿活动,
  },
  {
    title: '撰稿次数',
    dataIndex: '撰稿活动',
    sorter: (a, b) => a.撰稿活动 - b.撰稿活动,
  }, {
    title: '演讲内容',
    dataIndex: 'content',
    sorter: (a, b) => a.content - b.content,
    render(text, record) {
      return getTwoDecimal(parseFloat(record.content), 2);
    },
  }, {
    title: '演讲水平',
    dataIndex: 'level',
    sorter: (a, b) => a.level - b.level,
    render(text, record) {
      return getTwoDecimal(parseFloat(record.level), 2);
    },
  }, {
    title: '综合评价',
    dataIndex: 'integrated',
    sorter: (a, b) => a.integrated - b.integrated,
    render(text, record) {
      return getTwoDecimal(parseFloat(record.integrated), 2);
    },
  }];


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
    // 排序 dict 数组 可以抽出一个公用方法
    const compare = (property) => {
      return (a, b) => {
        const val1 = a[property];
        const val2 = b[property];
        return val2 - val1;
      };
    };
    this.props.author.sort(compare('contrib'));

    const pagination = { total: this.props.author.length, pageSize: 30 };
    return (
      <div>
        {/* <div className={styles.top}>*/}
        {/* <div style={{ marginBottom: 5 }} className={styles.exportExperts}>*/}
        {/* <Button*/}
        {/* type="primary"*/}
        {/* onClick={this.start}*/}
        {/* disabled={!hasSelected}*/}
        {/* size='large'*/}
        {/* >*/}
        {/* Export*/}
        {/* </Button>*/}
        {/* </div>*/}

        {/* <InputGroup className={styles.filterByYear}>*/}
        {/* <Input size='large' placeholder='输入年份'/>*/}
        {/* <Button size='large' type='primary'>搜索</Button>*/}
        {/* </InputGroup>*/}
        {/* <Button type='default' size='large' className={styles.fixedTime}>去年</Button>*/}
        {/* <Button type='default' size='large' className={styles.fixedTime}>前年</Button>*/}


        {/* /!*<span style={{ marginLeft: 8 }}>*!/*/}
        {/* /!*{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}*!/*/}
        {/* /!*</span>*!/*/}
        {/* </div>*/}
        {/* rowSelection={rowSelection}*/}
        <Table bordered size="small" columns={columns} pagination={ pagination }
               dataSource={this.props.author} className={styles.expertList}
               style={{ marginTop: 10 }} />
      </div>
    );
  }
}

export default (ExpertsList);
