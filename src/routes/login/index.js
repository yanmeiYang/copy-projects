import React from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input } from 'antd';
import { Helmet } from 'react-helmet';

import styles from './index.less';
import { Layout } from '../../components';
import { classnames, config, menu } from '../../utils';
const { Header, Footer, Sider } = Layout;

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

  const headerProps = { location };

  const children = (
    <div className={styles.form} style={{ top: 528 }}>
      {/*<div className={styles.logo}>*/}
      {/*<img alt={'logo'} src={config.logo} />*/}
      {/*<span>{config.name}</span>*/}
      {/*</div>*/}
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="Username" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="Password" />)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginLoading}>
            Sign in
          </Button>
          <p>
            <span>Username：guest</span>
            <span>Password：guest</span>
          </p>
        </Row>

      </form>
    </div>
  );

  const { iconFontJS, iconFontCSS, logo } = config;

  return (
    <div>
      <Helmet>
        <title>CCF 专家云智库</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS}></script>}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout)}>
        <Header {...headerProps} />
        <div className={styles.main}>
          <div className={styles.container}>
            <div className={styles.content}>
              <img src="/big_banner2.png" style={{ height: 250, width: '100%' }} />
              {/*<Bread {...breadProps} location={location} />*/}
              {children}
            </div>
          </div>
          <div style={{ border: 'solid 0px red', height: 700 }} />
          <Footer />
        </div>
      </div>
    </div>
  );

};

export default connect(({ login }) => ({ login }))(Form.create()(Login));
