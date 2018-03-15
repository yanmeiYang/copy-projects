import React, { Component } from 'react';
import { connect, Link, routerRedux, withRouter } from 'engine';
import {
  Button,
  Table,
  Menu,
  Dropdown,
  Icon,
  Divider,
  Spin,
  Popconfirm,
  message,
  Pagination,
} from 'antd';
import { Auth } from 'hoc';
import { applyTheme } from 'themes';
import { Layout } from 'components/layout';
import { queryString } from 'utils';
import { isAuthed, isGod } from 'utils/auth';
import styles from './index.less';

@connect(({ app, recoModels }) => ({ app, recoModels }))
@Auth @withRouter
export default class ProjectList extends Component {
  state = {
    projdata: [],
    filterData: [],
    loading: true,
    count: 0,
    current: 1,
    currentStatus: '全部项目',
    currentYear: '2018年',
  };

  componentWillMount() {
    const { location } = this.props;
    let { n } = queryString.parse(location.search || {});
    n = parseInt(n) || 1;
    this.featch((n - 1) * 10);
    this.setState({ current: n });
    this.getProjectListCount('2018', 'all');

  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    let { n } = queryString.parse(location.search || {});
    n = parseInt(n) || 1;
    if (this.state.current !== n) {
      this.featch((n - 1) * 10);
      this.setState({ current: n });
    }
  }

  status = {
    all: { status: { gte: 0 } },
    action: { status: { lt: 5 } },
    done: { status: 5 },
    全部项目: { status: { gte: 0 } },
    待推送: { status: { lt: 5 } },
    已完成: { status: 5 },
  };

