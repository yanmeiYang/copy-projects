/**
 * Created by yangyanmei on 17/6/1.
 */
import React from 'react';
import moment from 'moment';
import {
  Row,
  Col,
  DatePicker,
} from 'antd';
import styles from './index.less';

class CanlendarInForm extends React.Component {
  state = {
    confirmDirty: false,
    startValue: null,
    endValue: null,
    endOpen: false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.startValue) {
      this.setState({ startValue: moment(nextProps.startValue) });
    }
    if (nextProps.endValue) {
      this.setState({ endValue: moment(nextProps.endValue) });
    }
  }

  //活动时间开始
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf > endValue.valueOf();
  };
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  onChange = (field, value) => {
    this.setState({ [field]: value });
    this.props.callbackParent(field, value);
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

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <Row gutter={8}>
        <Col span={12}>
          <DatePicker
            disableDate={this.disabledStartDate}
            showTime={{ defaultValue: moment('09:00', 'HH:mm') }}
            format="YYYY-MM-DD HH:mm"
            ref="startValue"
            value={startValue}
            placeholder="开始"
            onChange={this.onStartChange}
            onOpenChange={this.handleStartOpenChange}
          />
        </Col>
        <Col span={12}>
          <DatePicker
            disableDate={this.disabledEndDate}
            showTime={{ defaultValue: moment('09:00', 'HH:mm') }}
            format="YYYY-MM-DD HH:mm"
            ref="endValue"
            value={endValue}
            placeholder="结束"
            onChange={this.onEndChange}
            open={endOpen}
            onOpenChange={this.handleEndOpenChange}
          />
        </Col>
      </Row>
    );
  }
}
export default CanlendarInForm;

