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

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleSubmit = (e) => {
    const { universalConfig } = this.props;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
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
                  <Input addonBefore="值" />
                )}

                (类型为:{universalConfig.valueType})
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
          >
            <Column title="名称" dataIndex="key" key="key" />
            <Column title="值" dataIndex="value" key="value" />
            <Column
              title="Action"
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
