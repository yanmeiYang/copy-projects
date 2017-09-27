/**
 * Create by Shaozhou,2017.9.23
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import styles from './topic-trend.less';
import { Auth } from '../../hoc';

const hotwords = ['Answer Machine', 'Artificial Intelligence', 'Autopilot', 'BlockChain', 'Computer Vision', 'Data Mining', 'Data Modeling', 'Deep Learning', 'Graph Databases', 'Internet of Things', 'Machine Learning', 'Robotics', 'Networks', 'NLP', 'Neural Network'];

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
    const { query } = this.props;
    this.callSearchTrendByMention(query);
    this.myChart = echarts.init(document.getElementById('trendchart'));//初始化
    window.onresize = () => {
      this.myChart.resize();
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.topicTrend.trendInfo &&
      this.props.topicTrend.trendInfo !== nextProps.topicTrend.trendInfo) {
      this.showChart(nextProps.topicTrend.trendInfo, this.props.query);
      return true;
    }
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.callSearchTrendByMention(nextProps.query);
      return true;
    }
    return true;
  }

  onKeywordClick = (query) => {
    this.props.dispatch(routerRedux.push({ pathname: '/trend-prediction', search: `?query=${query}` }));
  }

  callSearchTrendByMention = (query) => {
    this.props.dispatch({ type: 'topicTrend/searchTrendByMention', payload: { query } });
  };

  findkeyword = (info, f, totalf) => {
    let words = [];
    let formernum = 0;//它之前的词频
    for (let u = 0; u < f; u += 1) {
      formernum += info.freq[u].f;
    }
    if (info.sub_topics.length !== 0) { //存在子话题数据的时候
      let start = (formernum / totalf) * info.sub_topics.length;
      let end = ((formernum + info.freq[f].f) / totalf) * info.sub_topics.length;
      start = parseInt(start, 10);
      end = parseInt(end, 10);
      if ((end - start) < 4) { //关键词不足两个的时候
        let count = 0;
        while (count < 4) {
          if ((start === 0) && ((end + 1) === info.sub_topics.length)) {
            break;
          } else {
            if (start !== 0) {
              start -= 1; //向前移动一个
              count += 1;
            }
            if ((end + 1) !== info.sub_topics.length) {
              end += 1;
              count += 1;
            }
          }
        }
      }
      const wd = info.sub_topics.slice(start, end);
      const kws = [];
      for (let w = 0; w < wd.length; w += 1) {
        kws.push(wd[w].label);
      }
      words = kws;
    } else {
      console.log(1);
    }
    return words;
  }

  showExpert = (word) => {
    console.log(word);
  }

  findhot = (info, q) => {
    const title = `${q} 领域趋势图`; //注意这里不是单引号，是键盘1旁边的·
    const label = `${q} 论文热度值`;
    const label2 = `${q} 专家关注度`;
    const axisData = [];
    const freq = [];
    const weight = [];
    const hw = [];
    let totalf = 0;
    for (let f = 0; f < info.freq.length; f += 1) {
      totalf += info.freq[f].f;
    }
    for (let f = 0; f < info.freq.length; f += 1) {
      axisData.push(info.freq[f].y);
      //生成技术热点的词
      const keys = this.findkeyword(info, f, totalf);
      let ck = '';
      const that = this;
      for (let k = 0; k < keys.length; k += 1) {
        //console.log(keys[k]);
        ck += `<a href="#" onclick="that.showExpert(1)">${keys[k]}</a><br />`;
      }
      hw[f] = ck;
      freq.push({ value: info.freq[f].f, name: [`${info.freq[f].y}年该领域热点技术`,
        hw[f]] });
      weight.push(info.freq[f].w * 150000);
    }
    const result = { title, label, label2, axisData, freq, weight };
    //该句等于{ title: title, label: label, axisData: axisData, freq: freq, weight: weight };
    return result;
  }


  showChart = (info, q) => {
    const result = this.findhot(info, q);
    const title = result.title;
    const label = result.label;
    const label2 = result.label2;
    const axisData = result.axisData;
    const freq = result.freq;
    const weight = result.weight;
    const option = {
      title: {
        text: title,
        left: '50%',
        textAlign: 'center',
      },
      tooltip: {
        alwaysShowContent: true,
        bordeRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 0,
        position: 'top',
        textStyle: {
          fontSize: 12,
          color: '#333',
        },
        formatter: (params) => {
          //console.log(params);
          const colorset = ['#ff3d3d', '#00a0e9', '#f603ff', '#00b419', '#5f52a0'];
          const color = colorset[parseInt(params.dataIndex, 10) % colorset.length]; //parseInt，10进制
          let a = `<div style='background-color:${color};padding: 6px 6px;text-align:center;color:white;font-size: 18px;'>${params.data.name[0]}</div>`;
          a += "<div style='padding:5px;width:214px;padding:13px;min-height:100px;word-wrap:break-word;word-break:break-all;white-space: pre-wrap;font-size:13px;'>";
          a += `${params.data.name[1]}<br>`;
          a += '</div>';
          return a;
        },
      },
      legend: {//旁边的标签说明
        right: 100, //右边的距离
        orient: 'vertical',
        data: [label, label2],
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
        showSymbol: true, //显示线上的点
        symbol: 'circle',
        symbolSize: 16,
        color: 'auto',
        borderColor: 'auto',
        borderWidth: 'auto',
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
      }, {
        name: label2,
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 6,
        data: weight,
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(216, 244, 247,1)',
            }, {
              offset: 1,
              color: 'rgba(216, 244, 247,1)',
            }], false),
          },
        },
        itemStyle: {
          normal: {
            color: '#00a0e9',
          },
        },
        lineStyle: {
          normal: {
            width: 3,
          },
        },
      }], label: {//线上显示值
        normal: {
          show: true,
          position: 'top', //值显示
        },
      },
    };
    this.myChart.setOption(option);
  }

  render() {
    let i = 0;
    const that = this;
    return (
      <div className={styles.trendmap}>
        <div className={styles.keywords}>
          <div className={styles.inner}>
            {
              hotwords.map((hw) => {
                i += 1;
                return (
                  <div key={i}>
                    <a key={i} role="presentation" onClick={that.onKeywordClick.bind(that, hw)}>{hw}</a>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div id="trendchart" style={{ height: '800px', width: '80%', float: 'left' }} />
        <div id="statistic" style={{ height: '800px', width: '20%', float: 'right' }} >
          <div>统计：</div>
        </div>
      </div>
    );
  }
}
