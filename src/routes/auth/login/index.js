/* eslint-disable no-const-assign */
import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { Button, Modal, Row, Form, Input, Icon } from 'antd';
import { sysconfig, applyTheme } from 'systems';
import { classnames, config } from 'utils';
import styles from './index.less';

const tc = applyTheme(styles);
const FormItem = Form.Item;

class Login extends React.Component {
  componentWillMount() {
    // hide search bar in header.
    if (sysconfig.SearchBarInHeader) {
      this.props.dispatch({ type: 'app/hideHeaderSearch' });
    }
  }

  setErrorMessage(message) {
    this.props.dispatch({ type: 'auth/setMessage', payload: { message } });
  }

  handleOk = () => {
    this.props.dispatch({ type: 'auth/showLoading' });
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.props.dispatch({ type: 'app/login', payload: values });
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
    this.props.dispatch(routerRedux.push({
      pathname: '/forgot-password',
    }));
  };

  render() {
    const { dispatch, auth, form } = this.props;
    const { errorMessage, loading } = auth;
    const { getFieldDecorator, validateFieldsAndScroll } = form;

    const headerProps = {
      location,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };

    return (
      <Layout searchZone={[]} showHeader={false} contentClass={tc(['loginPage'])}>
        <Form layout={'vertical'}>
          <Row className={styles.formHeader}>
            <h1>登录</h1>
          </Row>
          <Row className={styles.formContent}>
            <FormItem hasFeedback>
              {getFieldDecorator('email',
                { rules: [{ required: true, message: '邮箱不能为空' }] },
              )(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                       onPressEnter={this.handleOk}
                       placeholder="用户名" size="large"
                       onChange={() => this.setErrorMessage('')}
                />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password',
                { rules: [{ required: true, message: '密码不能为空' }] },
              )(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                       type="password" placeholder="密码不能为空"
                       size="large" onPressEnter={this.handleOk}
                       onChange={() => this.setErrorMessage('')}
                />)}
            </FormItem>
            <FormItem>
              {errorMessage && errorMessage.status === false &&
              <div className={styles.errors}>
                {errorMessage.status}用户名或密码错误
              </div>}
              <Button type="primary" size="large" onClick={this.handleOk}
                      loading={loading} className={styles.loginBtn}> 登录
              </Button>
            </FormItem>
            <FormItem>
              <div className={styles.forgetpw}>
                <a href="/forgot-password" className={styles.forgotpwbtn}>忘记密码?</a>
                {sysconfig.ApplyUserBtn &&
                <span className={styles.applyUserbtn} onClick={this.applyUser}>新用户申请</span>
                }
              </div>
            </FormItem>
          </Row>
        </Form>
      </Layout>
    );
  }
}

export default connect(({ auth, login }) => ({ auth, login }))(Form.create()(Login));
