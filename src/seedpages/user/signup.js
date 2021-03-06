/**
 * Created by yangyanmei on 17/6/29.
 */
import React from 'react';
import { connect, FormCreate, routerRedux } from 'engine';
import { Form, Input, Button, Select, Modal } from 'antd';
import { Layout } from 'components/layout';
import { sysconfig } from 'systems';
import { theme, applyTheme } from 'themes';
import { contactByJoint, getValueByJoint } from 'services/seminar'; // TODO special things.
import styles from './signup.less';
// import AddRoleModal from '../add-user-role-modal';

const tc = applyTheme(styles);
// const AutocompleteOption = AutoComplete.Option;t

@FormCreate()
@connect(({ app, auth, universalConfig }) => ({ app, auth, universalConfig }))
export default class Signup extends React.Component {
  state = {
    addRoleModalVisible: false,
    currentRoleAndOrg: '',
    errorMessageByEmail: '',
    selectedOrgName: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'auth/getCategoryByUserRoles',
      payload: { category: 'user_roles' },
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
      this.props.dispatch({ type: 'auth/checkEmail', payload: { email: e.target.value } });
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
        payload: { category: data.value.id },
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
  // addRole = () => {
  //   this.setState({ addRoleModalVisible: true });
  //   this.props.dispatch({
  //     type: 'universalConfig/setCategory',
  //     payload: { category: 'user_roles' },
  //   });
  // }
  // setCurrentRoleAndOrg = (role, org) => {
  //   let name = '';
  //   let id = '';
  //   if (org.name === undefined) {
  //     name = role.name;
  //     id = `${config.source}_${role.id}`;
  //   } else {
  //     name = `${role.name} ${org.name}`;
  //     id = `${config.source}_${role.id}_${org.id}`;
  //   }
  //   const data = [...this.state.currentRoleAndOrg, { name, id }];
  //   this.setState({ currentRoleAndOrg: data, addRoleModalVisible: false });
  // };
  // delRole = (value) => {
  //   const currentRoleAndOrg = this.state.currentRoleAndOrg.filter(tag => tag.id !== value.id);
  //   this.setState({ currentRoleAndOrg });
  // }


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
        that.props.dispatch({ type: 'auth/createUser', payload: data });
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
    const { errorMessageByEmail } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { universalConfig, auth } = this.props;
    return (
      <Layout searchZone={[]} contentClass={tc(['signup'])}
              showNavigator={sysconfig.Seminar_Admin_ShowNavigator} showSidebar>
        <h2 className={styles.title}>创建用户</h2>
        <Form onSubmit={this.registered}>
          <Form.Item
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
              })(
                <Input onBlur={this.checkEmail} />,
              )
            }

          </Form.Item>
          <Form.Item
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
          </Form.Item>
          <Form.Item
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
          </Form.Item>
          {sysconfig.Signup_Password &&
          <Form.Item
            {...formItemLayout}
            label="登录密码"
            hasFeedback
          >
            {
              getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码!',
                }],
              })(
                <Input />,
              )
            }
          </Form.Item>}
          {/* 选择的角色 */}
          {/* <FormItem {...tailFormItemLayout}>*/}
          {/* {currentRoleAndOrg.map((item, index) => {*/}
          {/* return <Tag closable afterClose={this.delRole.bind(this, item)} key={item.id} >{item.name}</Tag>;*/}
          {/* })}*/}
          {/* </FormItem>*/}
          {/* <FormItem {...tailFormItemLayout}>*/}
          {/* <Button type="" onClick={this.addRole} style={{ backgroundColor: '#1aaa55', borderColor: '#168f48', color: '#fff' }}>添加角色</Button>*/}
          {/* </FormItem>*/}
          {/* <AddRoleModal visible={this.state.addRoleModalVisible} handleOk={this.setCurrentRoleAndOrg} />*/}
          {sysconfig.ShowRegisteredRole &&
          <Form.Item
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
                      return (<Select.Option
                        key={Math.random()}
                        value={JSON.stringify(key.value)}
                      >{key.value.key}</Select.Option>);
                    })
                  }
                </Select>,
              )
            }
          </Form.Item>
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
                      return (<Select.Option
                        key={Math.random()}
                        value={JSON.stringify(item.value)}
                      >{item.value.key}</Select.Option>);
                    })
                  }
                </Select>,
              )
            }
          </FormItem>}
          {/*<FormItem*/}
          {/*{...{*/}
          {/*wrapperCol: {*/}
          {/*xs: { span: 24 },*/}
          {/*sm: { span: 14, offset: 6 },*/}
          {/*},*/}
          {/*}}*/}
          {/*label=""*/}
          {/*>*/}
          {/*{*/}
          {/*getFieldDecorator('sub', {})(*/}
          {/*<Checkbox>*/}
          {/*我希望收到新的消息和动态提醒*/}
          {/*</Checkbox>,*/}
          {/*)*/}
          {/*}*/}
          {/*</FormItem>*/}
          {/*<FormItem {...tailFormItemLayout}>*/}
          {/*<Button type="" onClick={this.addRole} style={{ backgroundColor: '#1aaa55', borderColor: '#168f48', color: '#fff' }}>添加角色</Button>*/}
          {/*</FormItem>*/}
          {/*<AddRoleModal visible={this.state.addRoleModalVisible} handleOk={this.setCurrentRoleAndOrg} />*/}

          <Form.Item {...tailFormItemLayout} className={styles.footerBtn}>
            <Button type="primary" onClick={this.registered}>
              创建用户
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}
