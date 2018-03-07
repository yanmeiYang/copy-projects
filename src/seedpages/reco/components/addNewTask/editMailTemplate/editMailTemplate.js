import React, { Component } from 'react';
import { Form, Input, Modal, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class EditMailTemplate extends Component {
  state = { visible: false };

// 更新,编辑
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.emailInfo.length === undefined && (this.state.visible !== nextState.visible)) {
      const { emailInfo } = nextProps;
      this.props.form.setFieldsValue({
        mailTitle: emailInfo.mailTitle,
        mailEditor: emailInfo.mailEditor,
        mailBody: emailInfo.mailBody,
      });
    }
  }

// 编辑邮件模板事件
  editEmail = () => {
    this.setState({
      visible: true,
    });
    this.props.form.resetFields();
  };
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const data = {
          mailTitle: values.mailTitle,
          mailBody: values.mailBody,
          mailEditor: values.mailEditor,
        };
        this.props.callbackParent(data);
        this.setState({ visible: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <a onClick={this.editEmail}>默认模板</a>
        <Modal visible={visible}
               title="编辑模板"
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               footer={[
                 <Button key="back" onClick={this.handleCancel}>返回</Button>,
                 <Button key="submit" type="primary" onClick={this.handleOk}>
                   提交
                 </Button>,
               ]}>
          <Form onSubmit={this.handleOk}>
            <FormItem
              {...formItemLayout}
              label="邮件名称:"
            >
              {getFieldDecorator('mailTitle', {
                rules: [{ required: true, message: '请输入邮件名称' }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="发件人邮箱:"
            >
              {getFieldDecorator('mailEditor', {
                rules: [{
                  type: 'email', message: '你输入的不是一个合法的邮件地址',
                }, {
                  required: true, message: '请输入你的邮件',
                }],
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="模板内容"
            >
              {getFieldDecorator('mailBody', {
                rules: [{ required: true, message: '请输入你的邮件模板' }],
              })(<TextArea rows={14} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EditMailTemplate);
