/* eslint-disable react/jsx-wrap-multilines,comma-dangle */
import React, { Component } from 'react';
import { connect, Link } from 'engine';
import { Table, Breadcrumb, Tooltip, Spin } from 'antd';
import { Auth } from 'hoc';
import { isAuthed, isGod } from 'utils/auth';
import { Layout } from 'components/layout';
import { applyTheme } from 'themes';
import ReportChart from '../components/ReportChart';
import styles from './$id.less';

const tc = applyTheme(styles);
@connect(({ app, reco }) => ({ app, reco }))
@Auth
export default class Reports extends Component {
  state = {
    pushEffect: [],
    datas: [],
    loading: true,
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
      this.setState({ pushEffect: data, datas: data[0].links, loading: false });
    });
  };
  // 格式化时间
  resetTime = (time) => {
    if (time) {
      const formatFunc = (str) => {
        return str > 9 ? str : '0' + str;
      }
      const date2 = new Date(time);
      const year = date2.getFullYear();
      const mon = formatFunc(date2.getMonth() + 1);
      const day = formatFunc(date2.getDate());
      let hour = date2.getHours();
      const noon = hour >= 12 ? 'PM' : 'AM';
      hour = hour >= 12 ? hour - 12 : hour;
      hour = formatFunc(hour);
      const min = formatFunc(date2.getMinutes());
      const dateStr = year + '-' + mon + '-' + day + ' ' + noon + ' ' + hour + ':' + min;
      return dateStr;
    }
  };
  // 计算各种率
  computeRate = (a, b) => {
    if (a === 0 || b === 0) {
      return 0;
    } else {
      const rate = Math.round((parseInt(a, 10) * 100) / parseInt(b, 10));
      return `${rate}%`;
    }
  };

  render() {
    const { roles } = this.props.app;
    const { loading, pushEffect } = this.state;
    const { id } = this.props.match.params;
    const projectInfo = [{
      title: '项目名称',
      dataIndex: 'title',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: createTime => <span>{this.resetTime(createTime)}</span>,
    }, {
      title: '包含论文数量',
      render: tasks => <span>{tasks.links.length}</span>,
    }, {
      title: '预期推送数量',
      dataIndex: 'query',
      render: (query) => {
        const data = JSON.parse(query);
        return data.parameters.size;
      }
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
      render: text =>
        <Tooltip title="打开人数除以邮件发送数">
          {this.computeRate(text.statistic.unique_open_count, text.statistic.success_send_count)}
        </Tooltip>,
    }, {
      title: '点击次数',
      dataIndex: 'statistic.all_click_count',
    }, {
      title: '点击人数',
      dataIndex: 'statistic.unique_click_count',
    }, {
      title: '点击跳转率',
      render: tasks =>
        <Tooltip title="点击人数除以点击次数">
          {this.computeRate(tasks.statistic.unique_click_count, tasks.statistic.unique_open_count)}
        </Tooltip>,
    },
    ];
    const pushEffects = [
      {
        title: '推送论文',
        key: '1',
        render: tasks =>
          <a href={`${tasks.url}`}
             target="_blank"><span>{tasks.name}</span>
          </a>,
        width: 200,
      }, {
        title: '点击次数',
        dataIndex: 'statistic.all_click_count',
      }, {
        title: '点击人数',
        key: '2',
        render: (record, tasks, index) => {
          const { id } = this.props.match.params;
          return (
            <Link to={`/reco/reports/view/${id}?n=${index}`} target="_blank">
              {tasks.statistic.unique_click_count}
            </Link>
          );
        }
      }, {
        title: '点击率',
        key: '3',
        render: (tasks) => {
          const allCount = tasks.statistic.unique_click_count;
          return (
            <span>
              {this.computeRate(allCount, pushEffect[0].statistic.unique_open_count)}
            </span>
          );
        }

        // TODO 加跳转链接
      }];
    return (
      <Layout searchZone={[]} contentClass={tc(['indexPage'])} showNavigator={false}>
        <div className={styles.report}>
          <div className={styles.navbar}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item href="/">项目列表</Breadcrumb.Item>
              <Breadcrumb.Item>推送报告</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className={styles.content}>
            <Spin spinning={loading}>
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
                <Table rowKey={record => record.id} bordered columns={pushEffects}
                       dataSource={this.state.datas}
                       size="middle" />
              </div>
            </Spin>
          </div>
          <ReportChart projId={id} />
        </div>
      </Layout>
    );
  }
}
