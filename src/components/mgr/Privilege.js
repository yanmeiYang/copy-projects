import React, { Component } from 'react';
import { routerRedux, Link, connect } from 'engine';
// import { sysconfig } from 'systems';
// import { queryURL } from 'utils';
// import { FormattedMessage as FM } from 'react-intl';
import { Collapse, Table, Icon, Divider } from 'antd';
import styles from './index.less';

@connect(({ app, search }) => ({ app, search }))
export default class Privilege extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  onRoleChange = () => {
  };

  render() {
    const Panel = Collapse.Panel;

    const columns = [
      {
        title: 'Privilege',
        dataIndex: 'Privilege',
        key: 'Privilege',
        render: text => <a>{text}</a>,
      }, {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
      },
    ];

    const data = [
      {
        // key: '1',
        Privilege: 'TODO',
        Status: 'TODO',
      },
    ];
    const roles = this.props.app.get('roles').role;
    return (
      <Collapse onChange={this.onRoleChange} className={styles.collapse}>
        {roles && roles.map((role) => {
          return (
            <Panel header={role} key={Math.random()}>
              <Table columns={columns} dataSource={data} pagination={false} size="small" />
            </Panel>
          );
        })}
      </Collapse>
    );
  }
}
