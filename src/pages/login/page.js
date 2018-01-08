import React from 'react';
import { connect, Page, router, } from 'engine';
import { Layout } from 'components/layout';
import { FormattedMessage as FM } from 'react-intl';
import { Button, Modal, Row, Form, Input, Icon } from 'antd';
import { sysconfig } from 'systems';
import { applyTheme } from 'themes';
import styles from './page.less';

const debug = require('debug')('aminer:engine');
debug('Debug start Login ------------------------------');

const tc = applyTheme(styles);

@Page({
  form: true,
  models: [
    require('models/auth'),
  ],
})
@connect(({ auth, login }) => ({ auth, login }))
export default class Login extends React.Component {

  setErrorMessage(message) {
    this.props.dispatch({ type: 'auth/setMessage', payload: { message } });
  }

  clearErrorMessage() {
    const { auth, dispatch } = this.props;
    if (auth && auth.errorMessage) {
      dispatch({ type: 'auth/setMessage', payload: { message: "" } });
    }
  }

  handleOk = () => {
    const { dispatch, form } = this.props;
    dispatch({ type: 'auth/showLoading' });
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        dispatch({ type: 'app/login', payload: values });
      }
    });
  };

  applyUser = () => {
    // TODO kill ccf.
    Modal.info({
      title: '新用户申请',
      content: (
        <div>
          <div>请联系系统管理员</div>
          <div className={styles.emailLogin}>xiayu@ccf.org.cn</div>
        </div>
      ),
      onOk() {
      },
    });
  };

  jumpToForgot = () => {
    router.push('/forgot-password');
  };

  render() {
    const { dispatch, auth, form } = this.props;
    const { errorMessage, loading } = auth;
    const { getFieldDecorator, validateFieldsAndScroll } = form;

    return (
      <Layout
        searchZone={[]} contentClass={tc(['loginPage'])}
        showHeader={false} showNavigator={false} showSidebar={false}
      >
        <Form layout={'vertical'}>
          <Row className={styles.formHeader}>
            <h1>
              <FM id="login.header" defaultMessage="Login" />
              {process.env.NODE_ENV !== 'production' &&
              <span className={styles.loginSource}>
                {sysconfig.PageTitle}
              </span>
              }
            </h1>

          </Row>
          <Row className={styles.formContent}>
            <Form.Item hasFeedback>
              {getFieldDecorator('email',
                { rules: [{ required: true, message: '邮箱不能为空' }] },
              )(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                       onPressEnter={this.handleOk}
                       placeholder="用户名" size="large"
                       onChange={this.clearErrorMessage.bind(this)}
                />)}
            </Form.Item>
            <Form.Item hasFeedback>
              {getFieldDecorator('password',
                { rules: [{ required: true, message: '密码不能为空' }] },
              )(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                       type="password" placeholder="密码不能为空"
                       size="large" onPressEnter={this.handleOk}
                       onChange={this.clearErrorMessage.bind(this)}
                />)}
            </Form.Item>
            <Form.Item>
              {errorMessage && errorMessage.status === false &&
              <div className={styles.errors}>
                {errorMessage.status}用户名或密码错误
              </div>}
              <Button type="primary" size="large" onClick={this.handleOk}
                      loading={loading} className={styles.loginBtn}>
                <FM id="login.loginBtn" defaultMessage="Login" />
              </Button>
            </Form.Item>
            <Form.Item>
              <div className={styles.forgetpw}>
                <a href="/forgot-password" className={styles.forgotpwbtn}>
                  <FM id="login.forgetPw" defaultMessage="Forget Password?" />
                </a>
                {sysconfig.ApplyUserBtn &&
                <span className={styles.applyUserbtn} onClick={this.applyUser}>
                  <FM id="login.newUserApplication" defaultMessage="New user application" />
                </span>
                }
              </div>
            </Form.Item>
          </Row>
        </Form>
      </Layout>
    );
  }
}

// export default Page(
//   connect(({ auth, login }) => ({ auth, login }))(Form.create()(Login))
// )
