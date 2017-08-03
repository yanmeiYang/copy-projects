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
import leftLogo from '../../assets/login/left-logo.png';

const { Header, Footer } = Layout;
const FormItem = Form.Item;

const Login = ({
                 login,
                 dispatch,
                 location,
                 form: {
                   getFieldDecorator,
                   validateFieldsAndScroll,
                 },
               }) => {
  const { loginLoading } = login;

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  }

  function applyUser() {
    Modal.info({
      title: '申请新用户',
      content: '请联系余遐,邮件xiayu@ccf.org.cn',
      onOk() {
      },
    });
  }


  const headerProps = { location };

  const children = (
    <div className={styles.form}>
      {/* <div className={styles.logo}>*/}
      {/* <img alt={'logo'} src={config.logo} />*/}
      {/* <span>{config.name}</span>*/}
      {/* </div>*/}
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: '邮箱不能为空',
              },
            ],
          })(<Input
            size="large"
            onPressEnter={handleOk}
            placeholder="用户名"

            onChange={() => {
              login.errorMessage = '';
            }}
          />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '密码不能为空',
              },
            ],
          })(<Input
            size="large"
            type="password"
            onPressEnter={handleOk}
            placeholder="密码不能为空"

            onChange={() => {
              login.errorMessage = '';
            }}
          />)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}
                  className={styles.loginBtn}>
            登录
          </Button>
          {!login.errorMessage.status && login.errorMessage.status !== undefined &&
          <div style={{
            marginBottom: '20px',
            color: 'red',
          }}>{login.errorMessage.status}用户名或密码错误</div>
          }
          <div>
            <Link to="/forgot-password" className={styles.forgotpwbtn}>忘记密码</Link>
            { sysconfig.ApplyUserBtn &&
            <span className={styles.applyUserbtn} onClick={applyUser}>申请新用户</span>
            }
          </div>
          <p>
            {/* <span>Username：guest</span>*/}
            {/* <span>Password：guest</span>*/}
          </p>
        </Row>

      </form>
    </div>
  );

  const { iconFontJS, iconFontCSS, logo } = config;

  return (
    <div>
      <Helmet>
        <title>{sysconfig.PageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout)}>
        <Header {...headerProps} />
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.content}>
              <img src={leftLogo} />
              <div className="space">{/* {} */}</div>
              {/* <Bread {...breadProps} location={location} /> */}
              {children}
            </div>
          </div>
          <div style={{ border: 'solid 0px red', height: 280 }} />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default connect(({ login }) => ({ login }))(Form.create()(Login));
