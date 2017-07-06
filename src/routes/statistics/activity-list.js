/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';
const { ColumnGroup, Column } = Table;
import { sysconfig } from '../../systems';


class ActivityList extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
  };
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  setCategory= (e) =>{
    if (e===undefined){
      return 0
    }else {
      return e
    }
  };

  render() {
    const data = [];
    this.props.activity.forEach((item) => {
      data.push({
        key: Math.random(),
        name1: item.organizer,
        activity_count: item.total,
        [Object.keys(item.category)[0]]: Object.values(item.category)[0],
      });
    });


    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    return (
      <div>
        {/*rowSelection={rowSelection}*/}
        <Table dataSource={this.props.activity}>
          <Column title="专委会" dataIndex="organizer" key="display_name"/>
          <Column title="举办活动次数（总数）" dataIndex="total" key="position"/>
          {sysconfig.CCF_activityTypes.map((category) => {
            const dataIndex = 'category.'+category;
            return (<Column title={category} dataIndex={dataIndex} key={category} render={this.setCategory.bind()}/>)
          })}
        </Table>
      </div>
    )
  }
}

export default (ActivityList)
