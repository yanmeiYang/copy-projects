import React, { Component } from 'react';
import { Form, Select, Button, Modal, Input } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

class CreateNewOrg extends Component {
  state = {
    orgs: [],
    visible: false,
    selectedOrg: '',
  };

  componentWillReceiveProps(nextProps) {
    // TODO @xiaobei: 请求数据，设置orgs
    if (nextProps.selectedOrg !== this.props.selectedOrg) {
      this.setState({
        selectedOrg: nextProps.selectedOrg,
        // orgs: this.props.orgList,
      });
    }
  }

  // 新增组织
  addNewOrg = () => {
    this.setState({ visible: true });
  };

  // TODO @xiaobei 每点一次执行一次callack，回传，首次创建点提交要回传
  radioHandleChange = (value) => {
    const { orgs, selectedOrg } = this.state;
    this.setState({ selectedOrg: value });
    this.props.callbackParent(orgs, selectedOrg);
  };

  // model内部事件
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.state.orgs.push(values.name);
      this.setState({ selectedOrg: values.name });
      this.props.form.setFieldsValue({
        description: '',
        name: '',
      });
      this.props.callbackParent(this.state.orgs, values.name);
    });
    this.setState({ visible: false });
  };

  render() {
    const { orgs, selectedOrg } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.createNewOrg}>
        <FormItem
          {...formItemLayout}
          label="所属期刊"
        >
          <Select value={selectedOrg} style={{ width: 120 }}
                  onChange={this.radioHandleChange}>
            {orgs.map((org) => {
              return (<Option value={org} key={org}>{org}</Option>);
            })}
          </Select>
          <Button className={styles.newOrgBtn} onClick={this.addNewOrg}>
            创建期刊
          </Button>
        </FormItem>
        <Modal
          title="创建期刊"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="期刊名称"
            >
              {getFieldDecorator('name')(<Input />)}
            </FormItem>
            <FormItem
              label="期刊描述"
            >
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </div>

    );
  }
}

export default Form.create()(CreateNewOrg);
