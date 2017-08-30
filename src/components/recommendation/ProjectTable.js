/**
 *  Created by BoGao on 2017-08-23;
 */
import React from 'react';
import { Link } from 'dva/router';
import { Table, Tooltip, Icon } from 'antd';
import { FormattedMessage as FM, FormattedDate as FD } from 'react-intl';
import styles from './ProjectTable.less';

const columns = [{
  title: 'Project Name',
  dataIndex: 'title',
  key: 'projectName',
}, {
  title: 'Task Count',
  dataIndex: 'taskCount',
  key: 'taskCount',
}, {
  title: 'Progress',
  dataIndex: 'progress',
  key: 'progress',
}, {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
}, {
  title: 'Create Time',
  dataIndex: 'createTime',
  key: 'createTime',
}, {
  title: 'Update Time',
  dataIndex: 'updateTime',
  key: 'updateTime',
}, {
  title: 'Action',
  dataIndex: 'address',
  key: 'action',
}];


export default class ProjectTable extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  //   // this.personLabel = props.personLabel;
  // }

  state = {};

  shouldComponentUpdate(nextProps) {
    if (nextProps.orgs === this.props.orgs) {
      return false;
    }
    return true;
  }


  render() {
    const { projects } = this.props;
    console.log('亲们！projects is: ', projects);
    return (
      <div className={styles.orgs}>
        <div className={styles.box}>
          <Table dataSource={projects} columns={columns}
                 rowKey={record => record.id} />

          {
            projects && projects.map((project) => {
              console.log('loop project: ', project.desc);
            })
          }
        </div>
      </div>
    );

  }
}
