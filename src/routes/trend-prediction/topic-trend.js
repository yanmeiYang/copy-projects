/**
 * Create by Shaozhou,2017.9.23
 */
import React from 'react';
import { connect } from 'dva';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/graph';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './topic-trend.less';
import { Auth } from '../../hoc';

@connect(({ app }) => ({ app }))
@Auth
export default class TopicTrend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {

  };

  componentDidMount() {
    const { query, dispatch } = this.props;
    this.callSearchTrendByMention(query);
    this.myChart = echarts.init(document.getElementById('trendchart'));
    this.showChart();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.showtrend(nextProps.query);
      return true;
    }
    return true;
  }

  callSearchTrendByMention = (query) => {
    console.log('@@@@@@@@@@@@@@@@@@@');
    this.props.dispatch({ type: 'topicTrend/searchTrendByMention', payload: { query } });
  };

  showChart = () => {
    var axisData = ['周一','周二','周三','很长很长的周四','周五','周六','周日'];
    var data = axisData.map(function (item, i) {
      return Math.round(Math.random() * 1000 * (i + 1));
    });
    var links = data.map(function (item, i) {
      return {
        source: i,
        target: i + 1
      };
    });
    links.pop();
    const option = {
      title: {
        text: '笛卡尔坐标系上的 Graph'
      },
      tooltip: {},
      xAxis: {
        type : 'category',
        boundaryGap : false,
        data : axisData
      },
      yAxis: {
        type : 'value'
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          coordinateSystem: 'cartesian2d',
          symbolSize: 40,
          label: {
            normal: {
              show: true
            }
          },
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          data: data,
          links: links,
          lineStyle: {
            normal: {
              color: '#2f4554'
            }
          }
        }
      ]
    };
    this.myChart.setOption(option);
  }

  render() {
    return (
      <div className={styles.trendmap}>
        <div id="trendchart" style={{ height: '800px', width: '100%' }} />
      </div>
    );
  }
}
