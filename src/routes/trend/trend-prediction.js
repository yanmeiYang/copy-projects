import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import d3 from '../../../public/lib/d3.v3';
import d3sankey from './utils/sankey';
import styles from './trend-prediction.less';
import { Auth } from '../../hoc';
import { wget } from '../../utils/request';
import * as profileUtils from '../../utils/profile-utils';
import { getPerson } from '../../services/person';
import { searchPubById } from '../../services/trend-prediction-service';
import { sysconfig } from '../../systems';
import { Spinner } from '../../components';

const humps = require('humps');

let histPosition;
let chart;
let color;
let format;
let formatNumber;
let height;
let histHeight;
let margin;
let histWidth;
//let renderTrend;
let termByFreq;
let histChart;
let histItemHeight;
let width;
let trendData;
let axis;
let basis;
let termTrendStreamGraph;
let link;
let maxFreq;
let maxSum;
let node;
let terms;
let timeSlidesDict;
let timeSlidesOffset;
let timeWindow;
let axisWidth;
let cperson = null;
let cpaper = null;
let carr = [];
let idToAuthor;

const yearToXOffset = (year) => {
  const slide = trendData.yearToSlide[year];
  const years = trendData.timeSlides[slide];
  const offset = years.indexOf(year);
  const binWidth = width / (trendData.timeSlides.length);
  const binOffset = slide + ((offset + 1) / years.length);
  return binWidth * binOffset;
};

const TabPane = Tabs.TabPane;

const HOT_TERMS = ['Answer Machine', 'Artificial Intelligence', 'Autopilot', 'BlockChain', 'Computer Vision', 'Data Mining', 'Data Modeling', 'Deep Learning', 'Graph Databases', 'Internet of Things', 'Machine Learning', 'Robotics', 'Networks', 'Natural Language Processing', 'Neural Network'];
/**
 * Component
 * @param id
 */
