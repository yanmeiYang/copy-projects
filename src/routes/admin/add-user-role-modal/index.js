/**
 * Created by yangyanmei on 17/7/25.
 */
import React from 'react';
import { connect } from 'dva';
import { Input, Select, Modal, Form } from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;

class AddRoleModal extends React.PureComponent {
  state = {
    visible: false,
    currentRole: {},
    currentOrg: {},
  }
  handleOk = (e) => {
    this.props.handleOk(this.state.currentRole, this.state.currentOrg);
    this.props.form.setFieldsValue({ role: '', value: '' });
  };
  handleCancel = () => { this.props.handleCancel(); };

  handleChange = (value) => {
    const data = JSON.parse(value);
    this.setState({ currentOrg: { name: data.key, id: data.id } });
  }
  selectedRole = (e) => {
    this.setState({
      currentRole: {},
      currentOrg: {},
    });
    this.props.universalConfig.orgList = [];
    const data = JSON.parse(e);
    if (data.key === '超级管理员') {
      this.setState({ currentRole: { name: data.key, id: data.key } });
    } else {
      this.setState({ currentRole: { name: data.key, id: data.id } });
    }
    if (data.value !== '') {
      this.props.dispatch({
        type: 'universalConfig/getOrgCategory',
        payload: { category: data.value.id },
      });
    }
  }
  render() {
    const { value } = this.state;
    const { visible, universalConfig } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const keyError = isFieldTouched('key') && getFieldError('key');
    const valueError = isFieldTouched('value') && getFieldError('value');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal
        title="添加角色"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <div style={{ width: '100%' }}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              validateStatus={keyError ? 'error' : ''}
              help={keyError || ''}
              label="角色名称"
            >
              {
                getFieldDecorator('role', {
                  rules: [{
                    required: true, message: '请选择角色!',
                  }],
                })(
                  <Select onChange={this.selectedRole}>
                    {
                      universalConfig.userRoles.map((key) => {
                        return (<Option
                          key={Math.random()}
                          value={JSON.stringify(key.value)}
                        >{key.value.key}</Option>);
                      })
                    }
                  </Select>,
                )
              }
            </FormItem>

            {universalConfig.orgList.length > 0 &&
            <FormItem
              {...formItemLayout}
              validateStatus={valueError ? 'error' : ''}
              help={valueError || ''}
              label="选择机构"
            >
              {getFieldDecorator('value', {
                rules: [{ required: false, message: 'Please input value!' }],
              })(
                <Select onChange={this.handleChange}>
                  {universalConfig.orgList.map((item) => {
                    return <Option value={JSON.stringify(item.value)} key={item.value.id}>{item.value.key}</Option>
                  })}
                </Select>,
              )}
            </FormItem>
            }
          </Form>
        </div>
      </Modal>
    );
  }
}

export default connect(({ universalConfig }) => ({ universalConfig }))(Form.create()(AddRoleModal));
