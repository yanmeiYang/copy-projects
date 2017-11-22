import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { RequireGod } from 'hoc';
import { Table, Tabs, Tag, Button } from 'antd';
import { system } from '../../../utils';
import styles from './UserList.less';

const { Column } = Table;
const { TabPane } = Tabs;

@connect(({ app, user }) => ({ app, user }))
@RequireGod
export default class UserList extends Component {
  state = {
    tab: 'ccf',
  };

  componentDidMount() {
    this.getUserList(this.state.tab);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tab !== prevState.tab) {
      this.getUserList(this.state.tab);
    }
  }

  onChangeSystem(key) {
    this.setState({ tab: key });
  }

  getUserList(key) {
    this.props.dispatch({
      type: 'user/listUsersByRole',
      payload: { offset: 0, size: 300, source: key },
    });
  }

  goCreateUser = () => {
    const taskUrl = this.state.tab;
    this.props.dispatch(routerRedux.push({
      pathname: '/2b/users/create',
      search: `?src=${taskUrl}`,
    }));
  };

  render() {
    const { listUsers } = this.props.user;
    return (
      <div className={styles.userList}>
        <div className={styles.title}>
          <h2>用户管理</h2>
          <Button type="primary" size="large" onClick={this.goCreateUser}>创建用户</Button>
        </div>
        <div className={styles.box}>
          <Tabs
            activeKey={this.state.tab}
            tabPosition="left"
            onTabClick={this.onChangeSystem.bind(this)}
          >
            {system.AvailableSystems &&
            system.AvailableSystems.map((sys) => {
              if (sys === 'aminer') {
                return <TabPane tab="" key={sys} />;
              } else {
                return <TabPane tab={sys} key={sys} />;
              }
            })
            }
          </Tabs>
          <div className={styles.tableBox}>
            <Table
              dataSource={listUsers}
              bordered
              size="small"
              pagination={false}
              rowKey={(record) => record.id}

            >
              <Column title="姓名" dataIndex="display_name" key="name" />
              <Column title="邮箱" dataIndex="email" key="email" />
              <Column title="角色" dataIndex="role" key="role"
                      render={role => (role.map(tag => (<Tag key={tag}>{tag}</Tag>)))} />
              <Column title="所属部门" dataIndex="authority" key="committee" />
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
