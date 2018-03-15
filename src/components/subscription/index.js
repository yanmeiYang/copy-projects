/**
 * Created by ranyanchuan on 2018/2/5.
 */
import React,{ Component } from 'react';
import { Input, Button, AutoComplete, Modal, Form, message } from 'antd';
import { connect } from 'engine';
import LoginModal from './components/login-modal/index';
import RegisterModal from './components/register-modal/index';
import styles from './index.less';

class Subscription extends Component {

  state = {
    email: this.props.app.user ? this.props.app.user.email : '',
    dataSource: [],
    registerVisible: true,
    loginVisible: false,
  };

  componentDidMount() {
    const { email } = this.state;
    if (email !== '') {
      // 根据邮箱 查看是否关注
      // this.props.dispatch({ type: 'subscription/getFollowInfo', payload: { email } });
    }
  };

  componentWillUpdate(nextProps, nextState) {
    const { follow } = this.props.subscription;
    const nFollow = nextProps.subscription.follow;
    if (nFollow && follow !== nFollow) {
      let messageInfo = '订阅失败';
      if (nFollow.status) {
        messageInfo = '订阅成功';
      }
      message.success(messageInfo);
    }
  };

  onSubscriptionCancel = () => {
    const that = this;
    const { email } = this.state;
    const { app } = this.props;
    const loginEmail = app && app.user ? app.user.email : '';
    Modal.confirm({
      title: '您确定取消订阅吗？',
      content: '取消订阅后，将无法再收到最新推荐的文章',
      onOk() {
        if (email !== loginEmail) {
          message.success('请您先登录，再取消');
          that.setState({ loginVisible: true });
        } else {
          that.props.dispatch({ type: 'subscription/delFollowInfo', payload: { email } });
        }
      },
    });
  };

  onRegisterCancel = () => {
    this.setState({ registerVisible: false });
  };

  onLoginCancel = () => {
    this.setState({ loginVisible: false });
  };

  onSubscriptionSubmit = () => {
    // const { subParam, subscription } = this.props;
    this.props.form.validateFields((err, values) => {
      console.log("======",values)
      if (!err) {
        this.props.dispatch({ type: 'subscription/addFollowInfo', payload: { values } });
      }
    });
  };

  onHandleChange = (value, event) => {
    this.setState({
      email: value,
      dataSource: !value || value.indexOf('@') >= 0 ? [] : [
        `${value}@gmail.com`,
        `${value}@163.com`,
        `${value}@126.com`,
        `${value}@qq.com`,
        `${value}@yahoo.com`,
        `${value}@msn.com`,
        `${value}@hotmail.com`,
        `${value}@live.com`,
        `${value}@googlemail.com`,
      ],
    });
    // 判断email是否被注册
    // this.props.dispatch({ type: 'subscription/getRegisterInfo', payload: { email: value } });
  }

  render() {
    const { subscription } = this.props;
    const { follow } = subscription;
    const { email, registerVisible, loginVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.subscription}>
        <div className={styles.content}>
          {!follow &&
          <Form className={styles.tCenter}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  { type: 'email', message: 'The input is not valid E-mail!' },
                  { required: true, message: 'Please input your E-mail!' },
                ],
                initialValue: email,
              })(<AutoComplete
                dataSource={this.state.dataSource}
                style={{ width: 400, borderBottomRightRadius: 0 }}
                size="large"
                onChange={this.onHandleChange}
                placeholder="Email">
                <Input
                  suffix={(
                    <Button className={styles.book} htmlType="submit" onClick={this.onSubscriptionSubmit}
                            size="large" type="primary">订阅</Button>
                  )}
                />
              </AutoComplete>)}
            </Form.Item>
          </Form>
          }
          {follow &&
          <div>
            <div className={styles.tCenter}><span className={styles.bookSpan}>已订阅</span></div>
            <div className={styles.cancelBook}><a href="#" onClick={this.onSubscriptionCancel}>取消订阅</a></div>
          </div>
          }
        </div>
        {follow && !follow.isRegister &&
        <Modal
          title="Register"
          visible={registerVisible}
          onCancel={this.onRegisterCancel}
          footer={null}
          width="620px"
        >
          <RegisterModal email={email} />
        </Modal>
        }
        <Modal
          title="Sign in"
          visible={loginVisible}
          onCancel={this.onLoginCancel}
          footer={null}
          width="416px"
        >
          <LoginModal email={email} />
        </Modal>
      </div>
    );
  }
}
export default connect(({ auth, app, loading, subscription }) => (
  { auth, app, loading, subscription }))(Form.create()(Subscription));
