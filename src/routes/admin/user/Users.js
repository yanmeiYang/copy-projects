/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { Table, Tabs, Spin, Modal, Input, Radio, Button } from 'antd';
import { connect } from 'dva';
import { Layout } from 'routes';
import { RequireAdmin } from 'hoc';
import { sysconfig, applyTheme } from 'systems';
import { contactByJoint, getValueByJoint } from 'services/seminar';
import styles from './Users.less';

const tc = applyTheme(styles);
const TabPane = Tabs.TabPane;
const { Column } = Table;
const RadioGroup = Radio.Group;

@connect(({ app, auth, universalConfig }) => ({ app, auth, universalConfig }))
@RequireAdmin
export default class Users extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // FIXME yanmei: 没用的东西不要放到state里面。（可能都有用，我只是测试你能不能看到FIXME）;
  state = {
    visible: false,
    currentRole: '',
    currentAuthority: '',
    currentUid: '',
    committee: false,
    isModifyRegion: false,
    selectedRole: '',
    selectedAuthority: '',
    editUserId: '',
    editUserNewName: '',
    defaultTabKey: 'active',
    parentOrg: null,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'auth/getCategoryByUserRoles',
      payload: { category: 'user_roles' },
    });
    this.props.dispatch({
      type: 'auth/listUsersByRole',
      payload: { offset: 0, size: 100 },
    });
  }

  onEdit = (type, e) => {
    const data = JSON.parse(e.target.getAttribute('data'));
    if (type === 'role') {
      if (!data) {
        console.warn('onEdit: attribute data not valid ');
      }
      const currentOrg = this.props.auth.userRoles.filter(item => item.value.key === data.new_role);
      if (currentOrg.length > 0) {
        if (currentOrg[0].value.value.id) {
          this.props.dispatch({
            type: 'universalConfig/setCategory',
            payload: { category: currentOrg[0].value.value.id },
          });
          this.setState({ committee: true });
        } else {
          this.setState({ committee: false });
        }
      }
      this.setState({
        visible: true,
        parentOrg: currentOrg[0].value.value.name,
        currentRole: data.new_role,
        currentAuthority: `authority_${data.authority}`,
        currentUid: data.id,
        selectedRole: data.new_role,
        selectedAuthority: `authority_${data.authority}`,
      });
    } else if (type === 'info') {
      this.setState({ editUserId: data.id });
    }
  };

  selectedAuthorityRegion = (e) => {
    const role = e.target.value;
    this.setState({ selectedAuthority: role, committee: true });
  };

  delCurrentRoleByUid = (uid, roles) => {
    roles.map((role) => {
      return this.props.dispatch({
        type: 'auth/delRoleByUid',
        payload: { uid, role },
      });
    });
  };

  addRoleByUid = (uid, roles) => {
    roles.map((role) => {
      return this.props.dispatch({
        type: 'auth/addRoleByUid',
        payload: { uid, role },
      });
    });
  };

  handleOk = () => {
    const uid = this.state.currentUid;
    const currentAuthority = this.state.currentAuthority;
    const selectedAuthority = this.state.selectedAuthority;
    const selectedRole = this.state.selectedRole;
    const currentRole = this.state.currentRole;

    if (this.state.isModifyRegion) {
      console.log('必须修改所属部门');
      if (selectedAuthority === currentAuthority) {
        alert('必须修改所属部门');
      } else {
        // 删除当前的role和authority
        this.delCurrentRoleByUid(uid, [currentAuthority, currentRole]);

        // 增加新选择的role和authority
        this.addRoleByUid(uid, [selectedRole, selectedAuthority]);
      }
      this.setState({ visible: false });
    } else if (this.state.currentAuthority) {
      if (this.state.committee) {
        this.delCurrentRoleByUid(uid, [currentAuthority]);
        this.addRoleByUid(uid, [selectedAuthority]);
      } else {
        // 删除当前role
        this.delCurrentRoleByUid(uid, [currentRole, currentAuthority]);
        this.addRoleByUid(uid, [selectedRole]);
      }
      this.setState({ visible: false });
    }
  };

  handleCancel = () => this.setState({ visible: false });

  selectedRole = (e) => {
    const data = e.target.data;
    const role = data.key;
    if (data.value !== '') {
      this.setState({ committee: true, isModifyRegion: true, selectedRole: role });
      this.props.dispatch({
        type: 'universalConfig/setCategory',
        payload: { category: data.value.id },
      });
    } else {
      this.setState({
        committee: false,
        isModifyRegion: false,
        selectedRole: role,
      });
    }
  };

  goCreateUser = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/registered' }));
  };

  onForbidUser = (e) => {
    const data = JSON.parse(e.target.getAttribute('data'));
    const uid = data.id;
    const role = 'forbid';
    const props = this.props;
    Modal.confirm({
      title: '禁用',
      content: '确定禁用吗？',
      onOk() {
        props.dispatch({
          type: 'auth/addForbidByUid',
          payload: { uid, role },
        });
      },
      onCancel() {
      },
    });
  };

  openForbid = (e) => {
    const data = JSON.parse(e.target.getAttribute('data'));
    const uid = data.id;
    const role = 'forbid';
    this.props.dispatch({
      type: 'auth/delRoleByUid',
      payload: { uid, role },
    });
  };

  i18nGenderTable = { male: '男', female: '女' };
  i18nGender = gender => this.i18nGenderTable[gender] || '';
  operatorRender = (text, record) => {
    return (
      <div>
        {this.state.defaultTabKey === 'active' &&
        <span>
          {/*<a onClick={this.onEdit.bind(this, 'info')} data={JSON.stringify(text)}>修改信息</a>*/}
          {/*<span className="ant-divider" />*/}
          {sysconfig.ShowRegisteredRole &&
          <sapn>
            <a onClick={this.onEdit.bind(this, 'role')} data={JSON.stringify(text)}>修改角色</a>
            <span className="ant-divider" />
          </sapn>}
          <a onClick={this.onForbidUser.bind(this)} data={JSON.stringify(text)}>禁用</a>
        </span>
        }
        {this.state.defaultTabKey === 'forbid' &&
        <span>
          <a onClick={this.openForbid.bind(this)} data={JSON.stringify(text)}>启用</a>
        </span>
        }
      </div>
    );
  };
  updateName = () => {
    console.log(this.state.editUserNewName);
    this.props.dispatch({
      type: 'auth/updateProfile',
      payload: { uid: this.state.editUserId, name: this.state.editUserNewName },
    });
    this.setState({ editUserId: '' });
  };
  getNewName = (e) => {
    this.setState({ editUserNewName: e.target.value });
  };
  showUpdateName = (e) => {
    return (
      <div>
        {e.id === this.state.editUserId ?
          <div style={{ display: 'flex' }}>
            <Input defaultValue={e.display_name} onBlur={this.getNewName} />
            <Button onClick={this.updateName}>保存</Button></div>
          : e.display_name
        }
      </div>
    );
  };

  onTabChange = (key) => {
    this.setState({ defaultTabKey: key });
  };

  render() {
    const { loading, userRoles } = this.props.auth;
    const listUsers = [];
    if (this.props.auth.listUsers) {
      this.props.auth.listUsers.map((item) => {
        if (this.state.defaultTabKey === 'active' && !item.role.includes(`${sysconfig.SOURCE}_forbid`)) {
          if (!sysconfig.Admin_Users_ShowAdmin && !item.role.includes(`${sysconfig.SOURCE}_超级管理员`)) {
            listUsers.push(item);
          } else if (sysconfig.Admin_Users_ShowAdmin) {
            listUsers.push(item);
          }
        }
        if (this.state.defaultTabKey === 'forbid' && item.role.includes(`${sysconfig.SOURCE}_forbid`)) {
          listUsers.push(item);
        }
        return true;
      });
    }

    const { universalConfig } = this.props;
    const { committee, selectedAuthority, selectedRole } = this.state;
    return (
      <Layout searchZone={[]} contentClass={tc(['userList'])} showNavigator={false}>
        <div className="content-inner" style={{ maxWidth: '1228px' }}>
          <div className="toolsArea">
            <Button type="primary" size="large" style={{}} onClick={this.goCreateUser}>创建用户</Button>
          </div>
          <h2 className={styles.pageTitle}>用户管理</h2>
          {sysconfig.UserAuthSystem === 'aminer' &&
          <div>也可以使用AMiner账号登录</div>
          }
          <Tabs defaultActiveKey={this.state.defaultTabKey} type="card" onChange={this.onTabChange}>
            <TabPane tab="活动用户" key="active" />
            <TabPane tab="禁用用户" key="forbid" />
          </Tabs>

          <Spin spinning={loading}>
            <Table
              className={styles.userListTable}
              dataSource={listUsers}
              bordered
              size="small"
              pagination={false}
            >
              <Column title="姓名" dataIndex="" key="display_name"
                      render={this.showUpdateName} />
              <Column title="邮箱" dataIndex="email" key="email" />
              {/* <Column title="职称" dataIndex="position" key="position"/> */}
              {/* <Column title="性别" dataIndex="gender" key="gender" render={this.i18nGender} /> */}
              <Column title="角色" dataIndex="new_role" key="role" />
              {sysconfig.ShowRegisteredRole &&
              <Column title="所属部门" dataIndex="authority" key="committee"
                      render={key => getValueByJoint(key)} />}
              <Column title="操作" dataIndex="" key="action" render={this.operatorRender} />
            </Table>
          </Spin>
          <Modal
            title="修改角色"
            visible={this.state.visible}
            confirmLoading={this.state.confirmLoading}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            {userRoles &&
            <div style={{ width: '100%' }}>
              <h5>角色：</h5>
              <RadioGroup onChange={this.selectedRole.bind()} value={selectedRole}>
                {
                  userRoles.map((item) => {
                    return (<Radio key={Math.random()}
                                   value={`${item.value.key}`}
                                   data={item.value}>{item.value.key}</Radio>);
                  })
                }
              </RadioGroup>
              {committee &&
              <div><h5>所属部门：</h5>
                <RadioGroup size="large" onChange={this.selectedAuthorityRegion.bind()}
                            value={selectedAuthority}>
                  {
                    universalConfig.data.map((item) => {
                      const val = `authority_${contactByJoint(this.state.parentOrg, item.value.key)}`;
                      return (
                        <Radio key={Math.random()} className={styles.twoColumnsShowRadio}
                               value={val}>{item.value.key}</Radio>
                      );
                    })
                  }
                </RadioGroup>
              </div>}
            </div>
            }
          </Modal>
        </div>
      </Layout>
    );
  }
}
