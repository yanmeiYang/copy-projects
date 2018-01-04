import React, { Component } from 'react';
import { connect } from 'dva';
// import styles from './index.less';
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
        const hrefBox =
          data.mailBody.match(/<a[^>]+.*?href=["']htt+?([^"']+)["']?[^>](.|[\s\S])*?<\/a>/g);
        const imgBox = data.mailBody.match(/<img(.|[\s\S])*?(?:>|\/>)/g);
        const imgArray = [];
        if (hrefBox) {
          for (const items of imgBox) {
            const item = items.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/);
            imgArray.push(item[1]);
          }
        }
        const taskBox = [];
        if (imgBox) {
          for (const href of hrefBox) {
            const content = href.match(/>(.|[\s\S]*)<\/a>/);
            console.log('href 1  wrong', content)
            const url = href.match(/href=\"([^\"]+)/);
            const task = {
              name: content[1],
              url: url[1],
            };
            taskBox.push(task);
          }
        }
        this.props.callbackParent(taskBox, imgArray, data);
        this.setState({ visible: false });
// TODO @xiaobei: 发送数据,更新邮件模板
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
        <a href='javascript:void(0)' onClick={this.editEmail}>默认模板</a>
        <Modal visible={visible}
               title="Edit Template"
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               footer={[
                 <Button key="back" onClick={this.handleCancel}>Return</Button>,
                 <Button key="submit" type="primary" onClick={this.handleOk}>
                   Submit
                 </Button>,
               ]}>
          <Form onSubmit={this.handleOk}>
            <FormItem
              {...formItemLayout}
              label="Tempalte Name :"
            >
              {getFieldDecorator('mailTitle')(
                <Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Tempalte Editor :"
            >
              {getFieldDecorator('mailEditor')(
                <Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Tempalte Content :"
            >
              {getFieldDecorator('mailBody')(
                <TextArea rows={14} />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(EditMailTemplate)
