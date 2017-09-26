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
    const data = [["2000-06-05",116],["2000-06-06",129],["2000-06-07",135],["2000-06-08",86],["2000-06-09",73],["2000-06-10",85],["2000-06-11",73],["2000-06-12",68],["2000-06-13",92],["2000-06-14",130],["2000-06-15",245],["2000-06-16",139],["2000-06-17",115],["2000-06-18",111],["2000-06-19",309],["2000-06-20",206],["2000-06-21",137],["2000-06-22",128],["2000-06-23",85],["2000-06-24",94],["2000-06-25",71],["2000-06-26",106],["2000-06-27",84],["2000-06-28",93],["2000-06-29",85],["2000-06-30",73],["2000-07-01",83],["2000-07-02",125],["2000-07-03",107],["2000-07-04",82],["2000-07-05",44],["2000-07-06",72],["2000-07-07",106],["2000-07-08",107],["2000-07-09",66],["2000-07-10",91],["2000-07-11",92],["2000-07-12",113],["2000-07-13",107],["2000-07-14",131],["2000-07-15",111],["2000-07-16",64],["2000-07-17",69],["2000-07-18",88],["2000-07-19",77],["2000-07-20",83],["2000-07-21",111],["2000-07-22",57],["2000-07-23",55],["2000-07-24",60]];

    var dateList = data.map(function (item) {
      return item[0];
    });
    var valueList = data.map(function (item) {
      return item[1];
    });

    const option = {

      // Make gradient line here
      visualMap: [{
        show: false,
        type: 'continuous',
        seriesIndex: 0,
        min: 0,
        max: 400
      }, {
        show: false,
        type: 'continuous',
        seriesIndex: 1,
        dimension: 0,
        min: 0,
        max: dateList.length - 1
      }],


      title: [{
        left: 'center',
        text: 'Gradient along the y axis'
      }, {
        top: '55%',
        left: 'center',
        text: 'Gradient along the x axis'
      }],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: [{
        data: dateList
      }, {
        data: dateList,
        gridIndex: 1
      }],
      yAxis: [{
        splitLine: {show: false}
      }, {
        splitLine: {show: false},
        gridIndex: 1
      }],
      grid: [{
        bottom: '60%'
      }, {
        top: '60%'
      }],
      series: [{
        type: 'line',
        showSymbol: false,
        data: valueList
      }, {
        type: 'line',
        showSymbol: false,
        data: valueList,
        xAxisIndex: 1,
        yAxisIndex: 1
      }]
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
