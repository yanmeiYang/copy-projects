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
  state = { committee: false, region: false };

  checkEmail = (e) => {
    this.props.dispatch({ type: 'auth/checkEmail', payload: e.target.value });
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: 'user_roles' },
    });
  }

  selectedRole = (e) => {
    console.log(e);
    if (e === 'ccf_CCF专委秘书长') {
      this.setState({ committee: true, region: false });
      //获取所有的专委
      this.props.dispatch(
        {
          type: 'universalConfig/setCategory',
          payload: { category: 'technical-committee' },
        });
    }
    else if (e === 'ccf_分部秘书长') {
      this.setState({ region: true, committee: false });
    }
    else {
      this.setState({ region: false, committee: false });
    }

  };

  selectedAuthority = (e) => {
    console.log(e)
  };
  selectedAuthorityRegion = (e) => {
    console.log(e)
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
    const { committee, region } = this.state;
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
              <Input onBlur={this.checkEmail}/>
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
              <Input type='text'/>
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
          {...formItemLayout}
          label='角色'
          hasFeedback
        >
          {
            getFieldDecorator('role', {
              rules: [{
                required: true, message: '请选择角色!',
              }],
            })(
              <Select onChange={this.selectedRole.bind()}>
                {
                  this.props.universalConfig.userRoles.map((item) => {
                    return (<Option key={Math.random()}
                                    value={'ccf_' + item.key}>{item.key}</Option>)
                  })
                }
              </Select>
            )
          }
        </FormItem>
        {committee && <FormItem
          {...formItemLayout}
          label='权限'
          hasFeedback
        >
          {
            getFieldDecorator('authority', {
              rules: [{
                required: true, message: '请选择权限!',
              }],
            })(
              <Select onChange={this.selectedAuthority.bind()}>
                {
                  this.props.universalConfig.data.map((item) => {
                    return (<Option key={Math.random()} value={'ccf_authority_' + item.key}>{item.key}</Option>)
                  })
                }
              </Select>
            )
          }
        </FormItem>}
        {region && <FormItem
          {...formItemLayout}
          label='权限'
          hasFeedback>
          {
            getFieldDecorator('authority_region', {
              rules: [{
                required: true, message: '请选择权限!',
              }],
            })(
              <Select onChange={this.selectedAuthorityRegion.bind()}>
                <Option value='ccf_authority_上海'>上海</Option>
                <Option value='ccf_authority_北京'>北京</Option>
                <Option value='ccf_authority_石家庄'>石家庄</Option>
              </Select>
            )
          }

        </FormItem>}
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

export default connect(({ auth, universalConfig }) => ({ auth, universalConfig }))(WrappedRegistrationForm);
