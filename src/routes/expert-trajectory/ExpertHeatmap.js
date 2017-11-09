import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { request, queryURL } from 'utils';
import styles from './ExpertHeatmap.less';
import {
  showChart,
  load,
} from './utils/echarts-utils';

let myChart;

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {

  };

  componentWillMount() {
    this.initChart();
  }

  componentDidMount() {

  }

  initChart = () => {
    const divId = 'chart';
    load((echarts) => {
      myChart = echarts.init(document.getElementById(divId));
      showChart(myChart, 'bmap');
      if (this.props.data === '') {
        console.log('Try to click one person!');
      } else { //为以后将ExpertTrajectory做组件使用
        console.log(this.props.data);
        console.log(this.props.expertTrajectory.heatData);
      }
    });
  };

  render() {
    return (
      <div>
        <div className={styles.heatmap} id="chart" />
      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmap);
