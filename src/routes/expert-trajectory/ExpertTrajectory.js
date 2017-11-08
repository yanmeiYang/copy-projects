import React from 'react';
import { connect } from 'dva';
import loadScript from 'load-script';
import { Button } from 'antd';
import styles from './ExpertTrajectory.less';
import {
  showChart,
} from './utils/echarts-utils';

let myChart; // used for loadScript

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertTrajectory extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentDidMount() {
    this.initChart();
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    if (nextProps.expertTrajectory.trajData !== this.props.expertTrajectory.trajData) {
      this.showTrajectory(nextProps.expertTrajectory.trajData); //用新的来代替
    }
    return true;
  }

  initChart = () => {
    let counter = 0;
    const divId = 'chart';
    const echartsInterval = setInterval(() => {
      if (typeof (window.BMap) === 'undefined') {
        counter += 1;
        if (counter > 200) {
          clearInterval(echartsInterval);
          document.getElementById(divId).innerHTML = 'Cannot connect to Baidu Map! Please check the network state!';
        }
      } else {
        loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
          loadScript('/lib/echarts-trajectory/bmap.min.js', () => {
            clearInterval(echartsInterval);
            myChart = window.echarts.init(document.getElementById(divId));
            showChart(myChart);
          });
        });
      }
    }, 100);
  };

  showTrajectory = (data) => {
    const points = [];
    const address = [];
    for (const key in data.data.addresses) {
      if (data.data.addresses) {
        address[key] = data.data.addresses[key];
        points.push({
          name: address[key].name, //可加入城市信息
          value: [address[key].geo.lng, address[key].geo.lat],
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#f56a00',
              borderColor: '#d75000',
            },
          },
        });
      }
    }
    const trajData = [];
    for (const key in data.data.trajectories) {
      if (data.data.trajectories) {
        let startYear;
        let previous = '';
        for (const d of data.data.trajectories[key]) {
          if (previous !== d[1] && previous !== '') {
            trajData.push({
              coords: [[address[previous].geo.lng, address[previous].geo.lat],
                [address[d[1]].geo.lng, address[d[1]].geo.lat]],
            });
          }
          if (previous === '') {
            [previous, startYear] = [d[1], parseInt(d[0], 10)];
          }
        }
      }
    }
    const option = myChart.getOption();
    option.series[0].data = points;
    option.series[1].data = trajData;
    myChart.setOption(option);
  };

  render() {
    return (
      <div>
        <div className={styles.wor} id="chart" />
      </div>
    );
  }
}

export default ExpertTrajectory;
