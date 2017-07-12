/**
 *  Created by BoGao on 2017-06-12;
 */
import React from 'react';
import { Tabs, Table, Icon, Spin, Input, Form, Button } from 'antd';
import { connect } from 'dva';

import styles from './index.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { ColumnGroup, Column } = Table;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UniversalConfig extends React.Component {
  state = {
    editCurrentData: {},
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  onDelete = (e) => {
    const key = e.target && e.target.getAttribute('data');
    this.props.dispatch({
      type: 'universalConfig/deleteByKey',
      payload: { category: this.props.universalConfig.category, key },
    });
  };

  onEdit = (e) => {
    const data = e.target && e.target.getAttribute('data');
    const json = JSON.parse(data);
    this.props.form.setFieldsValue(json);
    this.setState({ editCurrentData: json })
  };

  handleSubmit = (e) => {
    const { universalConfig } = this.props;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //删除修改之前的key
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

  render() {
    // Form related.
    const { universalConfig } = this.props;
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const keyError = isFieldTouched('key') && getFieldError('key');
    const valueError = isFieldTouched('value') && getFieldError('value');

    return (
      <div>
        {/*DEBUG INFO: Current Category is : {universalConfig.category}*/}

        <div className={styles.edit_zone}>
          <div className="title">编辑区域：</div>
          <div>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <FormItem
                validateStatus={keyError ? 'error' : ''}
                help={keyError || ''}
              >
                {getFieldDecorator('key', {
                  rules: [{ required: true, message: 'Please input key!' }],
                })(
                  <Input addonBefore="名称" />
                )}
              </FormItem>

              <FormItem
                validateStatus={valueError ? 'error' : ''}
                help={valueError || ''}
              >
                {getFieldDecorator('value', {
                  rules: [{ required: false, message: 'Please input value!' }],
                })(
                  <Input
                    addonBefore={this.props.hideValue ? '' : '值'}
                    type={this.props.hideValue ? 'hidden' : 'text'}
                  />,
                )}

                {/*(类型为:{universalConfig.valueType})*/}
              </FormItem>

              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  添加/修改
                </Button>
              </FormItem>

            </Form>

          </div>
        </div>

        <Spin spinning={universalConfig.loading}>
          <Table
            dataSource={universalConfig.data}
            bordered
            className={styles.unicfg}
            size="small"
            pagination={false}
          >
            <Column title="名称" dataIndex="key" key="key" />
            {!this.props.hideValue &&
            <Column title="值" dataIndex="value" key="value" />
            }
            <Column
              title="操作"
              key="action"
              render={(text, record) => {
                return (
                  <span>
                  <a onClick={this.onEdit} data={JSON.stringify(text)}>编辑</a>
                  <span className="ant-divider" />
                  <a onClick={this.onDelete} data={text.key}>删除</a>
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
)(Form.create()(UniversalConfig));
