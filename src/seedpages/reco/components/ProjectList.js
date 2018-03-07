/**
 *
 */
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
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import { queryString } from 'utils';
import { isAuthed, isGod } from 'utils/auth';
import styles from './ProjectList.less';

const tc = applyTheme(styles);

@connect(({ app, recoModels }) => ({ app, recoModels }))
@Auth @withRouter
export default class ProjectList extends Component {
  state = {
    projdata: [],
    filterData: [],
    loading: true,
    count: 0,
    current: 1,
    currentStatus: '全部状态',
    currentYear: '2018年',
  };

  componentWillMount() {
    const { location } = this.props;
    let { n } = queryString.parse(location.search || {});
    n = parseInt(n) || 1;

    this.featch((n - 1) * 10);
    this.setState({ current: n });

    this.getProjectListCount('2018年');
  }

  componentWillReceiveProps(nextProps) {
    console.log('>>>>>>>>>>>>', nextProps);
    const { location } = nextProps;
    let { n } = queryString.parse(location.search || {});
    n = parseInt(n) || 1;
    if (this.state.current !== n) {
      this.featch((n - 1) * 10);
      this.setState({ current: n });
    }
  }

  dfa = {
    '全部状态': [0, 1, 2, 3, 4, 5],
    '待推送': [0, 1, 2, 3, 4],
    '已完成': [5],
  };

  years = {
    '全部报告': ['2019-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    '2017年': ['2018-01-01T00:00:00+08:00', '2017-01-01T00:00:00+08:00'],
    '2018年': ['2019-01-01T00:00:00+08:00', '2018-01-01T00:00:00+08:00'],
  };

  // 获取pro列表方法
  featch = (page) => {
    this.setState({ loading: true });
    this.props.dispatch({
      type: 'reco/getProjectList',
      payload: {
        ids: [],
        searchType: 'reviewer_project',
        offset: page,
        size: 10,
        filters: {
          and: [
            { create_time: { lt: '2019-01-01T00:00:00+08:00' } },
            { create_time: { gte: '2018-01-01T00:00:00+08:00' } },
          ],
        },
      },
    }).then((data) => {
      this.setState({ projdata: data, filterData: data, loading: false });
    });
  };
  // 获取projlist总数
  getProjectListCount = (year) => {
    this.props.dispatch({
      type: 'reco/getProjectListConut',
      payload: {
        filters: {
          and: [
            { create_time: { lt: this.years[year][0] } },
            { create_time: { gte: this.years[year][1] } },
          ],
        },
      }
    }).then((data) => {
      this.setState({ count: data.items[0] || 5 });
    });
  };
// 所有操作按键处理方法
  allOperation = (record) => {
    const { roles } = this.props.app;
    const { status } = record;
    const newStatus = status + 1;
    return (
      <div>

        {isAuthed(roles) &&
        <Link to={`/editproject/${record.id}`} href={`/editproject/${record.id}`}
              onClick={this.changeEdit}>编辑
        </Link>}
        {isAuthed(roles) && <Divider type="vertical" />}

        <Link to={`/reco/project/view/${record.id}`}>查看</Link>

        <Divider type="vertical" />
        {(newStatus !== 6 && isAuthed(roles)) &&
        <Link to={`/sendtest/${record.id}`}
              href={`/sendtest/${record.id}`}
        >测试邮件
        </Link>}

        {(newStatus !== 6 && isAuthed(roles)) && <Divider type="vertical" />}
        {(isAuthed(roles) && newStatus !== 6) &&
        <Link to={`/sendemail/${record.id}`}
              href={`/sendemail/${record.id}`}>抓取邮件
        </Link>}
        {(isAuthed(roles) && newStatus !== 6) && <Divider type="vertical" />}

        {newStatus >= 6 && <Link to={`/reco/reports/${record.id}`}>查看报告</Link>}

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
  cancel = () => {
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
    const { roles } = this.props.app;
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
    const { projdata } = this.state;
    if (data.key !== '全部状态') {
      const newSource = projdata.filter((item) => {
        return this.dfa[data.key].includes(item.status);
      });
      this.setState({ filterData: newSource, currentStatus: data.key });
    } else {
      this.setState({ filterData: projdata, currentStatus: data.key });
    }
  };
  // 按年查询
  filterByyears = (data) => {
    this.setState({ loading: true });
    this.getProjectListCount(data.key);
    this.props.dispatch({
      type: 'reco/getProjectList',
      payload: {
        ids: [],
        searchType: 'reviewer_project',
        offset: 0,
        size: 10,
        filters: {
          and: [
            { create_time: { lt: this.years[data.key][0] } },
            { create_time: { gte: this.years[data.key][1] } },
          ],
        },
      },
    }).then((pdata) => {
      this.setState({
        projdata: pdata,
        filterData: pdata,
        currentYear: data.key,
        loading: false
      });
    });
  };

  // 分页
  onPageChange = (page) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/reco`,
      search: `?n=${page}`
    }));
    // this.props.dispatch(routerRedux.push('/user/info'));
  };

  // TODO @xiaobei: 等org列表回来，在写一个期刊的筛选方法

  render() {
    const { filterData, loading, count, current, currentStatus, currentYear } = this.state;
    const { roles } = this.props.app;
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
      width: 180,
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
        <Menu.Item key="全部状态">全部状态</Menu.Item>
        <Menu.Item key="待推送">待推送</Menu.Item>
        <Menu.Item key="已完成">已完成</Menu.Item>
      </Menu>
    );
    const years = (
      <Menu onClick={this.filterByyears}>
        <Menu.Item key="全部报告">全部报告</Menu.Item>
        <Menu.Item key="2017年">2017年</Menu.Item>
        <Menu.Item key="2018年">2018年</Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.projectList}>
        <div className={styles.navbar}>
          <div className={styles.tabBox}>
            <Link to="/createproject" href="/createproject">
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
    );
  }
}
