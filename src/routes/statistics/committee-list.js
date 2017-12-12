/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import * as seminarService from '../../services/seminar';
import styles from './committee-list.less';


const { Column } = Table;

class CommitteeList extends React.Component {
  state = {
    selectedRowKeys: [],  // Check here to configure the default column
  }
  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
  }

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

  organizerSorter = (a, b) => {
    const first = a === undefined ? 'zz' : a;
    const second = b === undefined ? 'zz' : b;
    return first.localeCompare(second);
  };

  render() {
    const { activity_type } = this.props.seminar;
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

    // 排序 dict 数组 可以抽出一个公用方法
    const compare = (property) => {
      return (a, b) => {
        const val1 = a[property];
        const val2 = b[property];
        return val2 - val1;
      };
    };
    this.props.activity.sort(compare('total'));

    const data = this.props.activity;
    let sum = 0;
    let cate = [];
    let cate1 = {};
    data.map((item) => {
      sum += item.total;
      cate.push(item.category);
      return true;
    });
    cate.forEach((item) => {
      if (cate1.hasOwnProperty(Object.keys(item))) {
        cate1[Object.keys(item)] += parseInt(Object.values(item), '10');
      } else {
        cate1[Object.keys(item)] = parseInt(Object.values(item), '10');
      }
    });
    let allData = {};
    let allData1 = {};
    let organizedData = {};
    for (let key in cate1) {
      if (key.includes(',')) {
        let splitedKey = key.split(',');
        splitedKey.forEach((item) => {
          allData[item] = cate1[key];
        });
      } else {
        allData1[key] = cate1[key];
      }
    }
    for (let key in allData1) {
      for (let anotherKey in allData) {
        if (key === anotherKey) {
          allData1[key] += allData[anotherKey];
        } else {
          organizedData[anotherKey] = allData[anotherKey];
        }
      }
    }
    for (let key in organizedData) {
      for (let key1 in allData1) {
        if (key !== key1) {
          organizedData[key1] = allData1[key1];
        }
      }
    }
    data.splice(0, 0, { organizer: '合计', total: sum, category: organizedData });

    return (
      <div>
        {/* rowSelection={rowSelection}*/}
        {activity_type.data &&
        <Table bordered size="small" pagination={false} dataSource={data}
               className={styles.committee}>
          <Column title="承办单位" dataIndex="organizer" key="display_name"
                  sorter={(a, b) => this.organizerSorter(a.organizer, b.organizer)}
                  render={(organizer) => {
                    return seminarService.getValueByJoint(organizer);
                  }}
          />
          <Column title="活动总数" dataIndex="total" key="position" className={styles.comTotal}
                  sorter={(a, b) => this.activitySorter(a.total, b.total)}
                  render={(total, organizer) => (
                    <a data={JSON.stringify(organizer)}
                       onClick={this.getSeminarsByCategory.bind(this, total, 'organizer')}
                    > {total} </a>
                  )} />
          {Object.values(activity_type.data).map((category) => {
            // if (category.key === '撰稿活动' || category.key === '审稿活动') {
            //   return '';
            // }
            const categoryIndex = `category.${category.key}`;
            return (
              <Column title={category.key} dataIndex={categoryIndex} key={category.id}
                      sorter={(a, b) => this.activitySorter(a.category[category.key], b.category[category.key])}
                      render={(count, text) => {
                        if (count === undefined) {
                          return '';
                        } else {
                          return (
                            <a target="_blank" data={JSON.stringify(text)}
                               onClick={this.getSeminarsByCategory.bind(this, category, 'category')}
                            > {count} </a>
                          );
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
