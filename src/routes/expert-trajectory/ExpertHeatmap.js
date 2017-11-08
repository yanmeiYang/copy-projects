import React from 'react';
import { connect } from 'dva';
import { Slider, InputNumber, Row, Col, Button } from 'antd';
import { request, queryURL } from 'utils';
import loadScript from 'load-script';
import styles from './ExpertHeatmap.less';
import {
  showChart,
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
    let counter = 0;
    const divId = 'chart';
    const echartsInterval = setInterval(() => {
      if (typeof (window.BMap) === 'undefined') {
        counter += 1;
        if (counter > 20) {
          clearInterval(echartsInterval);
          loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
            loadScript('/lib/echarts-map/world.js', () => {
              myChart = window.echarts.init(document.getElementById(divId));
              showChart(myChart, 'geo');
              if (this.props.data === '') {
                console.log('Try to clcik one person!');
              } else { //为以后将ExpertTrajectory做组件使用
                console.log(this.props.data);
                console.log(this.props.expertTrajectory.heatData);
              }
            });
          });
        }
      } else {
        loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
          loadScript('/lib/echarts-trajectory/bmap.min.js', () => {
            clearInterval(echartsInterval);
            myChart = window.echarts.init(document.getElementById(divId));
            showChart(myChart, 'bmap');
            if (this.props.data === '') {
              console.log('Try to clcik one person!');
            } else { //为以后将ExpertTrajectory做组件使用
              console.log(this.props.data);
              console.log(this.props.expertTrajectory.heatData);
            }
          });
        });
      }
    }, 100);
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
