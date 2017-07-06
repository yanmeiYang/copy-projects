/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
const { ColumnGroup, Column } = Table;
import { sysconfig } from '../../systems';


class ActivityList extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
  };

  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
  };
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  setCategory = (e) => {
    if (e === undefined) {
      return 0
    } else {
      return e
    }
  };

  render() {
    const {activity_type } = this.props.seminar;
    let activity_type_options_data = {};
    if (activity_type.data){
      activity_type_options_data = activity_type.data
    }


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
          <Column title="承办单位" dataIndex="organizer" key="display_name"/>
          <Column title="举办活动次数（总数）" dataIndex="total" key="position"/>
          {Object.keys(activity_type_options_data).map((category) => {
            const dataIndex = 'category.' + category;
            return (<Column title={category} dataIndex={dataIndex} key={category} render={this.setCategory.bind()}/>)
          })}
        </Table>
      </div>
    )
  }
}

export default connect(({ seminar }) => ({ seminar }))(ActivityList)
