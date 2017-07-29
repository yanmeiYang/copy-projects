/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { Tabs, Table, Spin, Input, Form, Button, Modal, Select } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import styles from './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { ColumnGroup, Column } = Table;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class AddUserRolesByOrg extends React.Component {
  state = {
    editCurrentData: {},
    visible: false,
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  onDelete = (e) => {
    const key = JSON.parse(e.target && e.target.getAttribute('data')).key;
    const props = this.props;
    Modal.confirm({
      title: '删除',
      content: '确定删除吗？',
      onOk() {
        props.dispatch({
          type: 'universalConfig/deleteByKey',
          payload: { category: props.universalConfig.category, key },
        });
      },
      onCancel() {},
    });
  };

  onEdit = (e) => {
    const data = e.target && e.target.getAttribute('data');
    const json = JSON.parse(data);
    this.props.form.setFieldsValue(json.value);
    this.setState({ editCurrentData: json.value });
  };

  handleSubmit = (e) => {
    const { universalConfig } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 删除修改之前的key
        if (this.state.editCurrentData.key!==undefined&&(this.state.editCurrentData.key!==values.key||this.state.editCurrentData.value!==values.value)){
          const key = this.state.editCurrentData.key;
          this.props.dispatch({
            type: 'universalConfig/deleteByKey',
            payload: { category: this.props.universalConfig.category, key },
          });
        }
        this.props.dispatch({
          type: 'universalConfig/addKeyAndValue',
          payload: {
            category: universalConfig.category,
            key: values.key,
            val: values.value,
          },
        });
        // TODO too earlier. Call this after dispatch action succeeded.
        this.props.form.setFieldsValue({ key: '', value: '' });
        console.log('Received values of form: ', values);
      }
    });
  };
  addRole = () => {
    this.setState({ visible: true });
    this.props.dispatch({
      type: 'universalConfig/getOrgCategory',
      payload: { category: 'orgcategory' },
    });
  }
  handleOk = (e) => {
    this.setState({ visible: false });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.key === '超级管理员') {
          console.log('提示错误');
        } else {
          let value = {};
          if (values.value !== undefined) {
            const orgName = values.value.split('#')[0];
            const orgID = values.value.split('#')[1];
            value = { id: `orglist_${orgID}`, name: orgName };
            this.props.dispatch({
              type: 'auth/addOrgCategory',
              payload: {
                category: 'getallorglist',
                key: orgName,
                val: { id: `orglist_${orgID}`, name: orgName },
              },
            });
          }
          this.props.dispatch({
            type: 'universalConfig/addKeyAndValue',
            payload: {
              category: 'user_roles',
              key: values.key,
              val: value,
            },
          });
        }
      }
    });
  };
  handleCancel = () => this.setState({ visible: false });

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }
  render() {
    // Form related.
    const { universalConfig } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const keyError = isFieldTouched('key') && getFieldError('key');
    const valueError = isFieldTouched('value') && getFieldError('value');
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    return (
      <div>
        {/*DEBUG INFO: Current Category is : {universalConfig.category}*/}
        <Button type="primary" onClick={this.addRole}> 添加角色</Button>
        <Modal
          title="添加角色"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={{ width: '100%' }}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                validateStatus={keyError ? 'error' : ''}
                help={keyError || ''}
                label="角色名称"
              >
                {getFieldDecorator('key', {
                  rules: [{ required: true, message: 'Please input key!' }],
                })(
                  <Input />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                validateStatus={valueError ? 'error' : ''}
                help={valueError || ''}
                label="选择机构"
              >
                {getFieldDecorator('value', {
                  rules: [{ required: false, message: 'Please input value!' }],
                })(
                  <Select onChange={this.handleChange}>
                    {universalConfig.orgList.map((item) => {
                      return <Option value={`${item.value.key}#${item.value.id}`} key={item.value.id}>{item.value.key}</Option>
                    })}
                  </Select>,
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>


        <Spin spinning={universalConfig.loading}>
          <Table
            dataSource={universalConfig.data}
            bordered
            className={styles.unicfg}
            size="small"
            pagination={false}
          >
            <Column title="名称" dataIndex="value.key" key="key" />
            {!this.props.hideValue &&
            <Column title="对应机构" dataIndex="value.value" key="value" render={(dataIndex, text) => {
              if (typeof dataIndex !== 'object') {
                return dataIndex;
              } else if (typeof dataIndex === 'object') {
                return <Link to={`/admin/system-config/${text.value.value.id}`} data={JSON.stringify(text)} > {text.value.value.name} </Link>;
              }
            }} />
            }
            <Column
              title="操作"
              key="action"
              render={(text, record) => {
                return (
                  <span>
                    {(text.value.key !== '超级管理员' && text.value.key !== '分部专员' && text.value.key !== 'CCF专委专员') && <span>
                      <a onClick={this.onEdit} data={JSON.stringify(text)}>编辑</a>
                      <span className="ant-divider" />
                      <a onClick={this.onDelete} data={JSON.stringify(text.value)}>删除</a></span>
                    }
                    {/*<span className="ant-divider" />*/}
                    {/*<a href="#" className="ant-dropdown-link">*/}
                    {/*More actions <Icon type="down" />*/}
                    {/*</a>*/}
                </span>
                )
              }}
            />
          </Table>
        </Spin>
      </div>
    );
  };
}

export default connect(
  ({ universalConfig }) => ({ universalConfig }),
)(Form.create()(AddUserRolesByOrg));
