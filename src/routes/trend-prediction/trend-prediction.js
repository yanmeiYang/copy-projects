import React from 'react';
import { Tabs, Icon, Slider, Button } from 'antd';
import { connect } from 'dva';
import d3 from '../../../public/lib/d3.v3';
import d3sankey from './utils/sankey';
import styles from './trend-prediction.less';
import { Auth } from '../../hoc';
import { externalRequest, wget } from '../../utils/request';
import * as profileUtils from '../../utils/profile-utils';
import { getPerson } from '../../services/person';
import { sysconfig } from '../../systems';

let barPos;
let chart;
let color;
let format;
let formatNumber;
let height;
let histHeight;
let margin;
//let renderTopic;
let timeline;
let timelineItemOffset;
let width;
let energy;
let axis;
let basis;
let drawFlow;
let drawRightBox;
let flow;
let force;
let item;
let link;
let maxFreq;
let maxSum;
let node;
let people;
let terms;
let timeSlidesDict;
let timeSlidesOffset;
let timeWindow;
let x;
let query;
let cperson;
const TabPane = Tabs.TabPane;
const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100°C</strong>,
  },
};
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
    this.showtrend('');
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      d3sankey();
      this.showtrend(nextProps.query);
      return true;
    }
    return true;
  }

  onChange = (key) => {
    if (key === '1') {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', true);
      d3.selectAll('.term').remove();
      energy.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      drawRightBox();
      const q = query;
      drawFlow(terms[q]);
    } else {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', 'true');
      d3.selectAll('.term').remove();
      energy.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      const hist = timeline.append('g').selectAll('.term').data(energy.terms).enter()
        .append('g')
        .attr('class', 'term')
        .attr('id', (d) => {
        return `term-${d.idx}`;
      })
        .attr('transform', (d, i) => {
        return `translate(${[0, (i * timelineItemOffset) + 20]})rotate(${0})`;
      })
        .on('click', (d) => {
        drawFlow(d);
      });
      // 页面左侧统计模块的直方图
      hist.append('rect').attr('x', () => {
        return barPos + 10;
      }).attr('y', () => {
        return 0;
      }).attr('height', 18)
        .attr('width', (d) => {
        return (histHeight * d.freq) / maxFreq;
      })
        .style('fill-opacity', 0.7)
        .style('fill', '#60aFe9')
        .append('svg:title')
        .text((d) => {
          return d.sum;
        });
      hist.append('text').attr('text-anchor', 'end').attr('transform', () => {
        return `translate(${[barPos, 0]})rotate(${0})`;
      }).style('font-size', 12)
        .attr('dy', '.85em')
        .text((d) => {
          return d.t;
        });
      const q = query;
      drawFlow(terms[q]);
    }
  }

  showtrend = (cquery) => {
    d3.select('#tooltip').classed('hidden', true).style('visibility', 'hidden');//最开始的时候都将它们设置为不可见
    d3.select('#tooltip1').classed('hidden', true).style('visibility', 'hidden');
    const loc = window.location.href.split('query=');
    let word = '';
    if (loc != null) {
      if (loc[1] != null) {
        word = decodeURI(loc[1]);
      }
    }
    if (word === '' && cquery === '') {
      word = 'Data Mining';
    }
    if (word === '' && cquery !== '') {
      word = cquery;
    }
    if (word === 'Answer Machine' || word === 'Artificial Intelligence' || word === 'Autopilot' || word === 'BlockChain' || word === 'Computer Vision' || word === 'Data Mining' || word === 'Data Modeling' || word === 'Deep Learning' || word === 'Graph Databases' || word === 'Internet of Things' || word === 'Machine Learning' || word === 'Robotics' || word === 'Networks' || word === 'NLP' || word === 'Neural Network') {
      const res = wget('/lab/trend-prediction/' + word + '.json');
      res.then((data) => {
        energy = data;
        margin = {
          top: 1,
          right: 1,
          bottom: 6,
          left: 1,
        };
        width = 1300; // 需调整参数，容器宽度
        height = 900 - margin.top - margin.bottom; // 需调整参数，容器高度
        formatNumber = d3.format(',.0f');
        format = function (d) { // 格式化为整数，点出现的次数
          return `${formatNumber(d)} Times`;
        };
        color = d3.scale.category10();// d3图的配色样式
        chart = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
        barPos = 150;// 直方图左边文字的宽度
        timelineItemOffset = 20;// 左侧直方图的间隔距离
        histHeight = 100;// 左侧直方图的高度
        /*
        d3.select(window).on('resize', () => { // 窗口改变的时候重新加载
          return this.showtrend(this.props.query);
        });
        d3.select('#trend').on('click', () => { // trend被点击的时候重新加载
          return this.renderTopic('big data', 1, 1000);
        });*/
        // 显示整个界面的方法，sankey为技术发展图
        this.renderTopic('big data', 1, 1000);
      });
    } else {
      const res = externalRequest('http://166.111.7.173:9997/' + word);
      res.then((data) => {
        energy = data.data;
        margin = {
          top: 1,
          right: 1,
          bottom: 6,
          left: 1,
        };
        width = 1300; // 需调整参数，容器宽度
        height = 900 - margin.top - margin.bottom; // 需调整参数，容器高度
        formatNumber = d3.format(',.0f');
        format = function (d) { // 格式化为整数，点出现的次数
          return `${formatNumber(d)} Times`;
        };
        color = d3.scale.category10();// d3图的配色样式
        chart = d3.select('#chart').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
        barPos = 150;// 直方图左边文字的宽度
        timelineItemOffset = 20;// 左侧直方图的间隔距离
        histHeight = 100;// 左侧直方图的高度
        d3.select(window).on('resize', () => { // 窗口改变的时候重新加载
          return this.renderTopic('big data', 1, 1000);
        });
        d3.select('#trend').on('click', () => { // trend被点击的时候重新加载
          return this.renderTopic('big data', 1, 1000);
        });
        // 显示整个界面的方法，sankey为技术发展图
        this.renderTopic('big data', 1, 1000);
      });
    }
  }

  seeword = (e) => {
    const word = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    let href = window.location.href.split('?query=')[0] + '?query=' + word;
    href = href.replace('#', '');
    window.location.href = href;
  }

  renderTopic = function (q, start, end) {
    document.getElementById('chart').innerHTML = '';
    const that = this;
    query = q;
    const sankey = d3.sankey().nodeWidth(0).nodePadding(0).size([width, 330]);// 上方趋势图的宽度
    const path = sankey.link();
    // 界面中的技术发展图（右上方）和趋势图（右下方）
    chart.remove();
    chart = d3.select('#chart').append('svg').attr('overflow', 'scroll').attr('id', 'dark')
      .attr('width', width)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${70},${25})`)
      .attr('z-index', 1);
    chart.append('linearGradient').attr('id', 'xiangyu');
    d3.select('#wordid').remove();
    timeline = d3.select('#right-box').append('svg').attr('overflow', 'scroll').attr('z-index', 2).attr('id','wordid');
    const svg = chart.append('g').attr('height', 350).attr('id', 'trend').attr('z-index', 2);
    svg.on('mousewheel', () => {
      console.log('mousewheel');
    });
    svg.append('line').attr('id', 'nvMouse').attr('class', 'hidden').style('stroke', 'red')
      .style('stroke-width', 5);
    chart.append('line').attr('x1', 0).attr('x2', width).attr('y1', 360)
      .attr('y2', 360)
      .attr('id', 'cutline')
      .style('stroke', 'darkgray')
      .style('stroke-width', 1);// 上下图之间的线的设置
    // $("#chart").addClass("loading");
    // $("#chart").removeClass("loading");
    terms = {};
    maxSum = 0;
    // current hotsopt中按各技术2010年之后的文献总数排序
    energy.terms.forEach((t) => {
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
    energy.people.forEach((t) => {
      people[t.id] = t;
    });
    timeline.attr('height', () => {
      return 25 * energy.terms.length;
    });
    timeline.append('line').attr('x1', barPos + 10).attr('x2', barPos + 10).attr('y1', 0)
      .attr('y2', () => {
      return 25 * energy.terms.length;
    })
      .style('stroke', 'gray')
      .style('stroke-width', 0.5);
    maxFreq = 0;
    energy.terms.forEach((d) => {
      if (d.freq > maxFreq) {
        maxFreq = d.freq;
      }
    });
    // 导航布局，first-three即页面中current hotspot按钮
    d3.select('#nav').style('display', '');
    d3.select('.active').classed('active', false);
    d3.select('#first-three').classed('active', 'true');
    // 左侧的统计框
    drawRightBox = function () { // 右侧的
      energy.terms.sort((a, b) => {
        return b.sum - a.sum;
      });
      const hist = timeline.append('g').selectAll('.term').data(energy.terms).enter()
        .append('g')
        .attr('class', 'term')
        .attr('transform', (d, i) => {
        return `translate(${[0, (i * timelineItemOffset) + 20]})rotate(${0})`;// 左侧图离标签页的距离，字和直方图的旋转
      })
        .attr('id', (d) => {
        return `term-${d.idx}`;
      })
        .on('click', (d) => {
        drawFlow(d);
      });
      // 页面左侧统计模块的直方图
      hist.append('rect').attr('x', () => { // 直方图离线的距离
        return barPos + 10;
      }).attr('y', () => { // 直方图离上方的高度
        return 0;
      }).attr('height', 18)
        .attr('width', (d) => { // 直方图的宽度为18
        return (histHeight * d.sum) / maxSum;// 高度为计算得出
      })
        .style('fill-opacity', 0.7)
        .style('fill', '#60aFe9')
        .append('svg:title')
        .text((d) => {
        return d.sum;
      });
      hist.append('text').attr('text-anchor', 'end').attr('transform', (d) => {
        return `translate(${[barPos, 0]})rotate(${0})`;
      }).style('font-size', 12)
        .attr('dy', '.85em')
        .text((d) => { // 左侧图字体大小
        return d.t;
      });
    };
    drawRightBox();
    // first-three即页面中current hotspot按钮，点击后按照2010之后关于该技术的文献总数排序并显示直方图，
    // revert即页面中overall按钮，点击后按照freq对技术排序并显示直方图
    d3.select('#first-three').on('click', function () {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', true);
      d3.selectAll('.term').remove();
      energy.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      drawRightBox();
      drawFlow(terms[q]);
    });
    d3.select('#revert').on('click', () => {
      d3.select('.active').classed('active', false);
      d3.select(this.parentNode).classed('active', 'true');
      d3.selectAll('.term').remove();
      energy.terms.sort((a, b) => {
        return b.freq - a.freq;
      });
      const hist = timeline.append('g').selectAll('.term').data(energy.terms).enter()
        .append('g')
        .attr('class', 'term')
        .attr('id', (d) => {
        return `term-${d.idx}`;
      })
        .attr('transform', (d, i) => {
        return `translate(${[0, (i * timelineItemOffset) + 20]})rotate(${0})`;
      })
        .on('click', (d) => {
        drawFlow(d);
      });
      // 页面左侧统计模块的直方图
      hist.append('rect').attr('x', () => {
        return barPos + 10;
      }).attr('y', () => {
        return 0;
      }).attr('height', 18)
        .attr('width', (d) => {
        return (histHeight * d.freq) / maxFreq;
      })
        .style('fill-opacity', 0.7)
        .style('fill', '#60aFe9')
        .append('svg:title')
        .text((d) => {
        return d.sum;
      });
      hist.append('text').attr('text-anchor', 'end').attr('transform', (d) => {
        return `translate(${[barPos, 0]})rotate(${0})`;
      }).style('font-size', 12)
        .attr('dy', '.85em')
        .text((d) => {
        return d.t;
      });
      drawFlow(terms[q]);
    });
    timeSlidesDict = {};
    timeSlidesOffset = {};
    energy.time_slides.forEach((time, i) => {
      time.sort();
      time.forEach((year, j) => {
        timeSlidesDict[year] = i;
        timeSlidesOffset[year] = j;
      });
    });
    timeWindow = energy.time_slides[0].length;
    x = function (year) {
      return (timeSlidesDict[year] + ((1 / timeWindow) * timeSlidesOffset[year]))
        * (width / energy.time_slides.length);
    };
    axis = svg.append('g').selectAll('.axis').data(energy.time_slides).enter()
      .append('g')
      .attr('class', 'axis')
      .attr('transform', (d, i) => {
      return `translate(${50 + ((i * width) / energy.time_slides.length)},${0})`;// 需调整参数，点离左边空白处
    });
    // 年代坐标轴，x1、y1为起点坐标，x2、y2为终点坐标
    axis.append('line').attr('x1', () => {
      return 0;
    }).attr('x2', () => {
      return 0;
    }).attr('y1', () => {
      return 0;
    })
      .attr('y2', () => {
      return 800;// 需调整参数，直线坐标，决定直线长短
    })
      .style('stroke', () => {
      return 'lightgray';
    })
      .style('stroke-width', () => {
      return 1;
    });
    axis.append('text').attr('x', -6).attr('y', 10).attr('dy', '.0em')
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text((d) => {
      return d3.min(d);
    })
      .attr('x', 6)
      .attr('text-anchor', 'start')
      .style('font-weight', 'bold');
    // 技术发展图（右上方），用的sankey画图框架
    sankey.nodes(energy.nodes).links(energy.links).items(energy.terms)
      .nodeOffset(width / energy.time_slides.length)
      .layout(300);
    link = svg.append('g').selectAll('.link').data(energy.links).enter()
      .append('path')
      .attr('class', (d) => {
      return `link ${d.source_index}-${d.target_index}`;
    })
      .attr('transform', `translate(${100},${0})`)
      .attr('d', path)
      .style('stroke-width', () => {
      return 20;
    })
      .style('fill-opacity', 0.6)
      .style('fill', (d) => {
      const key = `gradient-${d.source_index}-${d.target_index}`;
      // offset表示link中颜色渐变，0%为起始结点颜色，100%为终止节点颜色，cluster类别为0-4，每个类别对应不同颜色
      svg.append('linearGradient').attr('id', key).attr('gradientUnits', 'userSpaceOnUse').attr('x1', d.source.x + 50)
        .attr('y1', 0)
        .attr('x2', d.target.x)
        .attr('y2', 0)
        .selectAll('stop')
        .data([
        {
          offset: '0%',
          color: color(d.source.cluster),
        }, {
          offset: '100%',
          color: color(d.target.cluster),
        },
      ])
        .enter()
        .append('stop')
        .attr('offset', (d) => {
        return d.offset;
      })
        .attr('stop-color', (d) => {
        return d.color;
      });
      d.color = `url(#${key})`;
      return d.color;
    })
      .sort((a, b) => {
      return b.dy - a.dy;
    })
      .on('mouseover', function () {
      d3.select(this).attr('opacity', 0.6);
    })
      .on('mouseout', function () {
      d3.select(this).transition().duration(250).attr('opacity', () => {
        return 1;
      });
    })
      .on('click', () => {
    });
    link.append('title').text((d) => {
      return `${d.source.name} → ${d.target.name}${d.source_index}`;
    });
    // 为sankey图的结点建立力学结构模型，实现用户交互效果
    force = d3.layout.force();
    force.nodes(energy.nodes).gravity(0.1).charge((d) => {
      if (d.dy < 10) {
        return -((d.dy * 10) + 10);
      } else {
        return -((d.dy * 4) + 10);
      }
    }).size([width, 330])
      .start();
    node = svg.append('g').selectAll('.node').data(energy.nodes).enter()
      .append('a')
      .attr('href', '#')
      .attr('class', 'popup')
      .attr('rel', 'popuprel')
      .append('g')
      .attr('class', 'node')
      .call(force.drag)
      .on('mouseover', function (d) {
      d3.select(this).attr('opacity', 0.6);
      const xPosition = d3.event.layerX + 150;
      const yPosition = d3.event.layerY + 130;
      // if (xPosition > 900) {
      //     xPosition = d3.event.layerX - 200;
      // }
      d3.select('#tooltip').style('left', `${xPosition}px`).style('top', `${yPosition}px`)
        .select('#value').text(() => {
        return `${d.name}：  ${format(d.value)} ${d.y}`;
      });
      d3.select('#tooltip').classed('hidden', false).style('visibility', '');
    }).on('mouseout', function () {
      d3.select(this).transition().duration(400).attr('opacity', () => {
        return 1;
      });
      d3.select('#tooltip').classed('hidden', true).style('visibility', 'hidden');
    })
      .on('click', (d) => {
        console.log(d);
    });
    node.append('a').attr('class', 'border-fade').append('rect').attr('height', (d) => {
      return d.dy;
    })
      .attr('width', sankey.nodeWidth())
      .style('fill', (d) => {
      return d.color = color(d.cluster);
    })
      .style('stroke', (d) => {
      return d.color;
    })
      .style('stroke-width', () => {
      return 0;
    })
      .style('opacity', () => {
      return 0.6;
    });
    node.append('circle').attr('cy', (d) => {
      return (d.dy / 2) + 5;
    }).attr('r', 5).attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'red');
    node.append('text').attr('x', -20).attr('y', (d) => {
      return d.dy / 2;
    }).attr('text-anchor', 'middle')
      .attr('transform', null)
      .text((d) => {
      return d.name;
    })
      .style('fill', () => {
      return 'black';
    })
      .style('font-weight', 'bold')
      .style('font', (d) => {
      // 结点信息大小，按权重分类
      let w;
      w = d.w;
      if (w > 15) {
        w = 15;
      } else if (w < 10 && w > 0) {
        w = 10;
      } else {
        w = 8;
      }
      return `${w}px sans-serif`;
    });
    energy.terms.sort((a, b) => {
      return b.start.year - a.start.year;
    });
    force.on('tick', () => {
      node.attr('transform', (d) => {
        d.x = d.pos * (width / energy.time_slides.length);
        return `translate(${d.x + 50},${d.y})`;// 需调整参数，人图离左边的距离
      });
      sankey.relayout();
      link.attr('d', path);
    });
    // item对应每条技术，根据start数据确定位置偏移
    item = svg.append('g').selectAll('.item').data(energy.terms).enter()
      .append('g')
      .attr('class', 'item')
      .attr('transform', (d) => {
      return `translate(${x(d.start.year)},${d.start.node.y + (d.start.node.dy / 2)})`;
    });
    item.append('circle').attr('cx', () => {
      return 0;
    }).attr('cy', () => {
      return 0;
    }).attr('r', (d) => {
      return d.freq / 10;
    })
      .style('stroke-width', 1)
      .style('stroke', (d) => {
      return color(d.start.cluster);
    })
      .style('stroke-opacity', 0.5)
      .style('fill', (d) => {
      return color(d.start.cluster);
    })
      .style('display', 'none');
    // 技术趋势图（右下方）的两条包络线,做了减小梯度的处理
    basis = d3.svg.area().x((d, i) => {
      return x(d.y);
    }).y0((d) => {
      if (d.d < 30) {
        return 200 - (d.d * 5);
      }
      return 50; // 200 - 30 / 21.35 * Math.pow(d.d, 0.9) * 5
    }).y1((d) => {
      if (d.d < 30) {
        return 200 + (d.d * 5);
      }
      return 350; // 200 + 30 / 21.35 * Math.pow(d.d, 0.9) * 5
    })
      .interpolate('basis');
    flow = chart.append('g').attr('transform', (d) => {
      return `translate(${[0, 350]})rotate(${0})`;
    });
    // 绘制技术趋势图，data对应1个term，趋势由data.year.d的大小反映
    drawFlow = function (data) {
      if (typeof (data) === 'undefined') {
        return;
      }
      let i;
      let peopleFlow;
      flow.remove();
      flow = chart.append('g').attr('transform', (d) => {
        return `translate(${[0, 350]})rotate(${0})`;// 需调整参数，人图的left和top，宽度的起始和旋转,从-300改到了0
      });
      d3.select('.strong').remove();
      d3.select(`#term-${data.idx}`).append('rect').attr('class', 'strong').attr('x', '0px')
        .attr('y', () => {
        return -1.8125;
      })
        .attr('width', '300px')
        .attr('height', () => {
        return 19.8125;
      })
        .style('fill', '#9900FF')
        .style('fill-opacity', 0.2);
      flow.append('path').attr('d', () => {
        data.year.forEach((d) => {
          d.d = d.d;
        });
        return basis(data.year);
      }).style('stroke-width', 0.2).style('stroke', '#60afe9')
        .style('fill', '#60afe9');
      // 为趋势图的专家结点建立力学结构模型
      peopleFlow = d3.layout.force().linkDistance(80).charge(-1000).gravity(0.05)
        .size([]);
      const channels = [];
      i = 0;
      // channel是趋势图显示结点信息的航道，由中间基线依次向两边扩展，即中间为0号航道，上方为1、3、5…号航道，下方为2、4、6…号航道
      // 若当前航道在坐标轴上四年内未被使用，则该航道空闲，将结点信息在此处显示
      while (i < 40) {
        channels[i] = [];
        i++;
      }
      peopleFlow = flow.append('g').selectAll('.people').data(data.first.sort((a, b) => {
        return a.y - b.y;
      })).enter()
        .append('g')
        .attr('class', 'people')
        .style('cursor', 'pointer')
        .on('mouseover', (d) => {
          d3.select(this).attr('opacity', 0.3);
          const xPosition = d3.event.layerX + 150;
          const yPosition = d3.event.layerY + 130;
          d3.select('#tooltip1').style('left', `${xPosition}px`).style('top', `${yPosition}px`)
            .select('#value1').text(() => {
            const resultPromise = getPerson(people[d.p].id);
            resultPromise.then((data) => {
                cperson = data.data;
                that.setState({ person: cperson });
              },
              () => {
                console.log('failed');
              },
            ).catch((error) => {
              console.error(error);
            })
            return ``;
          });
          d3.select('#tooltip1').classed('hidden', false).style('visibility', '');
      }).on('mouseout', function () {
          d3.select(this).transition().duration(400).attr('opacity', () => {
            return 1;
          });
          d3.select('#tooltip1').classed('hidden', true).style('visibility', 'hidden');
        })
        .on('click', function () {
          console.log("yes!");
        })
        .attr('transform', (d, i) => {
        i = 0;
        // i表示信道序号，若4年长度内信道空闲，则可用该位置显示节点，并push进channel
        while (i < 40) {
          if (channels[i].length > 0) {
            if (d.y - d3.max(channels[i]) < 4) {
              i++;
              continue;
            }
          }
          channels[i].push(d.y);
          break;
          i++;
        }
        if (i % 2 === 0) {
          return `translate(${[x(d.y), 200 - ((i / 2) * 12)]})rotate(${0})`;
        } else {
          return `translate(${[x(d.y), 200 + (((i + 1) / 2) * 12)]})rotate(${0})`;
        }
      });
      peopleFlow.append('text').attr('text-anchor', 'end').style('font-size', 10).attr('dy', '.85em')
        .attr('transform', () => {
        return `translate(${[-5, -5]})rotate(${0})`;
      })
        .text((d) => {
        return people[d.p].name;
      });
      peopleFlow.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5)
        .style('stroke-width', 1)
        .style('stroke', () => {
        return '#eee';
      })
        .style('opacity', 0.8)
        .style('fill', () => {
        return 'orangered';
      });
    };
    drawFlow(terms['all pair']);
  };

  render() {
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
      personLinkParams = { href: sysconfig.PersonList_PersonLink(person.id) };
      if (sysconfig.PersonList_PersonLink_NewTab) {
        personLinkParams.target = '_blank';
      }
    }
    return (
      <div className={styles.trend}>
        <div className={styles.year}>
          <Slider marks={marks} step={10} range defaultValue={[20, 50]} disabled={false} />
        </div>
        <div className={styles.hotwords}>
          <p>HOT WORDS</p>
          <Button.Group>
            <Button type="dashed" onClick={this.seeword} value="Answer Machine" className={styles.hotword}>Answer Machine</Button>
            <Button type="dashed" onClick={this.seeword} value="Artificial Intelligence" className={styles.hotword}>Artificial Intelligence</Button>
            <Button type="dashed" onClick={this.seeword} value="Autopilot" className={styles.hotword}>Autopilot</Button>
            <Button type="dashed" onClick={this.seeword} value="BlockChain" className={styles.hotword}>BlockChain</Button>
            <Button type="dashed" onClick={this.seeword} value="Computer Vision" className={styles.hotword}>Computer Vision</Button>
            <Button type="dashed" onClick={this.seeword} value="Data Mining" className={styles.hotword}>Data Mining</Button>
            <Button type="dashed" onClick={this.seeword} value="Data Modeling" className={styles.hotword}>Data Modeling</Button>
            <Button type="dashed" onClick={this.seeword} value="Deep Learning" className={styles.hotword}>Deep Learning</Button>
            <Button type="dashed" onClick={this.seeword} value="Graph Databases" className={styles.hotword}>Graph Databases</Button>
            <Button type="dashed" onClick={this.seeword} value="Internet of Things" className={styles.hotword}>Internet of Things</Button>
            <Button type="dashed" onClick={this.seeword} value="Machine Learning" className={styles.hotword}>Machine Learning</Button>
            <Button type="dashed" onClick={this.seeword} value="Robotics" className={styles.hotword}>Robotics</Button>
            <Button type="dashed" onClick={this.seeword} value="Networks" className={styles.hotword}>Networks</Button>
            <Button type="dashed" onClick={this.seeword} value="NLP" className={styles.hotword}>NLP</Button>
            <Button type="dashed" onClick={this.seeword} value="Neural Network" className={styles.hotword}>Neural Network</Button>
          </Button.Group>
        </div>
        <div className={styles.show} id="chart">
          <div className="modal-loading" />
        </div>
        <div id="tooltip" className={styles.tool}>
          <p className={styles.showtool}>
            <strong id="value" />
          </p>
        </div>
        <div id="tooltip1" className={styles.tool1}>
          <div className={styles.showtool1}>
            <div className="img"><img src={url}/></div>
            {name &&
            <div className="name bg">
              <h2 className="section_header">
                <a {...personLinkParams}>{name} </a><br />
              </h2>
            </div>
            }
            <div className="info bg">
              {pos && <span><i className="fa fa-briefcase fa-fw" />{pos}</span>}
              <br />
              {aff && <span><i className="fa fa-institution fa-fw" />{aff}</span>}
            </div>
            <strong id="value1" />
          </div>
        </div>
        <div className={styles.nav} id="right-box">
          <Tabs defaultActiveKey="1" type="card" onTabClick={this.onChange}>
            <TabPane tab={<span><Icon type="calendar" />All</span>} key="1" id="first-three" />
            <TabPane tab={<span><Icon type="global" />Recent</span>} key="2" id="revert" />
          </Tabs>
        </div>
      </div>
    );
  }
}

