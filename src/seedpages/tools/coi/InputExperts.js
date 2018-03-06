/**
 * Created by yangyanmei on 18/2/6.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Input, Button, Form } from 'antd';
import styles from './InputExperts.less';

class InputExperts extends Component {

  constructor(props) {
    super(props);
    this.dispatch = props.dispatch;
  }

  componentDidMount() {
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        className={styles.formStyle}
        onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input.TextArea
              placeholder="Autosize height with minimum and maximum number of lines"
              autosize={{ minRows: 10, maxRows: 20 }} />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ app, loading }) => ({ app, loading }))(Form.create()(InputExperts));
