import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Table, Breadcrumb, Tooltip } from 'antd';
import { Auth } from 'hoc';
import { isGod } from 'utils/auth';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { classnames } from 'utils/index';
import styles from './report.less';

const tc = applyTheme(styles);
@connect(({ app, reco }) => ({ app, reco }))
@Auth

export default class Reports extends Component {
  state = {

    data: [],
    projectInfo: [],
    resultsOverview: [],
    pushEffect: [],
    datas: [],
  };

  componentDidMount() {
    this.fetch();
  }

  // 获取数据
  fetch = () => {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'reco/getReport',
      payload: { projectId: [id] },
    }).then((data) => {
      console.log('allalala',data)
      this.setState({ pushEffect: data, datas: data[0].links });
    });
  };
  // 格式化时间
  resetTime = (time) => {
    if(time) {
      const wrongTime = time.replace('T', ' ');
      const createTime = wrongTime.split('.');
      return createTime[0];
    }

  };
  // 计算各种率
  computeRate = (a, b) => {
    if (a === 0 || b === 0) {
      return 0;
    } else {
      const rate =Math.round((parseInt(a, 10) * 100) / parseInt(b, 10));
      return `${rate}%`;
    }
  };
  // 判断proj现在的状态
  projStatus = (status) => {
    if (status === 0) {
      return '完成';
    } else {
      return '进行中';
    }
  };

  render() {
    const { roles } = this.props.app;
    const projectInfo = [{
      title: '项目名称',
      dataIndex: 'title',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: createTime => <span>{this.resetTime(createTime)}</span>,
    }, {
      title: '包含论文数量',
      render: tasks => <span>{tasks.tasks.length}</span>,
    }, {
      title: '预期推送数量',
      dataIndex: 'progress', //TODO 这个字段有问题,记得改
    }, {
      title: '状态',
      dataIndex: 'status',
      render: status => <span>{this.projStatus(status)}</span>,
    }];
    const resultsOverview = [{
      title: '总发送量',
      dataIndex: 'statistic.all_send_count',
      className: isGod(roles) ? styles.show : styles.hidden,
    }, {
      title: '成功发送',
      dataIndex: 'statistic.success_send_count',
    }, {
      title: '打开次数',
      dataIndex: 'statistic.all_open_count',
    }, {
      title: '打开人数',
      dataIndex: 'statistic.unique_open_count',
    }, {
      title: '邮件打开率',
      render: text => <Tooltip title="打开人数除以邮件发送数">
        {this.computeRate(text.statistic.unique_open_count, text.statistic.success_send_count)}</Tooltip>,
    }, {
      title: '点击次数',
      dataIndex: 'statistic.all_click_count',
    }, {
      title: '点击人数',
      dataIndex: 'statistic.unique_click_count',
    }, {
      title: '点击跳转率',
      render: tasks => <Tooltip title="点击人数除以点击次数">
        {this.computeRate(tasks.statistic.unique_click_count, tasks.statistic.unique_open_count)}</Tooltip>,
    }
    ];
    const pushEffect = [
      {
        title: '推送论文',
        key: '1',
        render: tasks => <a href={`/${tasks.url}`}
                            target="_blank"><span>{tasks.title}</span></a>,
        width: 200,
      }, {
        title: '点击次数',
        dataIndex: 'statistic.all_click_count',
      }, {
        title: '点击人数',
        key: '2',
        render: tasks => <Link
          to={`/viewperson/${tasks.id}`}>{tasks.statistic.unique_click_count}</Link>,
      }, {
        title: '点击率',
        key: '3',
        render: tasks =>
          <span>
            {this.computeRate(tasks.statistic.all_click_count, tasks.statistic.all_click_count)}
          </span>
        // TODO 加跳转链接
      }];
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <div className={styles.report}>
          <div className={styles.navbar}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item href="/project">项目列表</Breadcrumb.Item>
              <Breadcrumb.Item>推送报告</Breadcrumb.Item>
            </Breadcrumb>
            {/*<Link to="/project"> <Button type='primary'>返回项目列表</Button></Link>*/}
          </div>
          <div className={styles.content}>
            <div className={styles.projectInfo}>
              <h4>推送项目信息</h4>
              <Table rowKey={record => record.id} columns={projectInfo}
                     dataSource={this.state.pushEffect}
                     size="middle" />
            </div>
            <div className={styles.resultsOverview}>
              <h4>效果总览</h4>
              <Table rowKey={record => record.id} bordered columns={resultsOverview}
                     dataSource={this.state.pushEffect} size="middle" />
            </div>
            <div className={styles.pushEffect}>
              <h4>论文推送效果详情</h4>
              <Table rowKey={record => record.id} bordered columns={pushEffect}
                     dataSource={this.state.datas}
                     size="middle" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
