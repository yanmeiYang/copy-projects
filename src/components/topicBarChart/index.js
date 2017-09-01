/**
 * Created by yangyanmei on 17/8/31.
 */
import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/bar';

@connect()
export default class TopicBarChart extends React.Component {

  componentDidMount() {
    this.myChart = echarts.init(document.getElementById('topic'));
    const topic = this.props.topic;
    this.initBarChar(topic);
  }

  componentWillReceiveProps(nextProps) {
    this.initBarChar(nextProps.topic);
  }

  initBarChar = (topic) => {
    if (topic.label) {
      const xAxis = [];
      const yAxis = [];
      for (const f of topic.freq) {
        xAxis.push(f.y);
        yAxis.push(f.w);
      }
      const option = {
        color: ['#3398DB'],
        tooltip: { axisPointer: { type: 'shadow' } },
        grid: { x: 10, y: 10, x2: 10, y2: 30, left: '-32px', bottom: '3%', containLabel: true, },
        xAxis: [{ type: 'category', data: xAxis, splitLine: { show: true } }],
        yAxis: [
          {
            type: 'value',
            show: true,
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        series: [{ name: topic.label, type: 'bar', data: yAxis }],
      };
      this.myChart.setOption(option);
    }
  }

  render() {
    return (
      <div id="topic" style={{ height: '150px' }}></div>
    );
  }
}

