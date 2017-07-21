/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

const { Column } = Table;
class CommitteeList extends React.Component {
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


  setCategory = (d, e) => {
    if (d === undefined) {
      return '';
    } else {
      return e;
    }
  };
  getSeminarsByCategory = (v, type, e) => {
    const data = JSON.parse(e.target && e.target.getAttribute('data'));
    let params = `?organizer=${data.organizer}`;
    if (type === 'category') {
      params += `&category=${v}`;
    }
    this.props.dispatch(routerRedux.push({
      pathname: '/statistics/detail',
      search: params,
    }));
  };

  render() {
    const { activity_type } = this.props.seminar;
    let activity_type_options_data = {};
    if (activity_type.data) {
      activity_type_options_data = activity_type.data;
    }


    const { selectedRowKeys } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    //   onSelection: this.onSelection,
    // };
    return (
      <div>
        {/* rowSelection={rowSelection}*/}
        <Table bordered dataSource={this.props.activity}>
          <Column title="承办单位" dataIndex="organizer" key="display_name" />
          <Column title="举办活动次数（总数）" dataIndex="total" key="position" render={(total, organizer) => <a data={JSON.stringify(organizer)} onClick={this.getSeminarsByCategory.bind(this, total, 'organizer')}> {total} </a>} />
          {Object.keys(activity_type_options_data).map((category) => {
            const dataIndex = `category.${category}`;
            return (
              <Column title={category} dataIndex={dataIndex} key={category} render={(dataIndex, text) => {
                if (dataIndex === undefined) {
                  return '';
                } else {
                  return <a target="_blank" data={JSON.stringify(text)} onClick={this.getSeminarsByCategory.bind(this, category, 'category')}> {dataIndex} </a>;
                }
              }} />
            );
          })}
        </Table>
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(CommitteeList);
