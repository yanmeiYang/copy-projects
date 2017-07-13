/**
 * Created by yangyanmei on 17/7/12.
 */
import React from 'react';
import { Input, Button, Form } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

class ForgotPassword extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.token = 'aminer';
      values.password = ' ';
      this.props.dispatch({ type: 'auth/forgotPassword', payload: values })
    })
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

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="E-mail"
          hasFeedback
        >
          {getFieldDecorator('identifier', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem xs={{ span: 24, offset: 0 }} sm={{ span: 14, offset: 6 }}>
          <Button type="primary" htmlType="submit" size="large">Register</Button>
        </FormItem>
      </Form>
    )
  }

}

export default connect(({ app }) => ({app}))(Form.create()(ForgotPassword))
