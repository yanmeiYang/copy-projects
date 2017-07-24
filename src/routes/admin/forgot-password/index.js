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
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.isUpdateForgotPw) {
      Modal.success({
        title: '成功',
        content: '请查看你的邮箱',
      });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.props.auth.validEmail) {
      this.setState({ validEmail: false });
    } else {
      this.setState({ validEmail: true });
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !this.props.auth.validEmail) {
        values.token = config.source;
        values.password = ' ';
        values.src = config.source;
        this.props.dispatch({ type: 'auth/forgotPassword', payload: values });
      }
    })
  };
  handleConfirmBlur = (e) => {
    this.props.dispatch({ type: 'auth/checkEmail', payload: e.target.value });
  };
  cancalFeedback = (e) => {
    this.setState({ validEmail: true });
  };
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
    const headerProps = { location };
    const { validEmail } = this.props.auth;
    return (
      <div>
        <Header {...headerProps} />
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
                    {getFieldDecorator('identifier', {
                      rules: [{
                        required: true, message: '请输入您的邮箱!',
                      }],
                    })(
                      <Input type="email" onBlur={this.handleConfirmBlur} onChange={this.cancalFeedback} />,
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
        <Footer />
      </div>
    )
  }

}

export default connect(({ app, auth }) => ({ app, auth }))(Form.create()(ForgotPassword))
