/**
 * Created by ranyanchuan on 2018/3/6.
 */
import React, { Component } from 'react';
import { connect } from 'engine';
import { Button, Form, Input, AutoComplete, Checkbox, Select, } from 'antd';
import styles from './index.less';

class RegisterModal extends Component {

  state = {};

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
  };

  onHandleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const email = this.props.email || '';
    const {getFieldDecorator} = this.props.form;
    return (
      <div className={styles.register}>
        <Form onSubmit={this.onHandleSubmit}>
          <div className={styles.horizontal}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  {type: 'email', message: 'The input is not valid E-mail !'},
                  {required: true, message: 'Please input your E-mail !'},
                ],
                initialValue: email,
              })(<AutoComplete
                dataSource={this.state.dataSource}
                style={{width: 526}}
                onChange={this.onHandleChange}
                placeholder="Email">
              </AutoComplete>)}
            </Form.Item>
          </div>
          <div className={styles.horizontal}>
            <div className={styles.item}>
              <Form.Item
              >
                {getFieldDecorator('firstName', {
                  rules: [{required: true, message: 'Please input your first name !'}],
                })(
                  <Input placeholder="First name"/>
                )}
              </Form.Item>
            </div>
            <div className={styles.item}>
              <Form.Item
              >
                {getFieldDecorator('lastName', {
                  rules: [{required: true, message: 'Please input your last name !'}],
                })(
                  <Input placeholder="Last name"/>
                )}
              </Form.Item>
            </div>
          </div>
          <div className={styles.horizontal}>
            <div className={styles.item}>
              <Form.Item
              >
                {getFieldDecorator('gender', {
                  rules: [{required: true, message: 'Please select your gender!'}],
                })(
                  <Select
                    placeholder="Gender"
                    onChange={this.handleSelectChange}
                  >
                    <Select.Option value="male">male</Select.Option>
                    <Select.Option value="female">female</Select.Option>
                    <Select.Option value="Prefer not to answer">Prefer not to answer</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className={styles.item}>
              <Form.Item>
                {getFieldDecorator('position', {
                  rules: [{required: true, message: 'Please select your position !'}],
                })(
                  <Select
                    placeholder="Position"
                    onChange={this.handleSelectChange}
                  >
                    <Select.Option value="Professor">Professor</Select.Option>
                    <Select.Option value="Associate Professor">Associate Professor</Select.Option>
                    <Select.Option value="Assistant Professor">Assistant Professor</Select.Option>
                    <Select.Option value="Researcher">Researcher</Select.Option>
                    <Select.Option value="PostDoc">PostDoc</Select.Option>
                    <Select.Option value="Phd Student">Phd Student</Select.Option>
                    <Select.Option value="Master Student">Master Student</Select.Option>
                    <Select.Option value="Other">Other</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </div>
          </div>

          <div className={styles.checkBox}>
            <Form.Item>
              {getFieldDecorator('want', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>I want to receive news and special offers</Checkbox>
              )}
            </Form.Item>
          </div>
          <div className={styles.checkBox}>
            <Form.Item>
              {getFieldDecorator('agree', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>I agree with the
                  <a href="https://www.aminer.cn/"> Terms and Conditions</a>
                </Checkbox>
              )}
            </Form.Item>
          </div>
          <div className={styles.submit}>
            <Form.Item>
              <Button type="primary" htmlType="submit">Register</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    );
  }
}
export default connect(({auth, login}) => ({auth, login}))(Form.create()(RegisterModal));
