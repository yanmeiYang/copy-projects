import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Radio, Checkbox } from 'antd';
import styles from './chooseNationality.less';

const FormItem = Form.Item;
// const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
//从后端数据读取出来
// const plainOptions = ['北京', '安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', '黑龙江',
//   '湖北', '湖南', '吉林', '江苏', '江西', '辽宁', '内蒙古', '宁夏', '青海', '山东', '山西', '陕西',
//   '上海', '四川', '天津', '西藏', '新疆', '云南', '浙江', '重庆', '香港', '澳门', '台湾'];
export default class ChooseNationality extends Component {
  state = {
    // checkedList: plainOptions,
    // indeterminate: false,
    // checkAll: true,
    value: 'all',
  };

  componentWillReceiveProps(nextProps) {
    // TODO @xiaobei: 请求数据，设置orgs
    if (nextProps.national !== this.props.national) {
      this.setState({
        value: nextProps.national[0],
      });
      // if (nextProps.national > 1) {
      //   this.setState({
      //     value: 'china',
      //     // checkedList: nextProps.national,
      //   });
      // } else {
      //   console.log('mmmmmm', nextProps.national[0])
      //   this.setState({
      //     value: nextProps.national[0],
      //   })
      //   ;
      // }
    }
  }

  // 单选事件
  // TODO @xiaobei: 点击时回传到父组件
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
    const data = [e.target.value];
    this.props.callbackParent(data);
  };

  // onCheckAllChange = (e) => {
  //   this.setState({
  //     checkedList: e.target.checked ? plainOptions : [],
  //     indeterminate: false,
  //     checkAll: e.target.checked,
  //   });
  //   const data = [e.target.checked];
  //   this.props.callbackParent(data);
  // };

  // changeCity = (checkedList) => {
  //   this.setState({
  //     checkedList,
  //     indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
  //     checkAll: checkedList.length === plainOptions.length,
  //   });
  //   this.props.callbackParent(checkedList);
  // };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { value } = this.state;
    return (
      <div className={styles.chooseNationality}>
        <FormItem
          {...formItemLayout}
          label="推荐对象所属国家"
        >
          <RadioGroup onChange={this.onChange} value={value}>
            <Radio value="all">全球</Radio>
            <Radio value="china">中国</Radio>
            <Radio value="foreigner">其它国家</Radio>
          </RadioGroup>
        </FormItem>
        {/*{value === 'china' &&*/}
        {/*<div className={styles.checkGroup}>*/}
        {/*<Checkbox*/}
        {/*indeterminate={this.state.indeterminate}*/}
        {/*onChange={this.onCheckAllChange}*/}
        {/*checked={this.state.checkAll}*/}
        {/*>*/}
        {/*所有省市*/}
        {/*</Checkbox>*/}
        {/*<CheckboxGroup options={plainOptions} className={styles.checkBox}*/}
        {/*value={this.state.checkedList} onChange={this.changeCity} />*/}
        {/*</div>}*/}
      </div>
    );
  }
}
