/**
 * Created by ranyanchuan on 17/8/5.
 */
import React from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
import styles from './index.less';

const { RangePicker } = DatePicker;
const dFormat = 'yyyy-MM-dd HH:mm';
class CanlendarInForm extends React.Component {
  state = {
    startValue: `${(new Date()).format('yyyy-MM-dd')} 09:00`,
    endValue: `${(new Date()).format('yyyy-MM-dd')} 18:00`,
  };

  componentWillMount = () => {
    if (!this.props.forbidCallback) {
      this.props.callbackParent('startValue', moment(this.state.startValue));
      this.props.callbackParent('endValue', moment(this.state.endValue));
    } else {
      this.setState({
        startValue: new Date(this.props.startValue).format(dFormat),
        endValue: new Date(this.props.endValue).format(dFormat),
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.startValue !== this.props.startValue && nextProps.startValue) {
      this.setState({ startValue: new Date(nextProps.startValue).format(dFormat) });
    }
    if (nextProps.endValue !== this.props.endValue && nextProps.endValue ) {
      this.setState({ endValue: new Date(nextProps.endValue).format(dFormat) });
    }
  };

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
    const dateFormat = 'YYYY-MM-DD HH:mm';
    return (
      <div>
        {startValue && endValue &&
        <RangePicker
          className={styles.calendar}
          showTime={{ format: 'HH:mm' }}
          format={dateFormat}
          placeholder={['开始时间', '结束时间']}
          value={[moment(startValue, dateFormat), moment(endValue, dateFormat)]}
          // defaultValue={[moment(startValue, dateFormat), moment(endValue, dateFormat)]}
          onChange={this.onChange}
          onOk={this.onOk}
          allowClear={false}
        />
        }
      </div>
    );
  }
}
export default CanlendarInForm;

