/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { isEmpty } from 'lodash';
import * as seminarService from '../../services/seminar';
import styles from './committee-list.less';


const { Column } = Table;

class CommitteeList extends React.Component {

  componentWillMount = () => {
    this.props.dispatch({ type: 'seminar/getCategory', payload: { category: 'activity_type' } });
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
    const { activity } = this.props;

    // 存储org为"总计"时对应的category
    const tempCategory = {};
    // 活动类型push到承办单位为"总计"的条目中
    if (activity_type && activity_type.data && activity && activity.length > 0) {
      for (const item of activity_type.data) {
        // 初始值设置为0, 方便后续的++
        tempCategory[item.key] = 0;
        // 循环活动统计数据，得到对应的category
        for (const act of activity) {
          // 承办单位对应总数求和
          Object.keys(act.category).map((key) => {
            if (item.key === key) {
              tempCategory[item.key] += act.category[key];
            }
            return tempCategory;
          });
        }
      }
    }

    if (activity && activity.length > 0 && !isEmpty(tempCategory)) {
      let tempTotal = 0;
      activity.map(act => tempTotal += act.total);
      activity.push({ organizer: '总计', total: tempTotal, category: tempCategory });
    }

    // 排序 dict 数组 可以抽出一个公用方法
    const compare = (property) => {
      return (a, b) => {
        const val1 = a[property];
        const val2 = b[property];
        return val2 - val1;
      };
    };
    activity && activity.sort(compare('total'));
    return (
      <div>
        {/* rowSelection={rowSelection}*/}
        {activity_type.data &&
        <Table
          bordered size="small" pagination={false}
          dataSource={this.props.activity} className={styles.committee}>
          <Column
            title="承办单位" dataIndex="organizer" key="display_name"
            sorter={(a, b) => this.organizerSorter(a.organizer, b.organizer)}
            render={(organizer) => {
              return seminarService.getValueByJoint(organizer);
            }}
          />
          <Column
            title="活动总数" dataIndex="total" key="position" className={styles.comTotal}
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
              <Column
                title={category.key} dataIndex={categoryIndex} key={category.id}
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
