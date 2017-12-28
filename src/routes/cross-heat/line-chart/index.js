/**
 * Created by ranyanchuan on 2017/12/7.
 */
import React from 'react';
import { connect } from 'dva';
import { RequireRes } from 'hoc';
import { ensure } from 'utils';

@connect(({ loading }) => ({ loading }))
@RequireRes('echarts')
export default class HistoryLineChart extends React.Component {
  componentDidMount() {
    this.initBarChar(this.props.param);
  }

  componentWillReceiveProps(nextProps) {
    this.initBarChar(nextProps.param);
  }

  componentWillUpdate(nextProps) {
    if (this.props.param.id !== nextProps.param.id) {
      this.initBarChar(nextProps.param);
    }
  }

  initBarChar = (param) => {
    ensure('echarts', (echarts) => {
      const { xAxis, data, title, legend, id } = param;
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(id));
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: title,
          // subtext: '纯/属虚构',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: legend,
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis,
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [
          {
            name: legend[0],
            type: 'line',
            data: data,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' },
              ],
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
              ],
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    });
  };

  render() {
    return (
      <div id={this.props.param.id} style={{ height: '300px' }} />
    );
  }
}

