import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'routes';
import { Link } from 'dva/router';
import { Input, Button, Form } from 'antd';

// TODO @xiaobei: 临时添加,发送邮件页面
const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ app, reco }) => ({ app, reco }))
class Email extends Component {
  state = {
    downloadUrl: '',
  };

  catchEmail = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { id } = this.props.match.params;
      const personGroup = values.person.split('\n');
      this.props.dispatch({
        type: 'reco/catchEmail',
        payload: {
          ids: id,
          person: personGroup,
        },
      }).then((data) => {
        //   // TODO @xiaobei: 这个请求回来以后发送另一个请求
        if (data.succeed) {
          this.props.dispatch({
            type: 'reco/startCrawl',
            payload: {
              ids: [id],
              opts: [
                {
                  'operator': 'update',
                  'fields': [],
                },
              ],
            },
          });
        }
      });
    });
  };
// 导出list
  export = () => {
    const { id } = this.props.match.params;
    const data = [
      {
        'action': 'ReviewerDownloadCSV',
        'parameters': {
          'ids': [id],
        },
      },
    ];
    const dataString = JSON.stringify(data)
    const dataBase = btoa(dataString);
    this.setState({ downloadUrl: `https://apiv2.aminer.org/query?${dataBase}` })
  };
  // 保存人和邮件
  savePersonEmail = (e) => {
    this.props.form.validateFields((err, values) => {
      const { id } = this.props.match.params;
      const personEmailGroup = values.email.split('\n');
      const value = [];
      personEmailGroup.map((person) => {
        const personArray = person.split(/\s+/g);
        const item = {
          expert_id: personArray[0],
          email: personArray[1],
        };
        value.push(item);
      });
      //TODO 根据具体格式调整
      this.props.dispatch({
        type: 'reco/savePersonEmail',
        payload: {
          ids: id,
          value: value,
        },
      });
    });
    e.preventDefault();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Layout searchZone={[]} showNavigator={false}>
        <Link to="/project"><Button>返回列表</Button></Link>
        <Form onSubmit={this.catchEmail}>
          <FormItem {...formItemLayout} label="Person ID">
            {getFieldDecorator('person', {})(<TextArea rows={8} />)}
          </FormItem>

          <FormItem {...formItemLayout}>
            <Button onClick={this.catchEmail}>抓取邮件</Button>
            <a href={this.state.downloadUrl} target="blank">
              <Button onClick={this.export}> 导出 </Button>
            </a>
          </FormItem>

          <FormItem {...formItemLayout} label="Person Email">
            {getFieldDecorator('email', {})(<TextArea rows={8} />)}
          </FormItem>

          <FormItem {...formItemLayout}>
            <Button onClick={this.savePersonEmail}> 保存 </Button>
          </FormItem>
        </Form>
      </Layout>
    );
  }
}

export default Form.create()(Email);
