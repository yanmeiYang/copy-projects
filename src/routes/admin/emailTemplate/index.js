/**
 * Created by yangyanmei on 17/8/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Modal } from 'antd';
import { sysconfig } from '../../../systems';

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const BodyTemplate = '你好 {{name}},\\n此电子邮件地址请求重设密码。\n要重设密码，请点击下面的链接。' +
  '如果连接无法点击请复制连接在浏览器中打开。。。\\n' +
  'http://<span style="background-color: yellow">ali.aminer.org</span>' +
  '/<span style="background-color: yellow">reset-password</span>?email={{email}}&src={{src}}&token={{token}}' +
  '\\n这将允许您创建一个新密码，然后您可以登录到您的帐户。\\n该链接将在12小时内到期。\\n如果您已经完成了此操作，' +
  '或者您自己没有请求，请忽略此电子邮件。\\n此致\n阿里巴巴学术资源地图客户团队\n注意：\\n此电子邮件地址无法接受回复' +
  '\\n若要解决问题或了解有关帐户的更多信息，请访问我们的网站。\\n';
class EmailTemplate extends React.Component {
  state = {};
  componentWillMount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: true });
  };
  componentWillUnmount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: false });
  };
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.systemSetting.status !== this.props.systemSetting.status) {
      if (!nextProps.systemSetting.status) {
        Modal.error({
          title: '您没有权限',
        });
      } else {
        Modal.success({
          title: '邮箱模板定制成功',
        });
      }
      this.props.form.resetFields();
    }
  };
  registered = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({ type: 'systemSetting/setEmailTemplate', payload: values });
        // Modal.success({
        //   title: '创建用户',
        //   content: '创建成功',
        //   onOk() {
        //     props.dispatch(routerRedux.push({
        //       pathname: '/admin/users',
        //     }));
        //   },
        // });
        // this.props.form.resetFields();
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
      <div style={{ maxWidth: '1228px' }}>
        <Form onSubmit={this.registered} style={{ marginTop: 30 }}>
          <FormItem
            {...formItemLayout}
            label="系统"
          >
            {
              getFieldDecorator('src', {
                rules: [
                  {
                    required: true, message: '请输入系统!',
                  }],
              })(
                <Select>
                  {
                    sysconfig.AllOptionalSystems.map((sys) => {
                      return <Option key={sys} value={sys}>{sys}</Option>;
                    })
                  }
                </Select>,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="类型"
          >
            {
              getFieldDecorator('type', {
                rules: [
                  {
                    required: true, message: '请输入发件人!',
                  }],
              })(
                <Select>
                  <Option value="reset-password">reset-password</Option>
                  <Option value="welcome">welcome</Option>
                </Select>,
              )
            }
          </FormItem>
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
                <TextArea placeholder="请输入发送内容" autosize={{ minRows: 2, maxRows: 6 }} />,
              )
            }
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="内容例子"
          >
            <span dangerouslySetInnerHTML={{ __html: BodyTemplate }} />
          </FormItem>

          <FormItem {...tailFormItemLayout} style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={this.registered} style={{ width: '50%' }}>
              定制邮件内容
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default connect(({ systemSetting }) => ({ systemSetting }))((Form.create())(EmailTemplate));
