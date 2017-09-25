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

@connect(({ app, topicTrend }) => ({ app, topicTrend }))
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
    this.myChart = echarts.init(document.getElementById('trendchart'));//初始化
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.showtrend(nextProps.query);
      //this.showChart();
      return true;
    }
    if (nextProps.topicTrend.trendInfo &&
      this.props.topicTrend.trendInfo !== nextProps.topicTrend.trendInfo) {
      this.showChart(nextProps.topicTrend.trendInfo, this.props.query);
      return true;
    }
    return true;
  }

  callSearchTrendByMention = (query) => {
    this.props.dispatch({ type: 'topicTrend/searchTrendByMention', payload: { query } });
  };

  showChart = (info, q) => {
    const title = q + '领域趋势图';
    const axisData = [];
    const freq = [];
    const weight = [];
    for (const f in info.freq) {
      axisData.push(info.freq[f].y);
      freq.push(info.freq[f].f);
      weight.push(info.freq[f].w);
    }
    const data = axisData.map((item, i) => {
      return freq[i];
    });
    const links = data.map((item, i) => {
      return {
        source: i,
        target: i + 1,
      };
    });
    links.pop();
    const option = {
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: axisData,
      },
      yAxis: {
        type: 'value',
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
              color: '#2f4554',
            },
          },
        },
      ],
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
