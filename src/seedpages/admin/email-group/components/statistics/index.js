/**
 * Created by ranyanchuan on 2018/3/13.
 */
import React from 'react';
import { connect } from 'engine';
import { loadECharts } from 'utils/requirejs';
import styles from './index.less';
@connect(({loading}) => ({loading}))
export default class EmailStatistics extends React.Component {
  componentDidMount() {
    this.initEchart();
  }

  initEchart = () => {
    loadECharts((echarts) => {
      // 基于准备好的dom，初始化echarts实例
      const {id, origin} = this.props;
      const {date, data} = origin;
      const myChart = echarts.init(document.getElementById(id || 'myEchart'));
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增用户', '主动订阅', '退订用户', '订阅用户']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date || [],
        },
        yAxis: {
          type: 'value'
        },
        series: data || [],
      };
      myChart.setOption(option);
    });
  };

  render() {
    const {id} = this.props;
    return (
      <div className={styles.userEmailEchart}>
        <div id={id || 'myEchart'} className={styles.echart}/>
      </div>
    );
  }
}

