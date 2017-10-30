/**
 * Created by yangyanmei on 17/8/31.
 */
import React from 'react';
import { connect } from 'dva';
import loadScript from 'load-script';

// import echarts from 'echarts/lib/echarts'; // 必须
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/geo';
// import 'echarts/lib/chart/bar';

let echarts; // used for loadScript

@connect()
export default class TopicBarChart extends React.Component {

  componentDidMount() {
    loadScript('/lib/echarts.js', () => {
      echarts = window.echarts; // eslint-disable-line prefer-destructuring
      this.myChart = echarts.init(document.getElementById('topic'));
      this.initBarChar(this.props.topic);
    });
  }

  componentWillReceiveProps(nextProps) {
    this.initBarChar(nextProps.topic);
  }

  initBarChar = (topic) => {
    if (topic.label) {
      const xAxis = [];
      const yAxis = [];
      if (topic.freq) {
        for (let i = 0; i < topic.freq.length; i++) {
          xAxis.push(topic.freq[i].y);
          if (i === topic.freq.length - 1 && topic.freq.length > 3) {
            const newW = (topic.freq[i].w + topic.freq[i - 1].w + topic.freq[i - 2].w) / 3
            yAxis.push(newW);
          } else {
            yAxis.push(topic.freq[i].w);
          }
        }
      }
      // for (const f of topic.freq) {
      //   xAxis.push(f.y);
      //   yAxis.push(f.w);
      // }
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

