/**
 * Created by yangyanmei on 17/7/12.
 */
import React from 'react';
import { Input, Button, Form, Modal } from 'antd';
import { connect } from 'dva';
import { Layout } from '../../../components';
import { config } from '../../../utils';
import styles from './index.less';

const { Header, Footer } = Layout;
const FormItem = Form.Item;

class ForgotPassword extends React.Component {
  state = {
    validEmail: true,
  };
  componentWillMount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: true });
  };
  componentWillUnmount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: false });
  };
  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.auth.isUpdateForgotPw) {
  //     Modal.success({
  //       title: '成功',
  //       content: '请查看你的邮箱',
  //     });
  //   }
  // };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.token = config.source;
        values.password = '1';
        values.src = config.source;
        this.props.dispatch({ type: 'auth/forgotPassword', payload: values });
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
      <div>
        <div className={styles.container}>
          <div className={styles.content}>
            <section className={styles.codeBox}>
              <div className={styles.forgot_top}>
                <h3>找回账号密码</h3>
              </div>
              <div className={styles.form_mod}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                    {...formItemLayout}
                    label="邮箱"
                    // validateStatus={this.state.validEmail ? '' : 'error'}
                    // help={this.state.validEmail ? '' : '该邮箱不存在'}
                    hasFeedback
                  >
                    {getFieldDecorator('identifier', {})(
                      <Input type="email" />,
                    )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout} style={{marginTop: 60}}>
                    <Button type="primary" htmlType="submit" size="large" style={{width: '100%'}}>确定</Button>
                  </FormItem>
                </Form>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ app, auth }) => ({ app, auth }))(Form.create()(ForgotPassword));
