/**
 * Created by yangyanmei on 17/7/3.
 *
 * Formatted by bogao on 17/7/15. -_-
 */
import React from 'react';
import { routerRedux } from 'dva/router';
import { Table, Spin, Modal, Select, Radio, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { config } from '../../../utils';
import { classnames } from '../../../utils';

const { Column } = Table;
const RadioGroup = Radio.Group;
console.log('sajdf;lasjd;flj;');

class UserList extends React.Component {

  constructor(props) {
    super(props);
    console.log('>>>>>>>>>>>>>>>>>>>');
  }

  state = {
    visible: false,
    currentRole: '',
    currentAuthority: '',
    currentUid: '',
    committee: false,
    region: false,
    isModifyRegion: false,
    selectedRole: '',
    selectedAuthority: '',
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>>>>>');
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: 'user_roles' },
    });
    this.props.dispatch({
      type: 'auth/listUsersByRole',
      payload: { role: 'ccf', offset: 0, size: 100 },
    });
  }

  onEdit = (type, e) => {
    const data = JSON.parse(e.target.getAttribute('data'));
    if (!data) {
      console.warn('onEdit: attribute data not valid ',);
    }
    const uid = data.id;
    const role = `ccf_${data.new_role}`;
    const authority = `ccf_authority_${data.authority}`;

    // TODO HardCode-CCF
    if (role === 'ccf_CCF专委秘书长') {
      this.setState({ committee: true, region: false });
      // 获取所有的专委
      this.props.dispatch({
        type: 'universalConfig/setCategory',
        payload: { category: 'technical-committee' },
      });
    } else if (role === 'ccf_分部秘书长') {
      this.setState({ region: true, committee: false });
    } else {
      this.setState({ region: false, committee: false });
    }
    this.setState({
      visible: true,
      currentRole: role,
      currentAuthority: authority,
      currentUid: uid,
      selectedRole: role,
      selectedAuthority: authority,
    });
  };

  selectedAuthorityRegion = (e) => {
    const role = e.target.value;
    this.setState({ selectedAuthority: role });
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
    const role = e.target.value;
    if (role === 'ccf_CCF专委秘书长') {
      this.setState({ committee: true, region: false, isModifyRegion: true, selectedRole: role });
      // 获取所有的专委
      this.props.dispatch({
        type: 'universalConfig/setCategory',
        payload: { category: 'technical-committee' },
      });
    } else if (role === 'ccf_分部秘书长') {
      this.setState({ region: true, committee: false, isModifyRegion: true, selectedRole: role });
    } else {
      this.setState({
        region: false,
        committee: false,
        isModifyRegion: false,
        selectedRole: role,
      });
    }
  };

  goCreateUser = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/registered' }));
  };

  i18nGenderTable = { male: '男', female: '女' };
  i18nGender = gender => this.i18nGenderTable[gender] || '';
  operatorRender = (text, record) => {
    return (
      <span>
        <a onClick={this.onEdit.bind(this, 'role')} data={JSON.stringify(text)}>修改</a>
      </span>
    );
  };

  render() {
    console.log('lsdkjfa;sjdf;ajsd;lfkjas;ldkj')
    const { listUsers, loading } = this.props.auth;
    const { committee, region, selectedAuthority, selectedRole } = this.state;
    return (
      <div className="content-inner">
        <div className="toolsArea">
          <Button type="primary" size="large" style={{}} onClick={this.goCreateUser}>创建用户</Button>
        </div>
        <h2 className={styles.pageTitle}>用户设置</h2>

        <Spin spinning={loading}>
          <Table
            dataSource={listUsers}
            bordered
            size="small"
            pagination={false}
          >
            <Column title="姓名" dataIndex="display_name" key="display_name" />
            <Column title="邮箱" dataIndex="email" key="email" />
            {/* <Column title="职称" dataIndex="position" key="position"/> */}
            <Column title="性别" dataIndex="gender" key="gender" render={this.i18nGender} />
            <Column title="角色" dataIndex="new_role" key="role" />
            <Column title="所属部门" dataIndex="authority" key="committee" />
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
          <div style={{ width: '100%' }}>
            <h5>角色：</h5>
            <RadioGroup onChange={this.selectedRole.bind()} value={selectedRole}>
              {
                this.props.universalConfig.userRoles.map((item) => {
                  return (<Radio key={Math.random()}
                                 value={'ccf_' + item.key}>{item.key}</Radio>)
                })
              }
            </RadioGroup>
            {committee && <div><h5>所属部门：</h5>
              <RadioGroup size="large" onChange={this.selectedAuthorityRegion.bind()}
                          value={selectedAuthority}>
                {
                  this.props.universalConfig.data.map((item) => {
                    return (
                      <Radio key={Math.random()} className={styles.twoColumnsShowRadio}
                             value={`ccf_authority_${item.key}`}>{item.key}</Radio>
                    );
                  })
                }
              </RadioGroup>
            </div>}
            {region && <div><h5>所属部门：</h5>
              <RadioGroup
                size="large"
                style={{ width: '100%' }}
                onChange={this.selectedAuthorityRegion.bind()}
                value={selectedAuthority}
              >
                <Radio value="ccf_authority_上海" className={styles.twoColumnsShowRadio}>上海</Radio>
                <Radio value="ccf_authority_北京" className={styles.twoColumnsShowRadio}>北京</Radio>
                <Radio value="ccf_authority_石家庄" className={styles.twoColumnsShowRadio}>
                  石家庄
                </Radio>
              </RadioGroup>
            </div>}
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(({ auth, universalConfig }) => ({ auth, universalConfig }))(UserList);
