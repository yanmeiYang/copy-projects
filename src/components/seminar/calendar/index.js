/**
 * Created by ranyanchuan on 17/8/5.
 */
import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;
class CanlendarInForm extends React.Component {
  state = {
    startValue: `${(new Date()).format('yyyy-MM-dd')} 09:00`,
    endValue: `${(new Date()).format('yyyy-MM-dd')} 09:00`,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.startValue) {
      this.setState({ startValue: nextProps.startValue });
    }
    if (nextProps.endValue) {
      this.setState({ endValue: nextProps.endValue });
    }
  }

  onChange = (value, dataString) => {
    this.setState({ startValue: dataString[0] });
    this.setState({ endValue: dataString[1] });
  };

  onOk = (value) => {
    this.props.callbackParent('startValue', value[0]);
    this.props.callbackParent('endValue', value[1]);
  };

  render() {
    const { startValue, endValue } = this.state;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    return (
      <div>
        {startValue && endValue &&
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
          // value={[startValue,endValue]}
          defaultValue={[moment(startValue, dateFormat), moment(endValue, dateFormat)]}
          onChange={this.onChange}
          onOk={this.onOk}
        />
        }
      </div>
    );
  }
}
export default CanlendarInForm;

