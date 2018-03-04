/**
 * Created by ranyanchuan on 2017/12/7.
 */
import React from 'react';
import { connect } from 'dva';
import { loadECharts } from 'utils/requirejs';
import styles from './index.less';
@connect(({ loading }) => ({ loading }))
export default class HistoryLineChart extends React.Component {
  componentDidMount() {
    this.initBarChar(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initBarChar(nextProps);
  }

  componentWillUpdate(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.initBarChar(nextProps);
    }
  }

  initBarChar = (param) => {
    loadECharts((echarts) => {
      const { xAxis, data, id, toolboxShow } = param;
      if (data.length === 0) {
        xAxis.map(() => data.push(0));
      }
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(`${id}l`));
      // 指定图表的配置项和数据
      const option = {
        title: {
          // text: title,
          // subtext: '纯/属虚构',
        },
        tooltip: {
          trigger: 'axis',
        },

        // legend: {
        //   data: legend,
        // },
        toolbox: {
          show: toolboxShow || false,
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
            // name: legend[0],
            type: 'line',
            data,
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
      <div id={this.props.id} className={styles.lineChart}>
        <div id={`${this.props.id}l`} className={styles.echart} />
        { this.props.title &&
        <div className={styles.footer}>{this.props.title}</div>
        }
      </div>
    );
  }
}

