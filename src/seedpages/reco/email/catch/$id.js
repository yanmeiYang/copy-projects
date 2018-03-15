import React, { Component } from 'react';
import { connect, Link, FormCreate } from 'engine';
import { Layout } from 'components/layout';
import { config } from 'utils';
import { Input, Button, Form, Modal } from 'antd';

const { TextArea } = Input;

@FormCreate()
@connect(({ app, reco }) => ({ app, reco }))
export default class Email extends Component {
  state = {
    downloadUrl: '',
    rightEmail: [],
  };
  wrongEmail = [];
  checkEmail = () => {
    this.wrongEmail = [];
    let rightArray = [];
    this.props.form.validateFields((err, values) => {
      const personEmailGroup = values.rightEmail.split('\n');
      const Reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      personEmailGroup.forEach((person) => {
        const personArray = person.split(/\s+/g);
        const item = {
          expert_id: personArray[0],
          email: personArray[1],
        };

        if (Reg.test(item.email)) {
          rightArray.push(person);
        } else {
          this.wrongEmail.push(person);
        }
        this.setState({ rightEmail: rightArray });
      });
      this.props.form.setFieldsValue({
        rightEmail: rightArray.join('\n'),
        wrongEmail: this.wrongEmail.join('\n'),
      });
    });
  };

  catchEmail = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { id } = this.props.match.params;
      if (values.person) {
        const personGroup = values.person.split('\n');
        this.props.dispatch({
          type: 'reco/catchEmail',
          payload: {
            ids: id,
            person: personGroup,
          },
        }).then((data) => {
          Modal.success({
            title: '抓取结果',
            content: '开始抓取，请稍后',
          });
          if (data.succeed) {
            this.props.dispatch({
              type: 'reco/startCrawl',
              payload: {
                ids: [id],
                opts: [{ operator: 'update', fields: [] }],
              },
            });
          }
        });
      } else {
        Modal.error({ content: '请填入id' });
      }
    });
  };
// 导出list
  export = () => {
    const { id } = this.props.match.params;
    const data = [
      {
        action: 'reviewer.DownloadCSV',
        parameters: {
          ids: [id], query: '', switches: ['master'],
        },
        schema: {
          person: ['id',
            { profile: ['email'] }, 'name', 'name_zh',
            { profile: ['affiliation', 'affiliation_zh'] }, 'tags',
            { indices: ['hindex'] }],
        },
      }];
    const dataString = JSON.stringify(data);
    const dataBase = btoa(dataString);
    this.setState({ downloadUrl: `${config.nextAPIURL}/magic?${dataBase}` });
  };
  // 保存人和邮件
  savePersonEmail = (e) => {
    this.props.form.validateFields((err, values) => {
      const { id } = this.props.match.params;
      const personEmailGroup = values.rightEmail.split('\n');
      const value = [];
      personEmailGroup.forEach((person) => {
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
        payload: { ids: id, value },
      }).then((data) => {
        if (data.succeed) {
          Modal.success({
            title: '保存结果',
            content: '保存成功',
          });
        } else {
          Modal.error({
            title: '保存结果',
            content: `${data.error}`,
          });
        }
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
        <Link to="/" href="/"><Button>返回列表</Button></Link>
        <Form onSubmit={this.catchEmail}>
          <Form.Item {...formItemLayout} label="Person ID">
            {getFieldDecorator('person', {})(<TextArea rows={8} />)}
          </Form.Item>

          <Form.Item {...formItemLayout}>
            <Button onClick={this.catchEmail}>抓取邮件</Button>
            <a href={this.state.downloadUrl} target="blank">
              <Button onClick={this.export}> 导出 </Button>
            </a>
          </Form.Item>

          <Form.Item {...formItemLayout} label="正确的邮箱">
            {getFieldDecorator('rightEmail', {})(<TextArea rows={8} />)}
          </Form.Item>
          <Form.Item {...formItemLayout}>
            <Button onClick={this.checkEmail}>检测邮箱</Button>
          </Form.Item>
          <Form.Item {...formItemLayout} label="错误的邮箱">
            {getFieldDecorator('wrongEmail', {})(<TextArea rows={8} />)}
          </Form.Item>
          <Form.Item {...formItemLayout}>
            <Button onClick={this.savePersonEmail}> 保存 </Button>
          </Form.Item>
        </Form>
      </Layout>
    );
  }
}
