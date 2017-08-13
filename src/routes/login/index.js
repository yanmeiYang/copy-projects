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
const { iconFontJS, iconFontCSS, logo } = config;

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
      <div className={styles.form}>
        <form>
          <FormItem hasFeedback>
            {getFieldDecorator('email',
              { rules: [{ required: true, message: '邮箱不能为空' }] },
            )(
              <Input onPressEnter={this.handleOk}
                     placeholder="用户名" size="large"
                     onChange={() => this.setErrorMessage('')}
              />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password',
              { rules: [{ required: true, message: '密码不能为空' }] },
            )(
              <Input type="password" placeholder="密码不能为空"
                     size="large" onPressEnter={this.handleOk}
                     onChange={() => this.setErrorMessage('')}
              />)}
          </FormItem>
          <Row>
            <Button type="primary" size="large" onClick={this.handleOk}
                    loading={loading} className={styles.loginBtn}> 登录
            </Button>

            {errorMessage && errorMessage.status === false &&
            <div style={{ marginBottom: '20px', color: 'red' }}>
              {errorMessage.status}用户名或密码错误({errorMessage.message})
            </div>}

            <div>
              <Link to="/forgot-password" className={styles.forgotpwbtn}>忘记密码</Link>
              {sysconfig.ApplyUserBtn &&
              <span className={styles.applyUserbtn} onClick={this.applyUser}>新用户申请</span>
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

    const headerProps = {
      location,
      logout() {
        dispatch({ type: 'app/logout' });
      },
    };

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
  }
}

export default connect(({ auth, login }) => ({ auth, login }))(Form.create()(Login));
