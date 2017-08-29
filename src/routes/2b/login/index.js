/* eslint-disable no-const-assign */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Modal, Row, Form, Input } from 'antd';
import styles from './index.less';
import { sysconfig } from '../../../systems';
import { classnames } from '../../../utils';
import leftLogo from '../../../assets/login/left-logo.png';

const FormItem = Form.Item;

class Login2b extends React.Component {
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
        values.src = 'aminer';
        this.props.dispatch({ type: 'app/login', payload: values });
      }
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
        <div className={classnames(styles.layout)}>
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
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ auth, login }) => ({ auth, login }))(Form.create()(Login2b));
