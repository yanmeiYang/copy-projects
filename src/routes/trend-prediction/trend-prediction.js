/**
 */
import React from 'react';
import { Tabs, Icon,Slider } from 'antd';
import { connect } from 'dva';
import trend from '../../../external-docs/trend-prediction/trend_out.json';
import styles from './trend-prediction.less';

const TabPane = Tabs.TabPane;
const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};
/**
 * Component
 * @param id
 */
class TrendPrediction extends React.PureComponent {
  componentDidMount() {

  }

  render() {
    return (
      <div className={styles.trend}>
        <Slider marks={marks} step={10} range defaultValue={[20, 50]} disabled={false} />
        <div className={styles.nav} id="right-box">
          <Tabs defaultActiveKey="2" type="card">
            <TabPane tab={<span><Icon type="calendar" />Current Hotspot</span>} key="1">
              <div id="first-three"></div>
            </TabPane>
            <TabPane tab={<span><Icon type="global" />Overall</span>} key="2">
              <div id="revert"></div>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.show} id="">ddd</div>
        <div id="tooltip">
          <p>
            <strong id="value"></strong>
          </p>
        </div>
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(TrendPrediction);
