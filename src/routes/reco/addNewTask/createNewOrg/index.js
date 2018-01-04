import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Select, Button, Modal, Input } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

class CreateNewOrg extends Component {
  state = {
    orgs: [],
    visible: false,
  };

  componentDidMount() {
    // TODO @xiaobei: 请求数据，设置orgs
    console.log('666');
  }

  // 新增组织
  addNewOrg = () => {
    this.setState({ visible: true });
  };

  // TODO @xiaobei 每点一次执行一次callack，回传，首次创建点提交要回传
  radioHandleChange = (value) => {
    console.log(`selected ${value}`);
  };

  // model内部事件
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('>>>>>>ppppppppp', values);
      this.state.orgs.push(values.name);
    });
    this.setState({ visible: false });
  };

  render() {
    const { orgs } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div>
        <FormItem
          {...formItemLayout}
          label="Paper Attribute"
        >
          <Select defaultActiveFirstOption style={{ width: 120 }}
                  onChange={this.radioHandleChange}>
            {orgs.map((org) => {
              return (<Option value={org} key={org}>{org}</Option>);
            })}
          </Select>
          <Button className={styles.newOrgBtn} onClick={this.addNewOrg}>
            Create New Organization
          </Button>
        </FormItem>
        <Modal
          title="Create New Organization"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="Organization Name"
            >
              {getFieldDecorator('name')(
                <Input />)}
            </FormItem>
            <FormItem
              label="Organization Description"
            >
              {getFieldDecorator('description')(
                <Input />)},
            </FormItem>
          </Form>
        </Modal>
      </div>

    );
  }
}

export default Form.create()(CreateNewOrg)
