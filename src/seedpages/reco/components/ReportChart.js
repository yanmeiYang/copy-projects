import React from 'react';
import { connect } from 'dva';
import { loadECharts } from 'utils/requirejs';
import styles from './ReportChart.less';

@connect(({ app, reco }) => ({ app, reco }))
export default class ReportChart extends React.Component {
  componentDidMount() {
    if (this.props.projId) {
      this.props.dispatch({
        type: 'reco/viewPerson',
        payload: { ids: this.props.projId, num: '0,1' },
      }).then((data) => {
        this.initBarChar(data.items);
      });
    }
  }

  initBarChar = (data) => {
    loadECharts((echarts) => {
// 处理数据
      let hindex10 = 0,
        hindex20 = 0,
        hindex30 = 0,
        hindex40 = 0,
        hindex50 = 0,
        hindex60 = 0,
        hindex70 = 0;
      if (data) {
        data.forEach((person) => {
          const num = parseInt(person.indices.hindex, 10);
          if (num - 60 > 0) {
            hindex70++;
          } else if (num - 50 >= 0) {
            hindex60++;
          } else if (num - 40 >= 0) {
            hindex50++;
          } else if (num - 30 >= 0) {
            hindex40++;
          } else if (num - 20 >= 0) {
            hindex30++;
          } else if (num - 10 >= 0) {
            hindex20++;
          } else {
            hindex10++;
          }
        });
        const hindexData = [hindex10, hindex20, hindex30, hindex40, hindex50, hindex60, hindex70];
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(document.getElementById('recochart'));
        // 指定图表的配置项和数据
        const option = {
          title: {
            text: '打开邮件用户H-index精准分布',
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true },
            },
          },
          calculable: true,
          xAxis: [
            {
              type: 'value',
              boundaryGap: [0, 0.01],
            },
          ],
          yAxis: [
            {
              type: 'category',
              data: ['<10', '10~20', '20~30', '30~40', '40~50', '50~60', '>60'],
            },
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              data: hindexData,
              itemStyle: {
                normal: {
                  color: '#4ad2ff',
                },
              },
              barWidth: 20,
              markPoint: {
                data: [
                  { type: 'max', name: '最大值' },
                  { type: 'min', name: '最小值' },
                ],
              },
            },
          ],
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
      }
    });
  };

  render() {
    return (
      <div id="recochart" className={styles.recoechart} />
    );
  }
}

