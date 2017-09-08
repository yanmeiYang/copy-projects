import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Modal } from 'antd';
import { routerRedux } from 'dva/router';

class AddExpertDetail extends React.Component {
  state = {};
  addExpertDetail = (e) => {
    e.preventDefault();
    const that = this;
    const id = this.props.routeParams;
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { name, name_zh } = values;
      if (!err) {
        console.log('555%%%%',id);
        that.props.dispatch({
          type: 'expertBase/addExpertDetail',
          payload: { id, name, name_zh },
        });
        Modal.success({
          title: '添加信息',
          content: '添加成功',
          onOk() {
            that.props.dispatch(routerRedux.push({
              pathname: '/expert-base-list',
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
      <Form onSubmit={this.addExpertDetail}>
        <FormItem {...formItemLayout} label="英文名" hasFeedback>
          {getFieldDecorator('name', { rules: [{ required: true }] })(
            <Input type="text"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="中文名" hasFeedback>
          {getFieldDecorator('name_zh', { rules: [{ required: true }] })(
            <Input type="text"/>)}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.addExpertDetail} style={{ width: '10%' }}>
            添加
          </Button>
          <Button type="cancel" style={{ width: '10%', marginLeft: '10px' }}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const AddExpertDetailForm = Form.create()(AddExpertDetail);
export default connect(({ expertBase }) => ({ expertBase }))(AddExpertDetailForm);

