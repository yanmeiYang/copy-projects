/**
 * Created by yangyanmei on 17/6/29.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Icon, Row, Col, Button, Select, Checkbox, AutoComplete } from 'antd';
import { sysconfig } from '../../../systems';
const FormItem = Form.Item;
const Option = Select.Option;
const AutocompleteOption = AutoComplete.Option;

class Registered extends React.Component {
  state = {};

  checkEmail = (e) => {
    this.props.dispatch({ type: 'auth/checkEmail', payload: e.target.value });
  };

  registered = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.gender = parseInt(values.gender);
        values.position = parseInt(values.position);
        this.props.dispatch({ type: 'auth/createUser', payload: values });
      }
    })
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
      }
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
        }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.registered} style={{ marginTop: 30 }}>
        <FormItem {...formItemLayout} label='邮箱'
                  validateStatus={this.props.auth.validEmail ? '' : 'error'}
                  help={this.props.auth.validEmail ? '' : '该邮箱已注册'}
                  hasFeedback>
          {
            getFieldDecorator('email', {
              rules: [{ type: 'email', message: '邮箱格式错误!', }, {
                required: true,
                message: '请输入邮箱!',
              }, {
                validator: this.props.auth.validEmail ? '' : '邮箱已注册',
              }],
            }, {
              validateTrigger: 'onBlur'
            })(
              <Input onBlur={this.checkEmail} />
            )
          }

        </FormItem>
        <FormItem
          {...formItemLayout}
          label='姓氏'
          hasFeedback
        >
          {
            getFieldDecorator('first_name', {
              rules: [{
                required: true, message: '请输入您的姓氏!',
              }],
            })(
              <Input type='text' />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='名字'
          hasFeedback
        >
          {
            getFieldDecorator('last_name', {
              rules: [{
                required: true, message: '请输入您的名字!',
              }],
            })(
              <Input />
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='性别'
          hasFeedback
        >
          {
            getFieldDecorator('gender', {
              rules: [{
                required: true, message: '请输入您的性别!',
              }],
            })(
              <Select>
                <Option value='1'>男</Option>
                <Option value='2'>女</Option>
                <Option value='3'>保密</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label='职位'
          hasFeedback
        >
          {
            getFieldDecorator('position', {
              rules: [{
                required: true, message: '请输入您的职位!',
              }],
            })(
              <Select>
                {
                  sysconfig.CCF_userPosition.map((item) => {
                    return (<Option key={Math.random()} value={item.value}>{item.name}</Option>)
                  })
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...{
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 14, offset: 6 },
            }
          }}
          label=''
        >
          {
            getFieldDecorator('sub', {})(
              <Checkbox>
                我希望收到新的消息和动态提醒
              </Checkbox>
            )
          }
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' onClick={this.registered}>
            注册
          </Button>
        </FormItem>

      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(Registered);

export default connect(({ auth }) => ({ auth }))(WrappedRegistrationForm);
