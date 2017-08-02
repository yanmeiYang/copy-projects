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
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'orgcategory' } });
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
      params += `&category=${v.key}`;
    }
    this.props.dispatch(routerRedux.push({
      pathname: '/statistics/detail',
      search: params,
    }));
  };

  activitySorter = (a, b) => {
    const first = a === undefined ? 0 : a;
    const second = b === undefined ? 0 : b;
    return first - second;
  };

  render() {
    const { orgcategory } = this.props.seminar;
    let activity_type_options_data = {};
    // if (activity_type.data) {
    //   activity_type_options_data = activity_type.data;
    // }


    const { selectedRowKeys } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    //   onSelection: this.onSelection,
    // };
    return (
      <div>
        {/* rowSelection={rowSelection}*/}
        {orgcategory.data && <Table bordered dataSource={this.props.activity}>
          <Column title="承办单位" dataIndex="organizer" key="display_name"
                  sorter={(a, b) => this.activitySorter(a.organizer.length, b.organizer.length)} />
          <Column title="举办活动次数（总数）" dataIndex="total" key="position"
                  sorter={(a, b) => this.activitySorter(a.total, b.total)}
                  render={(total, organizer) => <a data={JSON.stringify(organizer)}
                                                   onClick={this.getSeminarsByCategory.bind(this, total, 'organizer')}> {total} </a>} />
          {Object.values(orgcategory.data).map((category) => {
            if (category.key === '撰稿活动' || category.key === '审稿活动') {
              return '';
            }
            const categoryIndex = `category.${category.key}`;
            return (
              <Column title={category.key} dataIndex={categoryIndex} key={category.id}
                      sorter={(a, b) => this.activitySorter(a.category[category.key], b.category[category.key])}
                      render={(count, text) => {
                        if (count === undefined) {
                          return '';
                        } else {
                          return <a target="_blank" data={JSON.stringify(text)}
                                    onClick={this.getSeminarsByCategory.bind(this, category, 'category')}> {count} </a>;
                        }
                      }} />
            );
          })}
        </Table>}
      </div>
    );
  }
}

export default connect(({ seminar }) => ({ seminar }))(CommitteeList);
