import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Radio, Checkbox } from 'antd';
import styles from './chooseNationality.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
//从后端数据读取出来
const plainOptions = ['beijing', 'tianjin'];

export default class ChooseNationality extends Component {
  state = {
    checkedList: plainOptions,
    indeterminate: false,
    checkAll: true,
    value: 'all',
  };
  // 单选事件
  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  onCheckAllChange = (e) => {
    console.log('>>>>>>>>>', e.target.checked)
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  changeCity = (checkedList) => {
    console.log('////////', checkedList);
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  render() {
    const { value } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles.chooseNationality}>
        <FormItem
          {...formItemLayout}
          label="Nationality"
        >
          <RadioGroup onChange={this.onChange} defaultValue="all">
            <Radio value="all">All</Radio>
            <Radio value="china">China</Radio>
            <Radio value="foreigner">foreigner</Radio>
          </RadioGroup>
        </FormItem>
        {value === 'china' &&
        <div className={styles.checkGroup}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            All
          </Checkbox>
          <CheckboxGroup options={plainOptions} className={styles.checkBox}
                         value={this.state.checkedList} onChange={this.changeCity} />
        </div>}
      </div>
    );
  }
}
