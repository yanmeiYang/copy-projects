import React from 'react';
import { Tabs, Slider } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import d3 from '../../../public/lib/d3.v3';
import d3sankey from './utils/sankey';
import styles from './trend-prediction.less';
import { Auth } from '../../hoc';
import { externalRequest, wget } from '../../utils/request';
import * as profileUtils from '../../utils/profile-utils';
import { getPerson } from '../../services/person';
import { sysconfig } from '../../systems';

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
let people;
let terms;
let timeSlidesDict;
let timeSlidesOffset;
let timeWindow;
let axisWidth;
let cperson;
let carr = [];

const yearToXOffset = (year) => {
  return ((timeSlidesDict[year] + ((1 / timeWindow) * timeSlidesOffset[year])) * (width / trendData.timeSlides.length));
};

const TabPane = Tabs.TabPane;

const HOT_TERMS = ['Answer Machine', 'Artificial Intelligence', 'Autopilot', 'BlockChain', 'Computer Vision', 'Data Mining', 'Data Modeling', 'Deep Learning', 'Graph Databases', 'Internet of Things', 'Machine Learning', 'Robotics', 'Networks', 'NLP', 'Neural Network'];
/**
 * Component
 * @param id
 */
@connect(({ app }) => ({ app }))
@Auth
export default class TrendPrediction extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    person: cperson,
  };

  componentDidMount() {
    d3sankey();
    this.updateTrend(this.props.query);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      d3sankey();
      this.updateTrend(nextProps.query);
      return true;
    }
    return true;
  }

  onChange = (key) => {
    if (key === '1') { //全局的时候按照词频排序
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', true);
      d3.selectAll('.term').remove();
      trendData.terms.sort((a, b) => {
        return b.sum - a.sum;
      });
      if (trendData.terms[0].t.toLowerCase() === this.props.query) {
        trendData.terms = trendData.terms.slice(1, trendData.terms.length);//减去词频最高的词语
      }
      this.renderHist();
      this.renderTermTrend(trendData.terms[0]);
    } else {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', 'true');
      d3.selectAll('.term').remove();
      trendData.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      if (trendData.terms[0].t.toLowerCase() === this.props.query) {
        trendData.terms = trendData.terms.slice(1, trendData.terms.length);//减去词频最高的词语
      }
      const hist = histChart.append('g').selectAll('.term').data(trendData.terms).enter()
        .append('g')
        .attr('class', 'term')
        .attr('id', (d) => {
          return `term-${d.idx}`;//词语
        })
        .attr('transform', (d, i) => {
          return `translate(${[0, (i * histItemHeight) + 10]})rotate(${0})`;//顶到最前面，不用加20，改为0
        })
        .on('click', (d) => {
          this.renderTermTrend(d);
        });
      // 页面左侧统计模块的直方图
      hist.append('rect')
        .attr('x', () => {
          return histPosition + 10;
        })
        .attr('y', () => {
          return 0;
        })
        .attr('height', 18)
        .attr('width', (d) => {
          return (histHeight * d.freq) / maxFreq;
        })
        .style('fill-opacity', 0.7)
        .style('fill', '#60aFe9')
        .append('svg:title')
        .text((d) => {
          return d.freq;
        });

      hist.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', () => {
          return `translate(${[histPosition, 0]})rotate(${0})`;
        })
        .style('font-size', 12)
        .attr('dy', '0.85em')
        .text((d) => {
          return trendData.termToLabel[d.t];
        });
      this.renderTermTrend(trendData.terms[0]);
    }
  };

  onKeywordClick = (query) => {
    this.props.dispatch(routerRedux.push({ pathname: '/trend', search: `?query=${query}` }));
  };

  isHotTerm = (w) => {
    let flag = true;
    const w1 = w.toLowerCase().replace(/^\s+|\s+$/g, ' ').trim();
    for (const h in HOT_TERMS) {
      const word = HOT_TERMS[h].toLowerCase().replace(/^\s+|\s+$/g, ' ').trim();
      if (w1 === word) {
        flag = false;
        return HOT_TERMS[h];
      }
    }
    return flag;
  };

  initChart = (term) => {
    margin = {
      top: 1,
      right: 1,
      bottom: 6,
      left: 1,
    };
    width = 1300; // 需调整参数，容器宽度
    height = 1000 - margin.top - margin.bottom; // 需调整参数，容器高度，华为修改500，四个地方，另外三个为隐藏
    histWidth = 300;
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
        if ((tt.y > 2010) && (tt.d > 0)) {
          t.sum += tt.d;
        }
      });
      if (t.sum > maxSum) {
        maxSum = t.sum;
      }
      terms[t.t] = t;
    });
    people = {};
    trendData.authors.forEach((t) => {
      people[t.id] = t;
    });

    chart = d3.select('#chart')
      .append('svg')
      .attr('overflow', 'scroll')
      .attr('id', 'vis')
      .attr('width', width)
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

    const dd = wget(`http://166.111.7.173:5012/trend/${term}`);
    dd.then((data) => {
      trendData = humps.camelizeKeys(data, (key, convert) => {
        return key.includes(' ') && !key.includes('_') ? key : convert(key);
      });
      console.log(trendData);
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

    // maxFreq = 0;
    // trendData.terms.forEach((d) => {
    //   if (d.freq > maxFreq) {
    //     maxFreq = d.freq;
    //   }
    // });

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
        return `term-${d.idx}`;
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

    histGraph.append('text').attr('text-anchor', 'end').attr('transform', (d) => {
      return `translate(${[histPosition, 0]})rotate(${0})`;
    }).style('font-size', 12)
      .attr('dy', '.85em')
      .text((d) => { // 左侧图字体大小
        return trendData.termToLabel[d.t];
      });
    // first-three即页面中current hotspot按钮，点击后按照2010之后关于该技术的文献总数排序并显示直方图，
    // revert即页面中overall按钮，点击后按照freq对技术排序并显示直方图
    // 导航布局，first-three即页面中current hotspot按钮
    d3.select('#nav').style('display', '');
    d3.select('.active').classed('active', false);
    d3.select('#first-three').classed('active', 'true');

    d3.select('#first-three').on('click', function () {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', true);
      d3.selectAll('.term').remove();
      trendData.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      this.renderHist();
      this.renderTermTrend(terms[q]);
    });
    d3.select('#revert').on('click', () => {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', 'true');
      d3.selectAll('.term').remove();
      trendData.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      this.renderHist();
      this.renderTermTrend(terms[q]);
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
        return `translate(${[axisWidth, 500]})rotate(${0})`; // 需调整参数，人图的left和top，宽度的起始和旋转,从-300改到了0
      });
    // d3.select('.strong').remove();
    // 技术趋势图（右下方）的两条包络线,做了减小梯度的处理
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
    // d3.select(`#term-${data.idx}`).append('rect').attr('class', 'strong').attr('x', '0px')
    //   .attr('y', () => {
    //     return -1.8125;
    //   })
    //   .attr('width', '300px')
    //   .attr('height', () => {
    //     return 19.8125;
    //   })
    //   .style('fill', '#9900FF')
    //   .style('fill-opacity', 0.2);
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
      // for (const dataY in data.year) {
      //   carr.push(x(data.year[dataY].y));
      // }
      carr = carr.sort((a, b) => {
        return a - b;
      });
      data.year.forEach((d) => {
        d.normFreq = d.d / termMaxFreq;
      });
      return basis(data.year);
    }).style('stroke-width', 0.2).style('stroke', '#60afe9')
      .style('fill', '#60afe9');
    // 为趋势图的专家结点建立力学结构模型
    // termTrendEventNodes = d3.layout.force().linkDistance(80).charge(-1000).gravity(0.05)
    //   .size([]);
    const channels = [];
    // channel是趋势图显示结点信息的航道，由中间基线依次向两边扩展，即中间为0号航道，上方为1、3、5…号航道，下方为2、4、6…号航道
    // 若当前航道在坐标轴上四年内未被使用，则该航道空闲，将结点信息在此处显示
    for (let i = 0; i < 40; i += 1) {
      channels[i] = [];
    }

    const onMouseOverEventNode = (d) => {
      // d3.select(this).attr('opacity', 0.3);
      // const xPosition = d3.event.layerX + 150;
      // const yPosition = d3.event.layerY + 130;
      // d3.select('#tooltip1').style('left', `${xPosition}px`).style('top', `${yPosition}px`)
      //   .select('#value1')
      //   .text(() => {
      //     const resultPromise = getPerson(people[d.p].id);
      //     resultPromise.then((data) => {
      //         cperson = data.data;
      //         that.setState({ person: cperson });
      //       },
      //       () => {
      //         console.log('failed');
      //       },
      //     ).catch((error) => {
      //       console.error(error);
      //     });
      //     return '';
      //   });
      // d3.select('#tooltip1').classed('hidden', false).style('visibility', '');
    };

    const onMouseOutEventNode = () => {
      d3.select(this).transition().duration(400).attr('opacity', () => {
        return 1;
      });
      d3.select('#tooltip1').classed('hidden', true).style('visibility', 'hidden');
    };

    const onClickEventNode = () => {
      console.log("event clicked!");
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
      .on('mouseover', onMouseOverEventNode)
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
        return people[d.p].name;
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
    const svg = chart.append('g').attr('height', 650).attr('id', 'trend').attr('z-index', 2);
    svg.append('line').attr('id', 'nvMouse').attr('class', 'hidden').style('stroke', 'red')
      .style('stroke-width', 15);
    const sankey = d3.sankey()
      .nodeWidth(0)
      .nodePadding(8)
      .size([width, 430]);// 上方趋势图的宽度
    const path = sankey.link();
    // 界面中的技术发展图（右上方）和趋势图（右下方）
    const nodes = [];
    const links = [];
    const nodeToIndex = {};
    const termToIndex = {};
    const terms = {};
    let cnt = 0;
    const topTerms = Object.keys(trendData.termFreq)
      .sort((a, b) => trendData.termFreq[b] - trendData.termFreq[a]);
    for (const key of topTerms) {
      termToIndex[key] = cnt;
      cnt += 1;
      if (cnt > 12) {
        break;
      }
    }
    trendData.termFreqBySlide.forEach((termFreq, idx) => {
      for (const key of Object.keys(termToIndex)) {
        if (termFreq[key] || terms[key]) {
          const freq = termFreq[key] || 0.1;
          const n = {
            name: trendData.termToLabel[key],
            term: key,
            w: freq ** (2 / 3), //Math.sqrt(freq),
            pos: idx,
          };
          if (!terms[key]) {
            n.first = true;
            terms[key] = true;
          }
          nodeToIndex[`${key}-${idx}`] = nodes.length;
          nodes.push(n);
          if (idx > 0 && nodeToIndex[`${key}-${idx - 1}`] !== undefined) {
            links.push({
              source: nodeToIndex[`${key}-${idx - 1}`],
              target: nodeToIndex[`${key}-${idx}`],
              w1: nodes[nodeToIndex[`${key}-${idx}`]].w,
              w2: n.w,
            });
          }
        }
      }
    });
    console.log(nodes);
    console.log(links);
    // console.log(trendData);
    // trendData.terms.forEach((term) => {
    //   let prevNode = null;
    //   term.year.forEach((node) => {
    //     if (node.d > 0) {
    //       node.t = term.t;
    //       nodes.push(node);
    //       if (prevNode !== null) {
    //         links.push({
    //           source: prevNode,
    //           target: node,
    //         });
    //       }
    //       prevNode = node;
    //     }
    //   });
    // });
    // console.log(nodes);
    // console.log(links);

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
    // .on('click', () => {
    // });
    link.append('title').text((d) => {
      return `${d.source.name} → ${d.target.name}`;//`${d.source.name} → ${d.target.name}${d.source_index}`箭头
    });
    // 为sankey图的结点建立力学结构模型，实现用户交互效果
    // force = d3.layout.force();
    // force.nodes(trendData.nodes).gravity(0.1).charge((d) => {
    //   if (d.dy < 10) {
    //     return -((d.dy * 10) + 10);
    //   } else {
    //     return -((d.dy * 4) + 10);
    //   }
    // }).size([width, 330])
    //   .start();

    // const layout = (nds) => {
    //   const nodesByYear = {};
    //   nds.forEach((n) => {
    //     if (nodesByYear[n.year]) {
    //
    //     }
    //   })
    // }

    node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      // .append('a')
      // .attr('href', '#')
      // .attr('class', 'popup')
      // .attr('rel', 'popuprel')
      .append('g')
      .attr('class', 'node');

    //   .call(force.drag)
    //   .on('mouseover', function (d) {
    //     d3.select(this).attr('opacity', 0.6);
    //     const xPosition = d3.event.layerX + 150;
    //     const yPosition = d3.event.layerY + 130;
    //     // if (xPosition > 900) {
    //     //     xPosition = d3.event.layerX - 200;
    //     // }
    //     d3.select('#tooltip').style('left', `${xPosition}px`).style('top', `${yPosition}px`)
    //       .select('#value')
    //       .text(() => {
    //         return `${d.name}：  ${format(d.value)} ${d.y}`;
    //       });
    //     //d3.select('#tooltip').classed('hidden', false).style('visibility', ''); 不显示次数
    //   })
    //   .on('mouseout', function () {
    //     d3.select(this).transition().duration(400).attr('opacity', () => {
    //       return 1;
    //     });
    //     d3.select('#tooltip').classed('hidden', true).style('visibility', 'hidden');
    //   })
    //   .on('click', (d) => {
    //     console.log(d);
    //   });

    // node.append('a').attr('class', 'border-fade').append('rect').attr('height', (d) => {
    //   return d.dy;
    // })
    //   .attr('width', sankey.nodeWidth())
    //   .style('fill', (d) => {
    //     d.color = color(d.cluster);
    //     return d.color;
    //   })
    //   .style('stroke', (d) => {
    //     return d.color;
    //   })
    //   .style('stroke-width', () => {
    //     return 0;
    //   })
    //   .style('opacity', () => {
    //     return 0.6;
    //   });
    // node.append('circle').attr('cy', (d) => {
    //   return (d.dy / 2) + 5;
    // }).attr('r', 5).attr('stroke', 'black')
    //   .attr('stroke-width', 1)
    //   .attr('fill', 'red');
    node.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('height', d => d.dy)
      .attr('width', d => d.dx)
      .attr('fill', d => color(d.term))
      .attr('stroke', '#000');

    node.append('text')
    // .attr('x', -20)
    // .attr('y', (d) => {
    //   return d.dy / 2;
    // })
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

    // trendData.terms.sort((a, b) => {
    //   return b.start.year - a.start.year;
    // });
    // force.on('tick', () => {
    //   node.attr('transform', (d) => {
    //     d.x = d.pos * (width / trendData.timeSlides.length);
    //     return `translate(${d.x + 50},${d.y})`;// 需调整参数，趋势图离左边、和上面的距离
    //   });
    //   // sankey.relayout();
    //   link.attr('d', path);
    // });
    // item对应每条技术，根据start数据确定位置偏移
    // item = svg.append('g').selectAll('.item').data(trendData.terms).enter()
    //   .append('g')
    //   .attr('class', 'item')
    //   .attr('transform', (d) => {
    //     return `translate(${x(d.start.year)},${d.start.node.y + (d.start.node.dy / 2)})`;
    //   });
    // item.append('circle').attr('cx', () => {
    //   return 0;
    // }).attr('cy', () => {
    //   return 0;
    // }).attr('r', (d) => {
    //   return d.freq / 10;
    // })
    //   .style('stroke-width', 1)
    //   .style('stroke', (d) => {
    //     return color(d.start.cluster);
    //   })
    //   .style('stroke-opacity', 0.5)
    //   .style('fill', (d) => {
    //     return color(d.start.cluster);
    //   })
    //   .style('display', 'none');
  };

  render() {
    let i = 0;
    let url = '';
    let name = '';
    let pos = '';
    let aff = '';
    let personLinkParams = '';
    if (this.state.person != null) {
      const person = this.state.person;
      url = profileUtils.getAvatar(person.avatar, person.id, 80);
      name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      pos = profileUtils.displayPosition(person.pos);
      aff = profileUtils.displayAff(person);
      personLinkParams = {href: sysconfig.PersonList_PersonLink(person.id)};
      if (sysconfig.PersonList_PersonLink_NewTab) {
        personLinkParams.target = '_blank';
      }
    }
    const that = this;
    return (
      <div className={styles.trend}>
        {/*<div className={styles.year}>*/}
          {/*<Slider marks={marks} step={10} range defaultValue={[20, 50]} disabled={false}/>*/}
        {/*</div>*/}
        <div className={styles.keywords}>
          <div className={styles.inner}>
            {
              HOT_TERMS.map((hw) => {
                i++;
                return (
                  <div key={i}>
                    <a key={i} onClick={that.onKeywordClick.bind(that, hw)}>{hw}</a>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className={styles.show} id="chart">
          <div className="modal-loading"/>
        </div>
        <div id="tooltip" className={styles.tool}>
          <p className={styles.showtool}>
            <strong id="value"/>
          </p>
        </div>
        <div id="tooltip1" className={styles.tool1}>
          <div className={styles.showtool1}>
            <div className="img"><img src={url} alt={url}/></div>
            {name &&
            <div className="name bg">
              <h2 className="section_header">
                <a {...personLinkParams}>{name} </a><br />
              </h2>
            </div>
            }
            <div className="info bg">
              {pos && <span><i className="fa fa-briefcase fa-fw"/>{pos}</span>}
              <br />
              {aff && <span><i className="fa fa-institution fa-fw"/>{aff}</span>}
            </div>
            <strong id="value1"/>
          </div>
        </div>
        <div className={styles.nav}>
          {/*<Tabs defaultActiveKey="1" type="card" onTabClick={this.onChange} className={styles.tabs}>*/}
          {/*<TabPane tab={<span>Recent</span>} key="1" id="first-three"/>*/}
          {/*<TabPane tab={<span>All</span>} key="2" id="revert"/>*/}
          {/*</Tabs>*/}
          <div id="hist-chart" className={styles.rightbox}/>
        </div>
      </div>
    );
  }
}

