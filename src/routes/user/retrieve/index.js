/**
 * Created by yangyanmei on 17/7/25.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { queryURL } from '../../../utils';
import styles from './index.less';

const FormItem = Form.Item;

class Retrieve extends React.Component {
  state = {
    confirmDirty: false,
  };
  componentWillMount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: true });
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.retrieve.token) {
      const outerThis = this;
      Modal.success({
        title: '成功',
        content: '初始化密码成功',
        onOk() {
          localStorage.setItem('token', outerThis.props.auth.retrieve.token);
          location.href = '/login';
          outerThis.props.dispatch(routerRedux.push({
            pathname: '/',
          }));
        },
      });
    }
  };
  componentWillUnmount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: false });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.identifier = decodeURIComponent(queryURL('email'));
      values.token = queryURL('token');
      values.src = queryURL('src');
      delete values.confirm;
      delete values.email;
      if (!err) {
        this.props.dispatch({ type: 'auth/retrievePw', payload: values });
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !value });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const headerProps = { location };
    const { getFieldDecorator } = this.props.form;
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
        xs: { span: 24 },
        sm: { span: 14, offset: 6 },
      },
    };
    const email = queryURL('email');
    return (
      <div>
        {/*<Header {...headerProps} />*/}
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.codeBox}>
              <div className={styles.forgot_top}>
                <h3>初始化密码</h3>
              </div>
              <div className={styles.form_mod}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                    {...formItemLayout}
                    label="邮箱"
                    hasFeedback
                  >
                    {getFieldDecorator('email', {
                      rules: [],
                    })(
                      <span>{ decodeURIComponent(email) }</span>,
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="密码"
                    hasFeedback
                  >
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true, message: '请输入密码!',
                      }, {
                        validator: this.checkConfirm,
                      }],
                    })(
                      <Input type="password" />,
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="确认密码"
                    hasFeedback
                  >
                    {getFieldDecorator('confirm', {
                      rules: [{
                        required: true, message: '请输入密码!',
                      }, {
                        validator: this.checkPassword,
                      }],
                    })(
                      <Input type="password" onBlur={this.handleConfirmBlur} />,
                    )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout} style={{ marginTop: 60 }}>
                    <Button type="primary" htmlType="submit" size="large" style={{ width: '100%' }}>确定</Button>
                  </FormItem>
                </Form>
              </div>

            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth }) => ({ auth }))((Form.create())(Retrieve));
