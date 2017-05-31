/**
 * Created by yangyanmei on 17/5/27.
 */
import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  //活动时间开始
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endvalue) {
      return false;
    }
    return sstartValue.valueOf > endValue.valueOf();
  };
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    console.log(startValue.valueOf() > endValue.valueOf());
    if (!endValue || !startValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  onChange = (field, value) => {
    this.setState({ [field]: value });
  };
  onStartChange = (value) => {
    this.onChange('startValue', value);
  };
  onEndChange = (value) => {
    this.onChange('endValue', value);
  };
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  };
  //活动时间结束

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult, startValue, endValue, endOpen } = this.state;


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
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select className="icp-selector">
        <Option value="86">+86</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map((website) => {
      return <AutoCompleteOption key={website}>{website}</AutoCompleteOption>;
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label='活动类型' hasFeedback>
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择活动类型！' }],
          })(
            <Select>
              <Option value="0">Seminar</Option>
              <Option value="1">WorkShop</Option>
              <Option value="2">Poster</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="活动名称"
          hasFeedback
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入活动名称',
            }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={(
            <span>
              活动时间&nbsp;
            </span>
          )}
          hasFeedback
        >
          <Row gutter={8}>
            <Col span={12}>
              <DatePicker
                disableDate={this.disabledStartDate}
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                value={startValue}
                placeholder='Start'
                onChange={this.onStartChange}
                onOpenChange={this.handleStartOpenChange}
              />
            </Col>
            <Col span={12}>
              <DatePicker
                disableDate={this.disabledEndDate}
                showTime
                format='YYYY-MM-DD HH:mm:ss'
                value={endValue}
                placeholder='End'
                onChange={this.onEndChange}
                open={endOpen}
                onOpenChange={this.handleEndOpenChange}
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Habitual Residence"
        >
          {getFieldDecorator('residence', {
            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
          })(
            <Cascader options={residences}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Website"
        >
          {getFieldDecorator('website', {
            rules: [{ required: true, message: 'Please input website!' }],
          })(
            <AutoComplete
              dataSource={websiteOptions}
              onChange={this.handleWebsiteChange}
              placeholder="website"
            >
              <Input />
            </AutoComplete>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;

// export default RegistrationForm;
