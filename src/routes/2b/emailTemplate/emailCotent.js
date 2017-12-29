/**
 * Created by yangyanmei on 17/8/21.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Button } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
class EmailTemplate extends React.Component {
  state = {};

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.systemSetting.status !== this.props.systemSetting.status) {
      if (!nextProps.systemSetting.status) {
        Modal.error({
          title: '您没有权限',
        });
      } else if (nextProps.systemSetting.status !== null) {
        Modal.success({
          title: '邮箱模板定制成功',
          onOk() {
            window.location.href = '/2b';
          },
        });
      }
    }
    if (nextProps.setFormValue !== this.props.setFormValue) {
      const content = nextProps.setFormValue;
      const setFormFieldsVale = this.props.form;
      setFormFieldsVale.setFieldsValue({
        sender: content.sender,
        subject: content.subject,
        body: content.body,
        type: content.category,
      });
    }
  };
  registered = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.src = this.props.source;
        values.type = this.props.type;
        this.props.dispatch({ type: 'systemSetting/setEmailTemplate', payload: values });
      }
    });
  };

  render() {
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
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.registered} style={{ marginTop: 30 }}>
        <FormItem
          {...formItemLayout}
          label="发件人"
        >
          {
            getFieldDecorator('sender', {
              rules: [
                {
                  required: true, message: '请输入发件人!',
                }],
            })(
              <Input />,
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="主题"
        >
          {
            getFieldDecorator('subject', {
              rules: [{
                required: true, message: '请输入主题!',
              }],
            })(
              <Input type="text" />,
            )
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="内容"
          hasFeedback
        >
          {
            getFieldDecorator('body', {
              rules: [{
                required: true, message: '请输入内容',
              }],
            })(
              <TextArea placeholder="请输入发送内容" autosize={{ minRows: 2, maxRows: 30 }} />,
            )
          }
        </FormItem>

        <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.registered} style={{ width: '50%' }}>
            定制邮件内容
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default connect(({ systemSetting }) => ({ systemSetting }))((Form.create())(EmailTemplate));
