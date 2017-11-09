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
const heatData = []; //热力信息[[lng,lat,num],..,]
let years; //年份
const trajData = []; //{coords:[[lng,lat],[lng,lat]],...,coords:[[lng,lat],[lng,lat]]}

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmap extends React.Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.expertTrajectory.heatData &&
      nextProps.expertTrajectory.heatData !== this.props.expertTrajectory.heatData) {
      this.processData(nextProps.expertTrajectory.heatData);
      this.loadHeat(2000);
    }
    return true;
  }

  initChart = () => {
    const divId = 'chart';
    load((echarts) => {
      myChart = echarts.init(document.getElementById(divId));
      showChart(myChart, 'bmap');
      if (typeof (this.props.data.data) === 'undefined') {
        console.log('Try to click one person!');
      } else { //为以后将ExpertTrajectory做组件使用
        this.processData(this.props.data);
        this.loadHeat(2000);
      }
    });
  };

  processData = (data) => {
    const address = [];
    const statis = [];
    const pTrj = []; //每个人的迁徙过程
    const trj = data.data.trajectories;
    const add = data.data.addresses;
    for (const key in add) {
      if (key) {
        address[key] = add[key];
      }
    }
    let start = 10000;
    let end = 0;
    for (const key in trj) {
      if (key) {
        for (const t of trj[key]) {
          statis[parseInt(t[0], 10)] = [];
          if (parseInt(t[0], 10) < start) {
            start = parseInt(t[0], 10);
          }
          if (parseInt(t[0], 10) > end) {
            end = parseInt(t[0], 10);
          }
        }
      }
    }
    years = [start, end];
    for (let i = start; i <= end; i += 1) {
      for (const key in trj) {
        if (key) {
          pTrj[key] = [];
          for (const t of trj[key]) {
            if (parseInt(t[0], 10) === i) {
              if (typeof (statis[i][t[1]]) === 'undefined') {
                statis[i][t[1]] = 1;
              } else {
                statis[i][t[1]] += 1;
              }
            }
          }
        }
      }
    }
    for (let i = start; i <= end; i += 1) {
      heatData[i] = [];
      for (const s in statis[i]) {
        if (s) {
          console.log(add[s]);
          heatData[i].push([add[s].geo.lng, add[s].geo.lat, statis[i][s] * 10000]);
        }
      }
    }
  };

  loadHeat = (year) => {
    const option = myChart.getOption();
    option.series[0].data = heatData[year];
    myChart.setOption(option);
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
