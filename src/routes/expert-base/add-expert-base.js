import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal } from 'antd';
import { routerRedux } from 'dva/router';

class AddExpertBase extends React.Component {
  state = {};
  addExpertForm = (e) => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
          that.props.dispatch({
            type: 'expertBase/addExpert',
            payload: values,
          });
          Modal.success({
            title: '添加信息',
            content: '添加成功',
            onOk() {
              that.props.dispatch(routerRedux.push({
                pathname: '/expert-base',
              }));
            },
          });
        }
        that.props.form.resetFields();
    });
  };
  render() {
    const FormItem = Form.Item;
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
    return (
      <Form onSubmit={this.addExpertForm}>
        <FormItem {...formItemLayout} label="智库名称" hasFeedback>
          {getFieldDecorator('title', { rules: [{ required: true }] })(
            <Input type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="智库简介" hasFeedback>
          {getFieldDecorator('desc', { rules: [{ required: true }] })(
            <Input type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="库类型" hasFeedback>
          {getFieldDecorator('public', { rules: [{ required: true }] })(
            <Input type="text" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.addExpertForm} style={{ width: '10%' }}>
            添加
          </Button>
          <Button type="cancel" onClick={this.cancel} style={{ width: '10%', marginLeft: '10px' }}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const AddExpertBaseForm = Form.create()(AddExpertBase);
export default connect(({ expertBase }) => ({ expertBase }))(AddExpertBaseForm);

