/**
 * Created by ranyanchuan on 2017/9/1.
 */

import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Button, Modal, Table, Icon, Input } from 'antd';
import { Layout } from 'routes';
import { Auth } from 'hoc'
import { applyTheme } from 'themes';
import styles from './crossHeatList.less';

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
class CrossHeatList extends React.Component {
  componentDidMount = () => {
    const params = { offset: 0, size: 10 };
    this.props.dispatch({ type: 'crossHeat/getUserQuerys', payload: params });
  };
  createCross = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross',
    }));
  };
  // search query
  onSearch = (value) => {
    // console.log('search', value);
  };

  onEdit = (value) => {
    // console.log('edit', value);
  };

  onDelete = (id, record) => {
    Modal.confirm({
      title: record.name,
      content: '您确定删除吗？',
      onOk() {
        // console.log('delete', id);
      },
    });
  };
  onCheck = (value) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/heat/query/' + value,
    }));
  };

  render() {

    console.log(this.props.crossHeat.userQuerys);
    console.log("============");

    const columns = [{
      title: '名称',
      dataIndex: 'name',
      render: text => <span >{text}</span>,
    }, {
      title: '状态',
      dataIndex: 'status',
      render: text => <span >{text}</span>,
    }, {
      title: '开始时间',
      dataIndex: 'beginTime',
      render: text => <span >{text}</span>,
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => <span >{text}</span>,
    }, {
      title: '操作',
      dataIndex: 'id',
      render: (text, record) => (
        <span>
            <a href="#" onClick={this.onCheck.bind(this, text)}>查看</a>
            <span className="ant-divider" />
            <a href="#" onClick={this.onEdit.bind(this, text)}>编辑</a>
            <span className="ant-divider" />
            <a href="#" onClick={this.onDelete.bind(this, text, record)}>删除</a>
        </span>
      ),
    }];
    return (
      <Layout searchZone={[]} contentClass={tc(['queryList'])} showNavigator={false}>
        <div className={ styles.bar}>
          <Button type="primary" icon="plus" onClick={this.createCross}>创建</Button>
          <Search
            placeholder="input query"
            className={styles.searchWrap}
            onSearch={this.onSearch}
          />
        </div>
        <Table columns={columns} key={Math.random()} dataSource={data}
               rowKey={record => record.id} />
      </Layout>
    );
  }
}
export default connect(({ app, loading, crossHeat }) => ({
  app,
  loading,
  crossHeat,
}))(CrossHeatList);

