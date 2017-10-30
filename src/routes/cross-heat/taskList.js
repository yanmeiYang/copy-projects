/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Table, Icon, Input } from 'antd';
import { Layout } from 'routes';
import { Auth } from 'hoc';
import { applyTheme } from 'themes';
import { Spinner } from 'components';
import styles from './taskList.less';

const tc = applyTheme(styles);
const Search = Input.Search;


const data = [{
  id: '59e569e79ed5db1d9cf6c149',
  name: 'Data mining & Physics',
  status: '计算中',
  beginTime: '2017-10-12 10:00',
  endTime: '2017-10-12 10:30',
}, {
  id: '59e5bf489ed5db1d9cf76056',
  name: 'Artificial Intelligence & Health Care',
  status: '已完成',
  beginTime: '2017-10-13 10:00',
  endTime: '2017-10-13 10:30',
}, {
  id: '59e5c0a69ed5db1d9cf76199',
  name: 'Machine Learning & Health Care',
  status: '计算中',
  beginTime: '2017-10-10 10:00',
  endTime: '2017-10-10 10:30',
}];


@Auth
class CrossTaskList extends React.Component {

  tabData = [];
  componentDidMount = () => {
    const params = { offset: 0, size: 10 };
    this.props.dispatch({ type: 'crossHeat/getTaskList', payload: params });
  };

  componentWillUpdate(nextProps, nextState) {
    const taskList = nextProps.crossHeat.taskList;
    if (this.props.crossHeat.taskList !== taskList) {
      this.formatData(taskList);
    }
  }

  formatData = (taskList) => {
    this.tabData = [];
    const statusVal = ['计算中', '已完成'];
    taskList.map((item) => {
      const title = item.queryTree1.name + " & " + item.queryTree2.name;
      const isOk = item.total === item.calculated ? 1 : 0;
      const status = statusVal[isOk];
      const id = item._id;
      const date = new Date(item.timestamp * 1000);
      this.tabData.push({ title, status, date: date.toLocaleString(), id });
      return true;
    });
  }

  createCross = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  };
  onDelete = (id, record) => {
    Modal.confirm({
      title: record.name,
      content: '您确定删除吗？',
      onOk() {
        console.log('delete', id);
      },
    });
  };
  onCheck = (value) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/report/' + value,
    }));
  };

  render() {
    const loading = this.props.loading.effects['crossHeat/getTaskList'];
    const columns = [{
      title: '名称',
      dataIndex: 'title',
      render: text => <span >{text}</span>,
    }, {
      title: '状态',
      dataIndex: 'status',
      render: text => <span >{text}</span>,
    }, {
      title: '开始时间',
      dataIndex: 'date',
      render: text => <span >{text}</span>,
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => (
        <span>
            <a href="#" onClick={this.onCheck.bind(this, text)}>查看</a>
            <span className="ant-divider" />
            <a href="#" onClick={this.onDelete.bind(this, text, record)}>删除</a>
        </span>
      ),
    }];
    return (
      <Layout searchZone={[]} contentClass={tc(['queryList'])} showNavigator={false}>
        <div className={ styles.bar}>
          <Button type="primary" icon="plus" size="large" onClick={this.createCross}>创建</Button>
        </div>
        <Spinner loading={loading} size="large" />
        {this.tabData.length > 0 &&
        <Table columns={columns} key={Math.random()} dataSource={this.tabData}
               rowKey={record => record.id} />
        }
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({
  app,
  loading,
  crossHeat,
}))(CrossTaskList);