  years = {
    all: ['2019-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    2017: ['2018-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    2018: ['2019-01-01T00:00:00+08:00', '2018-01-01T00:00:00+08:00'],
    全部报告: ['2019-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    '2017年': ['2018-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    '2018年': ['2019-01-01T00:00:00+08:00', '2018-01-01T00:00:00+08:00'],
  };

  // 获取pro列表方法
  featch = (page) => {
    this.setState({ loading: true });
    const { currentYear, currentStatus } = this.state;
    this.props.dispatch({
      type: 'reco/getProjectList',
      payload: {
        offset: page,
        and: [
          { create_time: { lt: this.years[currentYear][0] } },
          { create_time: { gte: this.years[currentYear][1] } },
          this.status[currentStatus],
        ],
      },
    }).then((data) => {
      this.setState({ filterData: data, loading: false });
    });
  };

  // 获取projlist总数
  getProjectListCount = (year, status) => {
    this.props.dispatch({
      type: 'reco/getProjectListConut',
      payload: {
        and: [
          { create_time: { lt: this.years[year][0] } },
          { create_time: { gte: this.years[year][1] } },
          this.status[status],
        ],
      },
    }).then((data) => {
      this.setState({ count: data.items[0] || 5 });
    });
  };

  // 所有操作按键处理方法
  allOperation = (record) => {
    const roles = this.props.app.get('roles');
    const { status } = record;
    const newStatus = status + 1;
    return (
      <div>
        {isAuthed(roles) &&
        <Link to={`/reco/project/edit/${record.id}`}>编辑</Link>}
        {isAuthed(roles) && <Divider type="vertical" />}
        <Link to={`/reco/project/view/${record.id}`}>查看</Link>
        <Divider type="vertical" />
        {isAuthed(roles) &&
        <Link to={`/reco/project/copy/${record.id}`}>复制</Link>}
        {isAuthed(roles) && <Divider type="vertical" />}
        {(newStatus !== 6 && isAuthed(roles)) &&
        <Link to={`/reco/email/test/${record.id}`}>测试邮件</Link>}
        {(newStatus !== 6 && isAuthed(roles)) && <Divider type="vertical" />}
        {(isAuthed(roles) && newStatus !== 6) &&
        <Link to={`/reco/email/catch/${record.id}`}>抓取邮件</Link>}
        {(isAuthed(roles) && newStatus !== 6) && <Divider type="vertical" />}
        {newStatus >= 6 &&
        <Link to={`/reco/reports/${record.id}`}>查看报告</Link>}
        {newStatus >= 6 && <Divider type="vertical" />}
        {isAuthed(roles) &&
        <Popconfirm title="你确定要删除么?" id="deleteConfirm"
                    onConfirm={this.confirm.bind(this, record.id)}
                    okText="确定" cancelText="取消">
          <a href="#">删除</a>
        </Popconfirm>}
      </div>
    );
  };

  // 删除确认的两个事件
  confirm = (id) => {
    this.props.dispatch({
      type: 'reco/deleteProjById',
      payload: {
        ids: id,
      },
    }).then((data) => {
      message.success('删除成功！');
      if (data) {
        this.featch();
      }
    });
  };

  // 格式化时间
  resetTime = (time) => {
    if (time) {
      const formatFunc = (str) => {
        return str > 9 ? str : `0${str}`;
      };
      const date2 = new Date(time);
      const year = date2.getFullYear();
      const mon = formatFunc(date2.getMonth() + 1);
      const day = formatFunc(date2.getDate());
      let hour = date2.getHours();
      const noon = hour >= 12 ? 'PM' : 'AM';
      hour = hour >= 12 ? hour - 12 : hour;
      hour = formatFunc(hour);
      const min = formatFunc(date2.getMinutes());
      const dateStr = `${year}-${mon}-${day} ${noon} ${hour}:${min}`;
      return dateStr;
    }
  };

  // 处理状态显示
  resetStatus = (status) => {
    const newStatus = status + 1;
    switch (newStatus) {
      case 1:
        return '待推送';
      case 2:
        return '待推送';
      case 3:
        return '待推送';
      case 4:
        return '待推送';
      case 5:
        return '推送中';
      case 6:
        return '已完成';
      default:
        return '';
    }
  };
  // 状态筛选filter
  filterStatus = (data) => {
    const { currentYear, current } = this.state;
    this.setState({ loading: true });
    this.getProjectListCount(currentYear, data.key);
    this.props.dispatch({
      type: 'reco/getProjectList',
      payload: {
        offset: current,
        and: [
          { create_time: { lt: this.years[currentYear][0] } },
          { create_time: { gte: this.years[currentYear][1] } },
          this.status[data.key]],
      },
    }).then((pdata) => {
      this.setState({
        filterData: pdata,
        currentStatus: data.item.props.children,
        loading: false,
      });
    });
  };
  // 按年查询
  filterByyears = (data) => {
    this.setState({ loading: true });
    this.getProjectListCount(data.key, this.state.currentStatus);
    this.props.dispatch({
      type: 'reco/getProjectList',
      offset: this.state.current,
      payload: {
        and: [
          { create_time: { lt: this.years[data.key][0] } },
          { create_time: { gte: this.years[data.key][1] } },
          this.status[this.state.currentStatus],
        ],
      },
    }).then((pdata) => {
      this.setState({
        filterData: pdata,
        currentYear: data.item.props.children,
        loading: false,
      });
    });
  };
// 分页
  onPageChange = (page) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/reco`,
      search: `?n=${page}`
    }));
  };

// TODO @xiaobei: 等org列表回来，在写一个期刊的筛选方法

  render() {
    const { filterData, loading, count, current, currentStatus, currentYear } = this.state;
    const roles = this.props.app.get('roles');
    const columns = [{
      title: '项目名称',
      dataIndex: 'title',
      key: 'projectName',
      width: 200,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: createTime => <span>{this.resetTime(createTime)}</span>,
    }, {
      title: '组织',
      dataIndex: 'organization',
      key: 'organization',
      width: 130,
    }, {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: status => <span>{this.resetStatus(status)}</span>,
    }, {
      title: '操作',
      key: 'Operate',
      render: record => (
        <span>{this.allOperation(record)}</span>
      ),
    }];
    const org = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">所有期刊</Menu.Item>
        <Menu.Item key="2">清华学报</Menu.Item>
        <Menu.Item key="3">test</Menu.Item>
      </Menu>
    );
    const status = (
      <Menu onClick={this.filterStatus}>
        <Menu.Item key="all">全部项目</Menu.Item>
        <Menu.Item key="action">待推送</Menu.Item>
        <Menu.Item key="done">已完成</Menu.Item>
      </Menu>
    );
    const years = (
      <Menu onClick={this.filterByyears}>
        <Menu.Item key="all">全部报告</Menu.Item>
        <Menu.Item key="2017">2017年</Menu.Item>
        <Menu.Item key="2018">2018年</Menu.Item>
      </Menu>
    );
    return (
      <Layout searchZone={[]} showNavigator={false} pageTitle="projectlist">
        <div className={styles.projectList}>
          <div className={styles.navbar}>
            <div className={styles.tabBox}>
              <Link to="/reco/project/create">
                <Button>新建项目</Button>
              </Link>
            </div>
            <div>
              <Dropdown overlay={org} className={styles.dropdown}>
                <Button style={{ marginLeft: 8 }}>
                  全部期刊 <Icon type="down" />
                </Button>
              </Dropdown>
              <Dropdown overlay={status}>
                <Button style={{ marginLeft: 8 }}>
                  {currentStatus} <Icon type="down" />
                </Button>
              </Dropdown>
              <Dropdown overlay={years}>
                <Button style={{ marginLeft: 8 }}>
                  {currentYear} <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
          <div className={styles.content}>
            <Spin spinning={loading}>
              <Table columns={columns} pagination={false}
                     rowKey={() => Math.random()}
                     dataSource={filterData} onChange={this.handleChange} />
            </Spin>
          </div>
          <div className={styles.paginationWrap}>
            <Pagination
              showQuickJumper
              current={current}
              defaultCurrent={1}
              // defaultPageSize={['1']}
              total={count}
              onChange={this.onPageChange}
            />
          </div>
        </div>
      </Layout>
    );
  }
}
