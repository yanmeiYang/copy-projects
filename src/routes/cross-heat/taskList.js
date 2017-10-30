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

@Auth
class CrossTaskList extends React.Component {

  state = {
    sortedInfo: {},
  };
  tabData = [];
  componentDidMount = () => {
    const params = { offset: 0, size: 50 };
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
      this.tabData.push({ title, status, date: item.timestamp, id });
      return true;
    });
    this.tabData.reverse();
  }

  createCross = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  };
  onDelete = (id, record) => {
    const that = this;
    Modal.confirm({
      title: record.name,
      content: '您确定删除吗？',
      onOk() {
        that.props.dispatch({ type: 'crossHeat/delTaskList', payload: { id } });
      },
    });
  };
  onCheck = (value) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/report/' + value,
    }));
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter,
    });
  }

  formatRelative = (text, record) => {
    const date = new Date(text * 1000);
    const formatDate = date.format('yyyy-MM-dd hh:mm:ss');
    return formatDate;
  }

  render() {
    const { sortedInfo } = this.state;
    const loading = this.props.loading.effects['crossHeat/getTaskList'];
    const columns = [{
      title: '名称',
      dataIndex: 'title',
      render: text => <span >{text}</span>,
    }, {
      title: '状态',
      dataIndex: 'status',
    }, {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.date - b.date,
      sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order,
      render: (text, record) => (this.formatRelative(text, record)),
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
          <Button type="primary" icon="plus" size="large" onClick={this.createCross}>挖掘热点</Button>
        </div>
        <Spinner loading={loading} size="large" />
        {this.tabData.length > 0 &&
        <Table columns={columns} dataSource={this.tabData} onChange={this.handleChange} />

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

