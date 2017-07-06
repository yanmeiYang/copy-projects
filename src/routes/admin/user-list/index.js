/**
 * Created by yangyanmei on 17/7/3.
 */
import React from 'react';
import { Table, Spin, Modal, Select, Radio } from 'antd';
import { connect } from 'dva';
import fetch from 'dva/fetch';
import { config } from '../../../utils';
const { ColumnGroup, Column } = Table;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class UserList extends React.Component {
  state = {
    visible: false,
    currentRole: '',
    currentAuthority: '',
    currentUid: '',
    committee: false,
    region: false,
    isModifyRegion: false,
    selectedRole: '',
    selectedAuthority: ''
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: 'user_roles' },
    });
    this.props.dispatch({ type: 'auth/listUsersByRole', payload: { role: 'ccf', offset: 0, size: 100 } });
  }

  selectedRole = (e) => {
    const role = e.target.value;
    if (role === 'ccf_CCF专委秘书长') {
      this.setState({ committee: true, region: false, isModifyRegion: true, selectedRole: role });
      //获取所有的专委
      this.props.dispatch(
        {
          type: 'universalConfig/setCategory',
          payload: { category: 'technical-committee' },
        });
    }
    else if (role === 'ccf_分部秘书长') {
      this.setState({ region: true, committee: false, isModifyRegion: true, selectedRole: role });
    }
    else {
      this.setState({ region: false, committee: false, isModifyRegion: false, selectedRole: role });
    }

  };
  selectedAuthorityRegion = (e) => {
    const role = e.target.value;
    this.setState({ selectedAuthority: role});
  };

  handleOk = () => {
    if (this.state.isModifyRegion) {
      console.log('必须修改region');
      if (this.state.selectedAuthority===this.state.currentAuthority){
        alert('必须修改所属部门');
      }else{
        //删除当前的role和authority
        this.props.dispatch({
          type: 'auth/delRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.currentAuthority }
        });
        this.props.dispatch({
          type: 'auth/delRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.currentRole }
        });

        //增加新选择的role和authority
        this.props.dispatch({
          type: 'auth/addRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.selectedRole }
        });
        this.props.dispatch({
          type: 'auth/addRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.selectedAuthority }
        });
      }
      this.setState({ visible: false });

    }
    else if (this.state.currentAuthority) {
      if (this.state.committee) {
        this.props.dispatch({
          type: 'auth/addRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.selectedAuthority }
        });
      } else {
        //删除当前role
        this.props.dispatch({
          type: 'auth/delRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.currentRole }
        });
        this.props.dispatch({
          type: 'auth/addRoleByUid',
          payload: { uid: this.state.currentUid, role: this.state.selectedRole }
        });
      }
      this.props.dispatch({
        type: 'auth/delRoleByUid',
        payload: { uid: this.state.currentUid, role: this.state.currentAuthority }
      });
      this.setState({ visible: false });
    }



  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  onEdit = (type, e) => {
    const uid = JSON.parse(e.target.getAttribute('data')).id;
    const role = 'ccf_' + JSON.parse(e.target.getAttribute('data')).new_role;
    const authority = 'ccf_authority_' + JSON.parse(e.target.getAttribute('data')).authority;
    if (role === 'ccf_CCF专委秘书长') {
      this.setState({ committee: true, region: false });
      //获取所有的专委
      this.props.dispatch(
        {
          type: 'universalConfig/setCategory',
          payload: { category: 'technical-committee' },
        });
    }
    else if (role === 'ccf_分部秘书长') {
      this.setState({ region: true, committee: false });
    }
    else {
      this.setState({ region: false, committee: false });
    }
    this.setState({ visible: true, currentRole: role, currentAuthority: authority, currentUid: uid, selectedRole:role,selectedAuthority:authority })
  };

  render() {
    const { listUsers, loading } = this.props.auth;
    const { currentRole, currentAuthority, committee, region, selectedAuthority,selectedRole } = this.state;
    return (
      <div>
        <Spin spinning={loading}>
          <Table
            dataSource={listUsers}
            bordered
            size="small"
            pagination={false}
          >
            <Column title="姓名" dataIndex="display_name" key="display_name"/>
            <Column title="职称" dataIndex="position" key="position"/>
            <Column title="性别" dataIndex="gender" key="gender" render={(text)=>{
              return text==='male'?'男':text==='female'?'女':'';
            }}/>
            <Column title="角色" dataIndex="new_role" key="role"/>
            <Column title="所属部门" dataIndex="authority" key="committee"/>
            <Column title="操作" dataIndex="" key="action"
                    render={(text, record) => {
                      return ( <span>
                  <a onClick={this.onEdit.bind(this, 'role')} data={JSON.stringify(text)}>修改角色</a></span>
                      )
                    }}/>

          </Table>
        </Spin>
        <Modal title="第一个 Modal" visible={this.state.visible}
               confirmLoading={this.state.confirmLoading} onOk={this.handleOk} onCancel={this.handleCancel}>
          <div style={{ width: '100%' }}>
            {/*select 不显示option。不知道为啥*/}
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
              <RadioGroup onChange={this.selectedAuthorityRegion.bind()} value={selectedAuthority}>
                {
                  this.props.universalConfig.data.map((item) => {
                    return (<Radio key={Math.random()} value={'ccf_authority_' + item.key}>{item.key}</Radio>)
                  })
                }
              </RadioGroup></div>}
            {region && <div><h5>所属部门：</h5>
              <RadioGroup onChange={this.selectedAuthorityRegion.bind()} value={selectedAuthority}>
                <Radio value='ccf_authority_上海'>上海</Radio>
                <Radio value='ccf_authority_北京'>北京</Radio>
                <Radio value='ccf_authority_石家庄'>石家庄</Radio>
              </RadioGroup></div>}
          </div>
        </Modal>
      </div>
    )
      ;
  }
}

export default connect(({ auth, universalConfig }) => ({ auth, universalConfig }))(UserList);