@connect(({ app, topicTrend }) => ({ app, topicTrend }))
@Auth
export default class TrendPrediction extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    person: cperson,
    paper: cpaper,
    loadingFlag: true,
  };

  componentDidMount() {
    d3sankey();
    this.updateTrend(this.props.query);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query && prevProps.query !== this.props.query) {
      d3sankey();
      this.updateTrend(this.props.query);
    }
  }

  onChange = (key) => {
    d3.select('.active').classed('active', false);
    d3.select(this.parentNode).classed('active', true);
    d3.selectAll('.term').remove();
    switch (key) { //全局的时候按照词频排
      case '1':
        this.sortTerms('recent');
        break;
      case '2':
        this.sortTerms('overall');
        break;
      case '3':
        this.sortTerms('origin');
        break;
      default:
        break;
    }
    if (trendData.terms[0].t.toLowerCase() === this.props.query) {
      trendData.terms = trendData.terms.slice(1, trendData.terms.length);//减去词频最高的词语
    }
    this.renderHist();
    this.renderTermTrend(trendData.terms[0]);
  };

  onKeywordClick = (query) => {
    this.setState({ loadingFlag: true });
    this.props.dispatch(routerRedux.push({ pathname: '/trend', search: `?query=${query}` }));
  };

  sortTerms = (method) => {
    terms = {};
    maxSum = 0;
    let func = _ => true;
    switch (method) {
      case 'recent':
        func = term => ((term.y > 2012) && (term.d > 0));
        break;
      case 'origin':
        func = term => (trendData.yearToSlide[term.y] <= 5);
        break;
      default:
        break;
    }
    // current hotsopt中按各技术2010年之后的文献总数排序
    trendData.terms.forEach((t) => {
      t.sum = 0;
      t.year.forEach((tt) => {
        if (func(tt)) {
          t.sum += tt.d;
        }
      });
      if (t.sum > maxSum) {
        maxSum = t.sum;
      }
      terms[t.t] = t;
    });
  };

  initChart = (term) => {
    margin = {
      top: 1,
      right: 0,
      bottom: 6,
      left: 100,
    };
    width = 1500; // 需调整参数，容器宽度
    height = 1000 - margin.top - margin.bottom; // 需调整参数，容器高度，华为修改500，四个地方，另外三个为隐藏
    histWidth = 380;
    histHeight = 100;// 左侧直方图的高度
    histPosition = histWidth / 2;// 直方图左边文字的宽度
    histItemHeight = 20;// 左侧直方图的间隔距离
    formatNumber = d3.format(',.0f');
    format = (d) => { // 格式化为整数，点出现的次数
      return `${formatNumber(d)} Times`;
    };
    color = d3.scale.category10();// d3图的配色样式
    if (chart) {
      chart.remove();
    }

    terms = {};
    maxSum = 0;
    // current hotsopt中按各技术2010年之后的文献总数排序
    trendData.terms.forEach((t) => {
      t.sum = 0;
      t.year.forEach((tt) => {
        t.sum += tt.d;
      });
      if (t.sum > maxSum) {
        maxSum = t.sum;
      }
      terms[t.t] = t;
    });
    idToAuthor = {};
    trendData.authors.forEach((a) => {
      idToAuthor[a.id] = a;
    });
    this.sortTerms('recent');
    chart = d3.select('#chart')
      .append('svg')
      .attr('overflow', 'scroll')
      .attr('id', 'vis')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${0},${25})`)
      .style('margin-left', `${histWidth}px`)
      .attr('z-index', 1);

    // 显示整个界面的方法，sankey为技术发展图
    this.renderAxis();
    this.renderHist();
    this.renderTrend(term, 1, 1000);
    this.renderTermTrend(termByFreq[0]);
  };

  updateTrend = (query) => {
    d3.select('#tooltip').classed('hidden', true).style('visibility', 'hidden');//最开始的时候都将它们设置为不可见
    d3.select('#tooltip1').classed('hidden', true).style('visibility', 'hidden');
    const term = (query === '') ? this.props.query : query;

    this.setState({ loadingFlag: true });
    const dd = wget(`http://dc.api.aminer.org/trend/${term}`);
    const that = this;
    dd.then((data) => {
      trendData = humps.camelizeKeys(data, (key, convert) => {
        return key.includes(' ') && !key.includes('_') ? key : convert(key);
      });
      that.setState({ loadingFlag: false });
      this.initChart(term);
    });
  };

  renderHist = () => {
    d3.select('#hist-chart-inner').remove();
    histChart = d3.select('#hist-chart')
      .append('svg')
      .attr('overflow', 'scroll')
      .attr('z-index', 2)
      .attr('id', 'hist-chart-inner')
      .attr('overflow-y', 'scroll');//里面的高度

    histChart.attr('height', () => {
      return ((histItemHeight + 1) * trendData.terms.length); //svg高度，每个词是20
    });
    histChart.append('line')
      .attr('x1', histPosition + 10)
      .attr('x2', histPosition + 10)
      .attr('y1', 0)
      .attr('y2', () => {
        return ((histItemHeight + 1) * trendData.terms.length); //svg高度，每个词是20
      })
      .style('stroke', 'gray')
      .style('stroke-width', 0.5);

    // 左侧的统计框
    termByFreq = [];
    trendData.terms.sort((a, b) => {
      return b.sum - a.sum;
    });
    if (trendData.terms[0].t.toLowerCase() === this.props.query) {
      trendData.terms = trendData.terms.slice(1, trendData.terms.length);//减去词频最高的词语
    }

    const histGraph = histChart
      .append('g')
      .selectAll('.term')
      .data(trendData.terms)
      .enter()
      .append('g')
      .attr('class', 'term')
      .attr('transform', (d, i) => {
        termByFreq[i] = d;
        return `translate(${[0, (i * histItemHeight) + 10]})rotate(${0})`;// 左侧图离标签页的距离，字和直方图的旋转
      })
      .attr('id', (d) => {
        return `term-${d.t.replace(/\s+/g, '')}`;
      })
      .on('click', (d) => {
        this.renderTermTrend(d);
      });

    // 页面左侧统计模块的直方图
    histGraph.append('rect').attr('x', () => { // 直方图离线的距离
      return histPosition + 10;
    }).attr('y', () => { // 直方图离上方的高度
      return 0;
    }).attr('height', histItemHeight - 2)
      .attr('width', (d) => { // 直方图的宽度为18
        return (histHeight * d.sum) / maxSum;// 高度为计算得出
      })
      .style('fill-opacity', 0.7)
      .style('fill', '#60aFe9')
      .append('svg:title')
      .text((d) => {
        return d.sum;
      });

    histGraph.append('text').attr('text-anchor', 'end').attr('transform', () => {
      return `translate(${[histPosition, 0]})rotate(${0})`;
    }).style('font-size', 12)
      .attr('dy', '.85em')
      .text((d) => { // 左侧图字体大小
        return trendData.termToLabel[d.t];
      });
  };

  // 绘制技术趋势图，data对应1个term，趋势由data.year.d的大小反映
  renderTermTrend = (data) => {
    const that = this;
    if (typeof (data) === 'undefined') {
      return;
    }
    // let i;
    if (termTrendStreamGraph) {
      termTrendStreamGraph.remove();
    }
    termTrendStreamGraph = chart.append('g')
      .attr('transform', () => {
        return `translate(${[0, 500]})rotate(${0})`; // 需调整参数，人图的left和top，宽度的起始和旋转,从-300改到了0
      });
    // 技术趋势图（右下方）的两条包络线,做了减小梯度的处理
    d3.select('.strong').remove();
    d3.select(`#term-${data.t.replace(/\s+/g, '')}`).append('rect').attr('class', 'strong').attr('x', '0px')
      .attr('y', () => {
        return -1.8125;
      })
      .attr('width', '300px')
      .attr('height', () => {
        return 19.8125;
      })
      .style('fill', '#9900FF')
      .style('fill-opacity', 0.2);
    basis = d3.svg.area()
      .x((d, i) => {
        return carr[i];
      })
      .x0((d, i) => {
        return carr[i];
      })
      .y0((d) => { //为了对称做出下面的处理
        return 200 - (200 * d.normFreq);
      })
      .y1((d) => {
        return 200 + (200 * d.normFreq);
      })
      .interpolate('basis');
    termTrendStreamGraph.append('path').attr('d', () => {
      carr = [];
      let termMaxFreq = 0;
      data.year.forEach((d) => {
        // d.d = d.d;
        carr.push(yearToXOffset(d.y));
        if (d.d > termMaxFreq) {
          termMaxFreq = d.d;
        }
      });
      carr = carr.sort((a, b) => {
        return a - b;
      });
      data.year.forEach((d) => {
        d.normFreq = d.d / termMaxFreq;
      });
      return basis(data.year);
    }).style('stroke-width', 0.2).style('stroke', '#60afe9')
      .style('fill', '#60afe9');
    const channels = [];
    // channel是趋势图显示结点信息的航道，由中间基线依次向两边扩展，即中间为0号航道，上方为1、3、5…号航道，下方为2、4、6…号航道
    // 若当前航道在坐标轴上四年内未被使用，则该航道空闲，将结点信息在此处显示
    for (let i = 0; i < 40; i += 1) {
      channels[i] = [];
    }

    const onMouseOverEventNode = (d) => {
      this.setState({ person: null, paper: null });
      document.getElementById('tooltip1').style = 'display:block';
      const xPosition = d3.event.layerX + 220;
      const yPosition = d3.event.layerY - 70;
      d3.select('#tooltip1').style('left', `${xPosition}px`).style('top', `${yPosition}px`)
        .select('#value1')
        .text(() => {
          const resultPromise = getPerson(idToAuthor[d.a].id);
          const rp = searchPubById(d.p);
          resultPromise.then((data1) => {
              cperson = data1.data;
              that.setState({ person: cperson });
            },
            () => {
              console.log('failed');
            },
          ).catch((error) => {
            console.error(error);
          });
          rp.then((data2) => {
            cpaper = data2.data;
            that.setState({ paper: cpaper });
          });
          return '';
        });
      d3.select('#tooltip1').classed('hidden', false).style('visibility', '');
    };

    const onMouseOutEventNode = () => {
    };

    const onClickEventNode = () => {
      console.log('event clicked!');
    };

    const termTrendEventNodes = termTrendStreamGraph.append('g')
      .selectAll('.people')
      .data(data.first.sort((a, b) => {
        return a.y - b.y;
      }))
      .enter()
      .append('g')
      .attr('class', 'people')
      .style('cursor', 'pointer')
      .on('mouseenter', onMouseOverEventNode)
      .on('mouseout', onMouseOutEventNode)
      .on('click', onClickEventNode)
      .attr('transform', (d) => {
        let i = 0;
        // i表示信道序号，若4年长度内信道空闲，则可用该位置显示节点，并push进channel
        while (i < 40) {
          let flag = true;
          if (channels[i].length > 0) {
            if (d.y - d3.max(channels[i]) < 4) {
              i += 1;
              flag = false;
            }
          }
          if (flag) {
            channels[i].push(d.y);
            break;
          }
        }
        if (i % 2 === 0) { //将人错开，人的点
          return `translate(${[yearToXOffset(d.y), 200 - ((i / 2) * 12)]})rotate(${0})`;
        } else {
          return `translate(${[yearToXOffset(d.y), 200 + (((i + 1) / 2) * 12)]})rotate(${0})`;
        }
      });

    termTrendEventNodes.append('text').attr('text-anchor', 'end').style('font-size', 10).attr('dy', '.85em')
      .attr('transform', () => {
        return `translate(${[-5, -5]})rotate(${0})`;
      })
      .text((d) => {
        return idToAuthor[d.a].name;
      });

    termTrendEventNodes.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5)
      .style('stroke-width', 1)
      .style('stroke', () => {
        return '#eee';
      })
      .style('opacity', 0.8)
      .style('fill', () => {
        return 'orangered';
      });
  };

  renderAxis = () => {
    timeSlidesDict = {};
    timeSlidesOffset = {};
    trendData.timeSlides.forEach((time, i) => {
      time.sort();
      time.forEach((year, j) => {
        timeSlidesDict[year] = i;
        timeSlidesOffset[year] = j;
      });
    });
    timeWindow = trendData.timeSlides[0].length;
    axis = chart.append('g').selectAll('.axis').data(trendData.timeSlides).enter()
      .append('g')
      .attr('class', 'axis')
      .attr('transform', (d, i) => {
        return `translate(${((i * width) / trendData.timeSlides.length)},${0})`;// 需调整参数，点离左边空白处
      });

    axisWidth = width / trendData.timeSlides.length;
    // 年代坐标轴，x1、y1为起点坐标，x2、y2为终点坐标
    axis.append('line').attr('x1', () => {
        return axisWidth;
      })
      .attr('x2', () => {
        return axisWidth;
      })
      .attr('y1', () => {
        return 0;
      })
      .attr('y2', () => {
        return 1000;// 需调整参数，直线坐标，决定树立直线长短
      })
      .style('stroke', () => {
        return 'lightgray';
      })
      .style('stroke-width', () => {
        return 1;
      });

    axis.append('text').attr('x', axisWidth - 6).attr('y', 10).attr('dy', '.0em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text((d) => {
        return d3.max(d);
      })
      .attr('text-anchor', 'end')
      .style('font-weight', 'bold');
  };

  renderTrend = (q, start, end) => {
    chart.append('linearGradient').attr('id');
    chart.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', 400)
      .attr('y2', 400)
      .attr('display', 'none')
      .attr('id', 'cutline')
      .style('stroke', 'darkgray')
      .style('stroke-width', 1);// 上下图之间的线的设置
    const svg = chart.append('g').attr('height', 700).attr('id', 'trend').attr('z-index', 2);
    svg.append('line').attr('id', 'nvMouse').attr('class', 'hidden').style('stroke', 'red')
      .style('stroke-width', 15);
    const sankey = d3.sankey()
      .nodeWidth(0)
      .nodePadding(8)
      .size([width, 450]);// 上方趋势图的宽度
    const path = sankey.link();
    // 界面中的技术发展图（右上方）和趋势图（右下方）
    const nodes = [];
    const links = [];
    const nodeToIndex = {};
    const termToIndex = {};
    const selectedTerms = {};
    const addedTerms = {};
    let cnt = 0;
    const topTerms = Object.keys(trendData.termFreq)
      .sort((a, b) => trendData.termFreq[b] - trendData.termFreq[a]);
    for (const key of topTerms) {
      termToIndex[key] = cnt;
      selectedTerms[key] = true;
      cnt += 1;
      if (cnt > 12) {
        break;
      }
    }
    const slideToYear = {};
    for (const y in trendData.yearToSlide) {
      const slide = trendData.yearToSlide[y];
      if (slideToYear[slide]) {
        slideToYear[slide].push(y);
      } else {
        slideToYear[slide] = [y];
      }
    }
    for (let i = 0; i < trendData.termFreqBySlide.length; i += 1) {
      let pubCount = 5;
      for (const y of slideToYear[i]) {
        pubCount += trendData.pubCount[y];
      }
      for (const key of Object.keys(selectedTerms)) {
        const termFreq = trendData.termFreqBySlide[i][key];
        if (addedTerms[key] || termFreq) {
          let freq = (termFreq || 0.5) / slideToYear[i].length;
          const preNode = nodes[nodeToIndex[`${key}-${i - 1}`]];
          if (preNode !== undefined) {
            freq = (freq + (0.1 * preNode.w)) / 1.1;
          }
          const n = {
            name: trendData.termToLabel[key],
            term: key,
            w: freq, // ** (2 / 3), //Math.sqrt(freq),
            pos: i, //yearToXOffset(year),
          };
          if (!addedTerms[key]) {
            n.first = true;
            addedTerms[key] = true;
          }
          nodeToIndex[`${key}-${i}`] = nodes.length;
          nodes.push(n);
          if (i > 0 && preNode !== undefined) {
            links.push({
              source: nodeToIndex[`${key}-${i - 1}`],
              target: nodeToIndex[`${key}-${i}`],
              w1: preNode.w,
              w2: n.w,
            });
          }
        }
      }
    }

    console.log(trendData);
    // 技术发展图（右上方），用的sankey画图框架
    sankey.nodes(nodes).links(links)
      .nodeOffset(width / trendData.timeSlides.length)
      .layout(100);
    link = svg.append('g')
      .selectAll('.link')
      .data(links).enter()
      .append('path')
      .attr('class', (d) => {
        return `link ${d.source_index}-${d.target_index}`;
      })
      .attr('transform', `translate(${axisWidth},${0})`)
      .attr('d', path)
      .style('stroke-width', () => {
        return 20;
      })
      .style('fill-opacity', 0.6)
      .style('fill', (d) => {
        const key = `gradient-${d.source_index}-${d.target_index}`;
        // offset表示link中颜色渐变，0%为起始结点颜色，100%为终止节点颜色，cluster类别为0-4，每个类别对应不同颜色
        svg.append('linearGradient').attr('id', key).attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', d.source.x + 50)
          .attr('y1', 0)
          .attr('x2', d.target.x)
          .attr('y2', 0)
          .selectAll('stop')
          .data([
            {
              offset: '0%',
              color: color(d.source.term),
            }, {
              offset: '100%',
              color: color(d.target.term),
            },
          ])
          .enter()
          .append('stop')
          .attr('offset', (k) => {
            return k.offset;
          })
          .attr('stop-color', (k) => {
            return k.color;
          });
        d.color = `url(#${key})`;
        return d.color;
      })
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.6);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(250).attr('opacity', () => {
          return 1;
        });
      });
    link.append('title').text((d) => {
      return `${d.source.name} → ${d.target.name}`;//`${d.source.name} → ${d.target.name}${d.source_index}`箭头
    });

    node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node');
    node.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('height', d => d.dy)
      .attr('width', d => d.dx)
      .attr('fill', d => color(d.term))
      .attr('stroke', '#000');
    node.append('text')
      .attr('x', d => d.x + 125)
      .attr('y', d => d.y + (d.dy / 2))
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle')
      .attr('transform', null)
      .text((d) => {
        if (d.first) {
          return d.name;
        }
      })
      .style('fill', (d) => {
        return color(d.term);
      })
      .style('font-weight', 'bold')
      .style('font', (d) => {
        // 结点信息大小，按权重分类
        let w;
        w = d.w;
        if (w > 15) {
          w = 15;
        } else if (w < 10 && w > 0) {
          w = 12;
        } else {
          w = 10;
        }
        return `${w}px sans-serif`;
      });
  };

  cancelSelected = (id) => {
    document.getElementById(id).style = 'display:none';
  };

  render() {
    let i = 0;
    let url = '';
    let name = '';
    let pos = '';
    let aff = '';
    let personLinkParams = '';
    let paperLinkParams = '';
    const thepaper = this.state.paper;
    let quote = '';
    if (typeof (thepaper) !== 'undefined' && thepaper !== null) {
      paperLinkParams = { href: sysconfig.PaperLink(thepaper.id) };
      if (sysconfig.PersonList_PersonLink_NewTab) {
        paperLinkParams.target = '_blank';
      }
      let authors = '';
      for (const a of thepaper.authors) {
        authors += `${a.name},`;
      }
      authors = `${authors.substring(0, authors.length - 1)}.`
      quote = `   ${authors}${thepaper.title}(${thepaper.year})`;
    }
    if (this.state.person != null) {
      const person = this.state.person;
      url = profileUtils.getAvatar(person.avatar, person.id, 50);
      name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      pos = profileUtils.displayPosition(person.pos);
      aff = profileUtils.displayAff(person);
      personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
      if (sysconfig.PersonList_PersonLink_NewTab) {
        personLinkParams.target = '_blank';
      }
    }
    const that = this;
    const query = this.props.query;
    let showFlag = 'none';
    let showFlag1 = 'none';
    if (this.state.loadingFlag) {
      showFlag = 'inline';
      showFlag1 = 'none';
    } else {
      showFlag = 'none';
      showFlag1 = 'inline';
    }
    return (
      <div className={styles.trend}>
        <Spinner loading={this.state.loadingFlag} />
        <div className={styles.keywords}>
          <div className={styles.inner}>
            {
              HOT_TERMS.map((hw) => {
                i += 1;
                return (
                  <div key={i}>
                    <a role="presentation" key={i} onClick={that.onKeywordClick.bind(that, hw)}>{hw}</a>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className={styles.loading1}>
          <div className={styles.loading} id="loading" style={{ display: showFlag, textAlign: 'center' }}>
            {query}趋势正在生成中！
          </div>
        </div>
        <div id="showchart" style={{ display: showFlag1 }}>
          <div className={styles.show} id="chart">
            <div className="modal-loading" />
          </div>
          <div id="tooltip" className={styles.tool}>
            <p className={styles.showtool}>
              <strong id="value" />
            </p>
          </div>
          <div id="tooltip1" className={styles.tool1}>
            <div role="presentation" className={styles.delCurrentNode}
                 onClick={this.cancelSelected.bind(that, 'tooltip1')}>
              <i className="fa fa-ban" aria-hidden="true" />
            </div>
            <div className={styles.showtool1}>
              {name &&
              <div className="name bg">
                <h2 className="section_header">
                  <span className={styles.detail}><a {...personLinkParams}>{name} </a></span><br />
                </h2>
              </div>
              }
              <div className="img"><img src={url} alt={url} /></div>
              <div className="info">
                {pos && <span className={styles.detail}><i className="fa fa-briefcase fa-fw" />{pos}</span>}
                <br />
                {aff && <span className={styles.detail}><i className="fa fa-institution fa-fw" />{aff}</span>}
              </div>
              <strong id="value1" />
              <div>{thepaper && <span className={styles.detail}><i className="fa fa-file-pdf-o" /><a {...paperLinkParams}>{quote}</a></span>}</div>
            </div>
          </div>
          <div className={styles.nav}>
            <Tabs defaultActiveKey="1" type="card" onTabClick={this.onChange} className={styles.tabs}>
              <TabPane tab={<span>近期热度</span>} key="1" id="recent-trend" />
              <TabPane tab={<span>全局热度</span>} key="2" id="overall-trend" />
              <TabPane tab={<span>技术源头</span>} key="3" id="origin-trend" />
            </Tabs>
            <div id="hist-chart" className={styles.rightbox}/>
          </div>
        </div>
      </div>
    );
  }
}

