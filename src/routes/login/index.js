/* eslint-disable no-const-assign */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Modal, Row, Form, Input } from 'antd';
import { Helmet } from 'react-helmet';
import styles from './index.less';
import { Layout } from '../../components';
import { sysconfig } from '../../systems';
import { classnames, config } from '../../utils';
import PageBg from './pageBackground';

const { Header, Footer } = Layout;
const FormItem = Form.Item;
const { iconFontJS, iconFontCSS } = config;

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

  render() {
    const { dispatch, auth, form } = this.props;
    const { errorMessage, loading } = auth;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const children = (
      <div className={styles.loginPage}>
        <div className={styles.form}>
          <Form layout={'vertical'}>
            <Row className={styles.formHeader}>
              <div>
                <h1>登录</h1>
                <p>使用您的 {sysconfig.PageTitle} 账号</p>
              </div>
            </Row>
            <FormItem label="电子邮件地址" hasFeedback>
              {getFieldDecorator('email',
                { rules: [{ required: true, message: '邮箱不能为空' }] },
              )(
                <Input onPressEnter={this.handleOk}
                       placeholder="用户名" size="large"
                       onChange={() => this.setErrorMessage('')}
                />)}
            </FormItem>
            <FormItem label="密码" hasFeedback>
              {getFieldDecorator('password',
                { rules: [{ required: true, message: '密码不能为空' }] },
              )(
                <Input type="password" placeholder="密码不能为空"
                       size="large" onPressEnter={this.handleOk}
                       onChange={() => this.setErrorMessage('')}
                />)}
            </FormItem>
            <Row>
              {errorMessage && errorMessage.status === false &&
              <div className={styles.errors}>
                {errorMessage.status}用户名或密码错误({errorMessage.message})
              </div>}

              <div>
                <Link to="/forgot-password" className={styles.forgotpwbtn}>忘记密码?</Link>
                {sysconfig.ApplyUserBtn &&
                <span className={styles.applyUserbtn} onClick={this.applyUser}>新用户申请</span>
                }
              </div>
              <Button type="primary" size="large" onClick={this.handleOk}
                      loading={loading} className={styles.loginBtn}> 登录
              </Button>
            </Row>
          </Form>
        </div>
        <PageBg />
      </div>
    );

    const headerProps = {
      location,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };

    return (
      <div style={{ height: '100vh' }}>
        <Helmet>
          <title>{sysconfig.PageTitle}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={`/sys/${sysconfig.SYSTEM}/favicon.ico`} type="image/x-icon" />
          {iconFontJS && <script src={iconFontJS} />}
          {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
        </Helmet>
        <div className={classnames(styles.layout)}>
          <Header {...headerProps} />
          <div className={styles.main}>
            <div className={styles.container}>
              <div className={styles.content}>
                {children}
              </div>
            </div>
          </div>
          {/*<Footer />*/}
        </div>
      </div>
    );
  }
}

export default connect(({ auth, login }) => ({ auth, login }))(Form.create()(Login));
