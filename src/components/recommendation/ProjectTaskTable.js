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
import styles from './ProjectTaskTable.less';

const messages = defineMessages({
  taskName: { id: 'rcd.taskTable.header.taskName', defaultMessage: 'Task Name' },
  createTime: { id: 'rcd.taskTable.header.createTime', defaultMessage: 'Create Time' },
  updateTime: { id: 'rcd.taskTable.header.updateTime', defaultMessage: 'Update Time' },
  progress: { id: 'rcd.taskTable.header.progress', defaultMessage: 'Progress' },
  status: { id: 'rcd.taskTable.header.status', defaultMessage: 'Status' },
  actions: { id: 'rcd.taskTable.header.actions', defaultMessage: 'Actions' },
});

@injectIntl
export default class ProjectTable extends React.PureComponent {
  constructor(props) {
    super(props);
    const { intl } = props;
    this.intl = intl;

    this.columns = [{
      title: intl.formatMessage(messages.taskName),
      dataIndex: 'title',
      key: 'projectName',
      render: (_, r) => (<Link to={`/rcd/project/tasks/${r.id}`}>{r.title}</Link>),
    }, {
      title: intl.formatMessage(messages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text, record) => (intl.formatRelative(record.createTime)),
    }, {
      title: intl.formatMessage(messages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (text, record) => (intl.formatRelative(record.updateTime)),
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
      title: intl.formatMessage(messages.actions),
      dataIndex: 'address',
      key: 'action',
    }];
  }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.tasks === this.props.tasks) {
      return false;
    }
    return true;
  }

  render() {
    const { tasks } = this.props;
    return (
      <div className={styles.orgs}>
        <div className={styles.box}>
          <Table dataSource={tasks} columns={this.columns} rowKey={record => record.id}
                 bordered size="small"
          />
        </div>
      </div>
    );

  }
}
