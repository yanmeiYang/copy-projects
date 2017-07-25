/**
 * Created by yangyanmei on 17/6/29.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Modal, Tag } from 'antd';
import { config } from '../../../utils';
import { sysconfig } from '../../../systems';
import AddRoleModal from '../add-user-role-modal';

const FormItem = Form.Item;
const Option = Select.Option;
// const AutocompleteOption = AutoComplete.Option;

class Registered extends React.Component {
  state = {
    addRoleModalVisible: false,
    currentRoleAndOrg: [],
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: 'user_roles' },
    });
  }
  checkEmail = (e) => {
    this.props.dispatch({ type: 'auth/checkEmail', payload: `${e.target.value}@ccf` });
  };

  selectedRole = (e) => {
    const data = JSON.parse(e);
    if (data.value !== '') {
      this.props.dispatch({
        type: 'universalConfig/getOrgCategory',
        payload: { category: data.value.id },
      });
    }
  };
  addRole = () => {
    this.setState({ addRoleModalVisible: true });
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: 'user_roles' },
    });
  }
  setCurrentRoleAndOrg = (role, org) => {
    let name = '';
    let id = '';
    if (org.name === undefined) {
      name = role.name;
      id = `${config.source}_${role.id}`;
    } else {
      name = `${role.name} ${org.name}`;
      id = `${config.source}_${role.id}_${org.id}`;
    }
    const data = [...this.state.currentRoleAndOrg, { name, id }];
    this.setState({ currentRoleAndOrg: data, addRoleModalVisible: false });
  };
  delRole = (value) => {
    const currentRoleAndOrg = this.state.currentRoleAndOrg.filter(tag => tag.id !== value.id);
    this.setState({ currentRoleAndOrg });
  }


  registered = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.gender = 3;
        values.position = 8;
        values.sub = true;
        values.src = config.source;
        values.role = this.state.currentRoleAndOrg;
        this.props.dispatch({ type: 'auth/createUser', payload: values });
        Modal.success({
          title: '创建用户',
          content: '创建成功',
        });
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const { currentRoleAndOrg } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { universalConfig, auth } = this.props;
    return (
      <Form onSubmit={this.registered} style={{ marginTop: 30 }}>
        <FormItem
          {...formItemLayout}
          label="邮箱"
          validateStatus={auth.validEmail ? '' : 'error'}
          help={auth.validEmail ? '' : '该邮箱已注册'}
          hasFeedback
        >
          {
            getFieldDecorator('email', {
              rules: [{ type: 'email', message: '邮箱格式错误!' }, {
                required: true,
                message: '请输入邮箱!',
              }, {
                validator: auth.validEmail ? '' : '邮箱已注册',
              }],
            }, {
              validateTrigger: 'onBlur',
            })(
              <Input onBlur={this.checkEmail} />,
            )
          }

        </FormItem>
        <FormItem
          {...formItemLayout}
          label="姓氏"
          hasFeedback
        >
          {
            getFieldDecorator('first_name', {
              rules: [{
                required: true, message: '请输入您的姓氏!',
              }],
            })(
              <Input type="text" />,
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="名字"
          hasFeedback
        >
          {
            getFieldDecorator('last_name', {
              rules: [{
                required: true, message: '请输入您的名字!',
              }],
            })(
              <Input />,
            )
          }
        </FormItem>
        {/* 选择的角色 */}
        <FormItem {...tailFormItemLayout}>
          {currentRoleAndOrg.map((item, index) => {
            return <Tag closable afterClose={this.delRole.bind(this, item)} key={item.id} >{item.name}</Tag>;
          })}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="" onClick={this.addRole} style={{ backgroundColor: '#1aaa55', borderColor: '#168f48', color: '#fff' }}>添加角色</Button>
        </FormItem>
        <AddRoleModal visible={this.state.addRoleModalVisible} handleOk={this.setCurrentRoleAndOrg} />

        <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.registered} style={{ width: '50%' }}>
            创建用户
          </Button>
        </FormItem>


      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(Registered);

export default connect(({ auth, universalConfig, app }) => ({ auth, universalConfig, app }))(WrappedRegistrationForm);
