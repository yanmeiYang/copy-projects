/**
 * Created by yangyanmei on 17/7/12.
 * Updated by bogao on 2018-01-09
 */
import React from 'react';
import { Input, Button, Form, Modal } from 'antd';
import { connect, Page } from 'engine';
import styles from './forgot-password.less';

@Page({ form: true, models: [require('models/auth')] })
@connect(({ app, auth }) => ({ app, auth }))
export default class ForgotPassword extends React.Component {
  state = {
    validEmail: true,
    errorMessageByEmail: '',
  };

  // TODO yanmei 不要再这里做这些事情呀.
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.message === 'user.not_found') {
      this.setState({
        validEmail: false,
        errorMessageByEmail: '用户不存在',
      });
    } else if (nextProps.auth.isUpdateForgotPw !== this.props.auth.isUpdateForgotPw) {
      Modal.success({
        title: '成功',
        content: '请查看你的邮箱',
        onOk() {
          window.location.href = '/';
        },
      })
      ;
    } else if (nextProps.auth.message) {
      if (nextProps.auth.message.includes('seconds_later')) {
        Modal.warning({
          title: '警告',
          content: `请${nextProps.auth.message.split('_')[1]}s后再试`,
        });
      }
    }
  };

  cancelError = () => {
    // TODO yanmei 不能这样设置model里面的值.
    this.props.auth.message = '';
    this.setState({ validEmail: true, errorMessageByEmail: '' });
  };

  handleSubmit = (e) => {
    const that = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        if (err.email) {
          if (err.email.errors.length > 0) {
            that.setState({
              validEmail: false,
              errorMessageByEmail: err.email.errors[0].message,
            });
          } else {
            that.setState({ errorMessageByEmail: '' });
          }
        }
      }
      if (!err) {
        values.password = ' ';
        that.props.dispatch({ type: 'auth/forgotPassword', payload: values });
      }
    });
  };
  // handleConfirmBlur = (e) => {
  //   this.props.dispatch({ type: 'auth/checkEmail', payload: { email: e.target.value } });
  // };
  // cancalFeedback = (e) => {
  //   this.setState({ validEmail: true });
  // };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { validEmail } = this.state;
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
    return (
      <div className={styles.container}>
        <div className={styles.codeBox}>
          <div className={styles.forgot_top}>
            <h3>找回账号密码</h3>
          </div>
          <div className={styles.form_mod}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                {...formItemLayout}
                label="邮箱"
                validateStatus={validEmail ? '' : 'error'}
                help={validEmail ? '' : this.state.errorMessageByEmail}
                hasFeedback
              >
                {getFieldDecorator('identifier', {})(
                  <Input type="email" onChange={this.cancelError} />,
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout} style={{ marginTop: 60 }}>
                <Button type="primary" htmlType="submit" size="large"
                        style={{ width: '100%' }}>确定</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
