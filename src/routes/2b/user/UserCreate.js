import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Select, Modal } from 'antd';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { applyTheme } from 'themes';
import { contactByJoint } from 'services/seminar';
import styles from './UserCreate.less';
import { queryURL } from '../../../utils';

const tc = applyTheme(styles);
const FormItem = Form.Item;
const { Option } = Select;

class UserCreate extends Component {
  state = {
    currentRoleAndOrg: '',
    errorMessageByEmail: '',
    selectedOrgName: '',
    currentConfig: '',
    src: '',
    sigupPassword: '',
  };

  componentWillMount() {
    const source = queryURL('src');
    this.setState({ src: source });
    this.setState({ currentConfig: sysconfig.ShowRegisteredRole });
    this.setState({ sigupPassword: sysconfig.Signup_Password });
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'auth/getCategoryByUserRoles',
      payload: { category: 'user_roles', source: this.state.src },
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.validEmail !== this.props.auth.validEmail) {
      this.setState({ errorMessageByEmail: '邮箱已注册' });
    }
  };
  checkEmail = (e) => {
    this.setState({ errorMessageByEmail: '' });
    if (e.target.value !== '') {
      this.props.dispatch({ type: 'auth/checkEmail', payload: { email: e.target.value, source: this.state.src } });
    }
  };
  selectedRole = (e) => {
    this.props.universalConfig.orgList = [];
    const data = JSON.parse(e);
    this.setState({ currentRoleAndOrg: `${data.key}` });
    if (data.value !== '') {
      this.setState({ selectedOrgName: data.value.name });
      this.props.dispatch({
        type: 'universalConfig/getOrgCategory',
        payload: { category: data.value.id, source: this.state.src },
      });
    }
  };
  selectedOrg = (e) => {
    const arr = this.state.currentRoleAndOrg.split('_');
    if (arr.length > 2) {
      arr.pop();
    }
    let currentRoleAndOrg = '';
    if (this.state.selectedOrgName !== '') {
      currentRoleAndOrg = `${arr.join('_')}_${contactByJoint(this.state.selectedOrgName, JSON.parse(e).key)}`;
    } else {
      currentRoleAndOrg = `${arr.join('_')}_${JSON.parse(e).key}`;
    }
    this.setState({ currentRoleAndOrg });
  };
  registered = (e) => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        if (err.email) {
          that.props.auth.validEmail = false;
          if (err.email.errors.length > 0) {
            that.setState({ errorMessageByEmail: err.email.errors[0].message });
          } else {
            that.setState({ errorMessageByEmail: '' });
          }
        }
      }
      if (!err) {
        const data = values;
        data.gender = 3;
        data.position = 8;
        data.sub = true;
        data.role = this.state.currentRoleAndOrg;
        data.password = values.password || ' ';
        data.dispatch = this.props.dispatch;
        data.source = this.state.src;
        that.props.dispatch({ type: 'user/createUser', payload: data });
        Modal.success({
          title: '创建用户',
          content: sysconfig.Signup_Password ?
            <div>
              <p>创建成功, 请发邮件告知{data.email}</p>
              <p>登录密码: {data.password}</p>
            </div>
            : '创建成功',
          onOk() {
            that.props.dispatch(routerRedux.push({
              pathname: '/admin/users',
            }));
          },
        });
        that.props.form.resetFields();
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
    const { errorMessageByEmail, currentConfig, sigupPassword } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { universalConfig, auth } = this.props;
    return (
      <Layout searchZone={[]} contentClass={tc(['userCreate'])} showNavigator={false}>
        <h2 className={styles.title}>创建用户</h2>
        <Form onSubmit={this.registered}>
          <FormItem
            {...formItemLayout}
            label="邮箱"
            validateStatus={auth.validEmail === false ? 'error' : ''}
            help={auth.validEmail ? '' : errorMessageByEmail}
            hasFeedback
          >
            {
              getFieldDecorator('email', {
                rules: [{ type: 'email', message: '邮箱格式错误!' },
                  {
                    required: true, message: '请输入邮箱!',
                  }],
              }, {
                validateTrigger: 'onBlur',
              })(<Input onBlur={this.checkEmail} />)
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
              })(<Input type="text" />)
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
              })(<Input />)
            }
          </FormItem>
          {sigupPassword &&
          <FormItem
            {...formItemLayout}
            label="登录密码"
            hasFeedback
          >
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码!',
                }],
              })(<Input />)
            }
          </FormItem>}
          {currentConfig &&
          <FormItem
            {...formItemLayout}
            label="角色"
            hasFeedback
          >
            {
              getFieldDecorator('role', {
                rules: [{
                  required: true, message: '请选择角色!',
                }],
              })(
                <Select onChange={this.selectedRole}>
                  {
                    auth.userRoles.map((key) => {
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
          }
          {universalConfig.orgList.length > 0 && <FormItem
            {...formItemLayout}
            label="权限"
            hasFeedback
          >
            {
              getFieldDecorator('authority', {
                rules: [{
                  required: true, message: '请选择权限!',
                }],
              })(
                <Select onChange={this.selectedOrg.bind()}>
                  {
                    universalConfig.orgList.map((item) => {
                      return (<Option
                        key={Math.random()}
                        value={JSON.stringify(item.value)}
                      >{item.value.key}</Option>);
                    })
                  }
                </Select>,
              )
            }
          </FormItem>}
          <FormItem {...tailFormItemLayout} className={styles.footerBtn}>
            <Button type="primary" onClick={this.registered}>
              创建用户
            </Button>
          </FormItem>
        </Form>
      </Layout>
    );
  }
}

export default connect(
  ({ app, auth, universalConfig }) => ({
    app,
    auth,
    universalConfig,
  }))(Form.create()(UserCreate));
