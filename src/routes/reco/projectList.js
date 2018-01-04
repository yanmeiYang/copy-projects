import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Button, Table, Menu, Dropdown, Icon, Divider } from 'antd';
import { sysconfig } from 'systems';
import { Auth } from 'hoc';
import { Layout } from 'routes';
import { theme, applyTheme } from 'themes';
import { classnames } from 'utils/index';
import CreateProject from './createProject';
import EditProject from './editProject';
import styles from './projectList.less';
import { isGod } from "utils/auth";

const tc = applyTheme(styles);
@connect(({ app, recoModels }) => ({ app, recoModels }))
@Auth

export default class ProjectList extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    test: '',
    projdata: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'reco/getProjectById',
      payload: {
        ids: [],
        searchType: "reviewer_project",
        offset: 0,
        size: 100,
      },
    }).then((data) => {
      this.setState({ projdata: data });
      console.log('data', data)
    })
  }

  handleMenuClick = (e) => {
    this.setState({
      filteredInfo: e.item.props.children,
    });
  };
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };
  setAgeSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  };
// 所有操作按键处理方法
  allOperation = (record) => {
    const { roles } = this.props.app;
    const { status } = record;
    const newStatus = status + 1;
    return (
      <div>
        {newStatus !== 6 &&
        <Link to={`/editproject/${record.id}`} onClick={this.changeEdit}>编辑</Link>}
        {newStatus !== 6 && <Divider type="vertical" />}
        {newStatus !== 6 &&
        <Link to={`/sendtest/${record.id}`} onClick={this.changeEdit}>测试邮件</Link>}
        {newStatus !== 6 && <Divider type="vertical" />}
        {(isGod(roles) && newStatus !== 6) &&
        <Link to={`/sendemail/${record.id}`} onClick={this.changeEdit}>抓取邮件</Link>}
        {(isGod(roles) && newStatus !== 6) && <Divider type="vertical" />}
        {newStatus === 6 && <Link to={`/reports/${record.id}`}>报告</Link>}
      </div>
    )
  };
  // 格式化时间
  resetTime = (time) => {
    if (time) {
      const wrongTime = time.replace('T', ' ');
      const createTime = wrongTime.split('.');
      return createTime[0];
    } else {
      return '';
    }
  };
  // 处理状态显示
  resetStatus = (status) => {
    const newStatus = status + 1
    if (newStatus) {
      if (newStatus === 1) {
        return ' 创建完成'
      } else if (newStatus === 2) {
        return '开始抓取'
      } else if (newStatus === 3) {
        return '抓取完成'
      } else if (newStatus === 4) {
        return '已发送测试邮件'
      } else if (newStatus === 5) {
        return '模板确认'
      } else if (newStatus === 6) {
        return '群发完成'
      }
    }
  };

  render() {
    const { roles } = this.props.app;
    const { projdata } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: 'Project Name',
      dataIndex: 'title',
      key: 'projectName',
    }, {
      title: 'Create Time',
      dataIndex: 'createTime',
      render: createTime => <span>{this.resetTime(createTime)}</span>,
    }, {
      title: 'Organization',
      dataIndex: 'organization',
      key: 'organization',
      filteredValue: filteredInfo.organization || null,
      onFilter: (record) => record.organization.includes(),
    }, {
      title: 'creator',
      dataIndex: 'creator',
      key: 'creator',
    }, {
      title: 'Status',
      dataIndex: 'status',
      render: status => <span>{this.resetStatus(status)}</span>
      // TODO add filter
    }, {
      title: 'Operate',
      key: 'Operate',
      render: (record) => (
        <span>{this.allOperation(record)}</span>
      ),
    }];
    const org = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">All org</Menu.Item>
        <Menu.Item key="2">清华学报</Menu.Item>
        <Menu.Item key="3">test</Menu.Item>
      </Menu>
    );
    const status = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">All status</Menu.Item>
        <Menu.Item key="3">In Operation</Menu.Item>
        <Menu.Item key="4">In Operation</Menu.Item>
        <Menu.Item key="5">Waiting</Menu.Item>
      </Menu>
    );
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <div className={styles.projectList}>
          <div className={styles.navbar}>
            <div className={styles.tabBox}>
              <Link to="/project"><Button>Project List</Button></Link>
              <Link to="/createproject"><Button>Create New Project</Button></Link>
            </div>
            <div>
              <Dropdown overlay={org} className={styles.dropdown}>
                <Button style={{ marginLeft: 8 }}>
                  All Organization <Icon type="down" />
                </Button>
              </Dropdown>
              <Dropdown overlay={status}>
                <Button style={{ marginLeft: 8 }}>
                  All Status <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className={styles.content}>
            <Table columns={columns}
                   rowKey={(record) => Math.random()}
                   dataSource={projdata} onChange={this.handleChange} />
          </div>
        </div>
      </Layout>
    )
  }
}
