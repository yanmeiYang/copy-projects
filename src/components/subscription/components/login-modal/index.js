/**
 * Created by ranyanchuan on 2018/2/5.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Button, Row, Form, Input, Icon } from 'antd';
import styles from './index.less';

class LoginModal extends Component {

  setErrorMessage(message) {
    this.props.dispatch({type: 'auth/setMessage', payload: {message}});
  };

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({type: 'app/login', payload: values});
      }
    });
  };

  render() {
    const {form, email} = this.props;
    const {getFieldDecorator} = form;
    const loadLogin = this.props.loading.effects['app/login'];
    return (
      <div className={styles.login}>
        <Form layout={'vertical'} onSubmit={this.onHandleSubmit}>
          <Row className={styles.formContent}>
            <Form.Item hasFeedback>
              {getFieldDecorator('email',
                {
                  rules: [{required: true, message: '邮箱不能为空'}],
                  initialValue: email,
                },
              )(
                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>}
                       onPressEnter={this.handleOk}
                       placeholder="用户名" size="large"
                       onChange={() => this.setErrorMessage('')}
                />)}
            </Form.Item>
            <Form.Item hasFeedback>
              {getFieldDecorator('password',
                {rules: [{required: true, message: '密码不能为空'}]},
              )(
                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>}
                       type="password" placeholder="密码不能为空"
                       size="large" onPressEnter={this.handleOk}
                       onChange={() => this.setErrorMessage('')}
                />)}
            </Form.Item>
            <Form.Item hasFeedback>
              <div className={styles.forgotAndRegister}>
                {/*<div>*/}
                {/*<a className={styles.register} href="#">Register now</a>*/}
                {/*</div>*/}
                <div>
                  <a className={styles.forgot} href="/forgot-password">Forgot password</a>
                </div>
              </div>
            </Form.Item>
            <Form.Item hasFeedback>
              { loadLogin &&
              <Button type="primary" loading
                      className={styles.loginFormButton}>正在登录</Button>
              }
              { !loadLogin &&
              <Button type="primary" htmlType="submit"
                      className={styles.loginFormButton}>Sign in</Button>
              }
            </Form.Item>
          </Row>
        </Form>
      </div>
    );
  }
}
export default connect(({app, auth, login, loading}) => ({app, auth, login, loading}))(Form.create()(LoginModal));
