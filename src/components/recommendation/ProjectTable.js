/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Tooltip, Icon } from 'antd';
import {
  defineMessages,
  injectIntl,
  FormattedMessage as FM,
  FormattedRelative as FR,
} from 'react-intl';
import styles from './ProjectTable.less';

const messages = defineMessages({
  projectName: { id: 'rcd.projectTable.header.projectName', defaultMessage: 'Project Name' },
  taskCount: { id: 'rcd.projectTable.header.taskCount', defaultMessage: 'Task Count' },
  progress: { id: 'rcd.projectTable.header.progress', defaultMessage: 'Progress' },
  status: { id: 'rcd.projectTable.header.status', defaultMessage: 'Status' },
  createTime: { id: 'rcd.projectTable.header.createTime', defaultMessage: 'Create Time' },
  updateTime: { id: 'rcd.projectTable.header.updateTime', defaultMessage: 'Update Time' },
  actions: { id: 'rcd.projectTable.header.actions', defaultMessage: 'Actions' },
});

@injectIntl
export default class ProjectTable extends React.PureComponent {
  constructor(props) {
    super(props);
    const { intl } = props;
    this.intl = intl;

    this.columns = [{
      title: intl.formatMessage(messages.projectName),
      dataIndex: 'title',
      key: 'projectName',
      render: (_, r) => (<Link to={`/rcd/project/tasks/${r.id}`}>{r.title}</Link>),
    }, {
      title: intl.formatMessage(messages.taskCount),
      dataIndex: 'taskCount',
      key: 'taskCount',
    }, {
      title: intl.formatMessage(messages.progress),
      dataIndex: 'progress',
      key: 'progress',
      render: text => `${text} %`,
    }, {
      title: intl.formatMessage(messages.status),
      dataIndex: 'status',
      key: 'status',
    }, {
      title: intl.formatMessage(messages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (intl.formatRelative(record.createTime)),
    }, {
      title: intl.formatMessage(messages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => (intl.formatRelative(record.updateTime) )
    }, {
      title: intl.formatMessage(messages.actions),
      dataIndex: 'address',
      key: 'action',
    }];
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.projects === this.props.projects) {
      return false;
    }
    return true;
  }

  render() {
    const { projects } = this.props;
    return (
      <div className={styles.orgs}>
        <div className={styles.box}>
          <Table dataSource={projects} columns={this.columns} rowKey={record => record.id}
                 bordered size="small"
          />
        </div>
      </div>
    );

  }
}
