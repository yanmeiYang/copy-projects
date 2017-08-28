import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import { Form, Input, Button, Select, Modal } from 'antd';

const Option = Select.Option;

class Addition extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
};

  componentWillMount() {
    const queryItem = this.props.location.query.id;
    if (queryItem) {
      this.setState({ query: queryItem });
      const src = 'ccf';
      this.dispatch({
        type: 'tobProfile/getItemById',
        payload: { src, key: queryItem },
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (! err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  addition = (e) => {
    e.preventDefault();
    const src = 'ccf';
    const that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        if (err.id) {
          if (err.email.errors.length > 0) {
            that.setState({ errorMessageByEmail: err.email.errors[0].message });
          } else {
            that.setState({ errorMessageByEmail: '' });
          }
        }
      }
      if (!err) {
        console.log('更新者的信息:', values);
        if (this.state.query) {
          that.props.dispatch({
            type: 'tobProfile/updateInfo',
            payload: { src, key: this.state.query, data: values },
          });
          Modal.success({
            title: '添加信息',
            content: '添加成功',
            onOk() {
              that.props.dispatch(routerRedux.push({
                pathname: '/tobprofile',
              }));
            },
          });
        } else {
          that.props.dispatch({
            type: 'tobProfile/addInfo',
            payload: values,
          });
          Modal.success({
            title: '添加信息',
            content: '添加成功',
            onOk() {
              that.props.dispatch(routerRedux.push({
                pathname: '/tobprofile',
              }));
            },
          });
        }
        that.props.form.resetFields();
      }
    });
  };
  cancel = () => {
    this.setState({ extraData: '' });
    this.props.dispatch(routerRedux.push({
      pathname: '/tobprofile',
    }));
  };

  render() {
    const { extraData } = this.props.tobProfile;
    const profile = extraData && extraData.length > 0 && extraData[0];
    const name = (profile && profile.name) || '';
    // const name = (profile && profile.name) || '';
    const nameZh = (profile && profile.name_zh) || '';
    const sid = (profile && profile.sid) || '';
    const gender = (profile && profile.gender) + '' || '';
    const email = (profile && profile.email) || '';
    const aff = (profile && profile.aff) || '';
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
      <Form onSubmit={this.addition}>
        <FormItem {...formItemLayout} label="英文名" hasFeedback>
          {getFieldDecorator('name', { rules: [{ required: true }], initialValue: name })(
            <Input type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="中文名" hasFeedback>
          {getFieldDecorator('name_zh', { rules: [{ required: true }], initialValue: nameZh })(
            <Input type="text" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="工号" hasFeedback>
          {getFieldDecorator('sid', { rules: [{ required: true }], initialValue: sid })(<Input type="text"/>)}
        </FormItem>
        <FormItem {...formItemLayout} label="性别" hasFeedback>
          {getFieldDecorator('gender', { rules: [{ required: true }], initialValue: gender })(
            <Select showSearch style={{ width: 200 }} placeholder="gender">
              <Option value="0">其他</Option>
              <Option value="1">女</Option>
              <Option value="2">男</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="邮箱" hasFeedback>
          {getFieldDecorator('email', {
            rules: [{
              required: true,
              message: '邮箱格式错误!',
            }],
            initialValue: email })(<Input type="email" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="单位" hasFeedback>
          {getFieldDecorator('aff', { rules: [{ required: true }], initialValue: aff })(<Input
            type="text" />)}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.addition} style={{ width: '10%' }}>
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

const AdditionForm = Form.create()(Addition);
export default connect(({ tobProfile }) => ({ tobProfile }))(AdditionForm);
