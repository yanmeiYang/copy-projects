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
import 'echarts/lib/chart/line';
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
    const title = q + ' 领域趋势图';
    const label = q  +'  热度值';
    console.log(label);
    const axisData = [];
    const freq = [];
    const weight = [];
    for (const f in info.freq) {
      axisData.push(info.freq[f].y);
      freq.push({'value':info.freq[f].f,'name':["'智能快递柜'", "最近，中国不少地方的街头都出现了一种外形类似于超市寄存柜一样的“智能快递柜”，为用户随时收件，提供24小时自助取件服务。业内人士指出"]});
      weight.push(info.freq[f].w);
    }
    console.log(freq)
    const option = {
      title: {
        text: title,
        left: '50%',
        textAlign: 'center',
      },
      tooltip: {
        trigger: 'asix',
        axisPointer: {
          lineStyle: {
            color: '#ddd',
          },
        },
        backgroundColor: 'rgba(255,255,255,1)',
        padding: [5, 10],
        textStyle: {
          color: '#7588E4',
        },
        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
      },
      legend: {//旁边的标签说明
        right: 180, //右边的距离
        orient: 'vertical',
        data: [label],
      },
      xAxis: {//x轴
        type: 'category',
        data: axisData,
        boundaryGap: false,
        splitLine: {
          show: true,
          interval: 'auto',
          lineStyle: {
            color: ['#D4DFF5'],
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#58c8da',
          },
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14,
          },
        },
      },
      yAxis: {//y轴
        type: 'value',
        splitLine: {
          lineStyle: {
            color: ['#D4DFF5'],
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#58c8da',
          },
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14,
          },
        },
      },
      series: [{
        name: label, //要和前面的对应
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 6,
        data: freq,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(199, 237, 250,0.5)',
            }, {
              offset: 1,
              color: 'rgba(199, 237, 250,0.2)',
            }], false),
          },
        },
        itemStyle: {//上方线的样式
          normal: {
            color: '#f7b851',
          },
        },
        lineStyle: {//上方线的样式
          normal: {
            width: 3,
          },
        },
      }],
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
