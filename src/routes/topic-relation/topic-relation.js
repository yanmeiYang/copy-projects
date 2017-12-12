/* eslint-disable max-len */
/**
 * copied from relation-graph
 * created by LuoGan on 2017-11-25.
 */
import React from 'react';
import { connect } from 'dva';
import { Select, Progress, message, Button } from 'antd';
import { Auth } from 'hoc';
import { FormattedMessage as FM } from 'react-intl';
import { loadD3 } from "utils";
import { RgSearchTermBox } from 'components/topic-relation';
import { classnames } from 'utils/index';
import styles from './topic-relation.less';

const Option = Select.Option;
const controlDivId = 'rgvis';
const EgoHeight = document.body.scrollHeight - 180;
const EgoWidth = document.body.scrollWidth - (24 * 2);

let d3; // global d3

/*
 * @params: lang: [en|cn]
 */
@connect(({ app }) => ({ app }))
@Auth
export default class TopicRelation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.currentModle1 = false; // 是否选中点或边
    this.currentModle2 = false; // 是否暂停调整
    this.drag = false;

    this.pglength = 0;

    this.count = 0;


    this.pgshow = true;
    // this.pglength = 0;

    this.loadingInterval = null; // used to disable interval.

    this.lineColor = '#9ecae1';

    this.query = '';
    this.activities = ['0'];
    this.startYearSet = ['No limit'];
    this.endYearSet = ['No limit'];
    this.startYear = 0;
    this.endYear = 10000;
    this.data = null;
  }

  state = {
    vm: {},
    pgLength: 0,
    describeNodes1: 0,
    describeNodes2: 0,
    describeNodes3: 0,
    subnet_selection: false,
    suspension_adjustment: false,
    two_paths: false,
    continuous_path: false,
    single_extension: false,
    allNodes: [],
    currentNode: null,
    start_two_paths: null,
    end_two_paths: null,
  };

  componentDidMount() {
    loadD3((ret) => {
      d3 = ret;
      this.showVis(this);
      this.query = this.props.query || 'data mining';
      this.redraw();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      this.query = nextProps.query;
      this.redraw();
    }
  };

  componentWillUnmount() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
    document.body.removeChild(document.getElementById('tip'));
  };

  showVis = (t) => {
    this.startup(t);
  };

  redraw = () => {
    console.log('[debug] redraw');
    this.count = 0;
    this.pgshow = true;
    this.pglength = 0;
    this.currentModle1 = false;
    this.currentModle2 = false;
    this.setState({ currentNode: null, currentEdge: null });

    let max = 100;
    const interval = 200;
    this.loadingInterval = setInterval(() => {
      if (max <= 0) { // call then
        this.pgshow = false;
      } else { // call interval function
        this.pro();
      }
      max -= 1;
    }, interval);
    d3.json(`https://dc_api.aminer.org/trend/relation/${this.query}`, (error, data) => {
      if (error) {
        throw error;
      }
      this.data = data;
      if (data) {
        const pubs = data.pubs;
        let startYear = 10000;
        let endYear = 0;
        for (let i = 0; i < pubs.length; i++) {
          const year = pubs[i].year;
          startYear = Math.min(year, startYear);
          endYear = Math.max(year, endYear);
        }
        this.startYearSet = ['No limit'];
        this.endYearSet = ['No limit'];
        for (let i = startYear; i <= endYear; i++) {
          this.startYearSet.push(i.toString());
          this.endYearSet.push(i.toString());
        }
        data.co_occurs.sort((a, b) => {
          if (a.t1 < b.t1 || a.t1 === b.t1 && a.t2 < b.t2) return -1;
          if (a.t1 === b.t1 && a.t2 === b.t2) return 0;
          return 1;
        });
      }
      this.pgshow = false;
      this.pglength = 100;
      return this.drawNet();
    });
  };


  pro = () => {
    if (this.pglength > 85) {
      this.webconnect = '网络状况不佳请耐心等待！';
    } else {
      this.webconnect = '';
    }
    if (this.pglength >= 100) {
      this.pglength = 100;
    } else {
      this.pglength = this.pglength + 5;
    }
    this.setState({ pgLength: this.pglength });
  };

  // ############################# in big startup file ############################
  startup = (t) => {
    const currentThis = t;
    console.log('[debug] startup relation vis.');

    let svg = null;

    let _drag;

    const width = EgoWidth;
    const height = EgoHeight;
    let _nodes = [];
    let _edges = [];
    let _occurSum = 0;
    let _nodeSum = 0;
    let snum = 10;
    let occursShow = 0;
    let _onclicknode = -1;
    let _onclickedge = -1;

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    let simulation = null;

    // 设置圆的半径
    const getRadious = (d) => {
      if (d <= 0) {
        return 0;
      } else {
        return Math.log(Math.min(d, 200)) * 2 + 3;
      }
      // return Math.sqrt(d);
    };

    // 随机颜色 目前
    const getColor = (d) => {
      if (d > 100) {
        d = 100;
      }
      return color(d / 100);
    };
    // 聚类颜色
    const getClusteringColor = (d) => {
      if (d.rank < snum) {
        return this.lineColor;
      } else {
        return 'rgb(253, 141, 60)';
      }
    };

    const getStrokeWidth = (d) => {
      if (d <= 0) {
        return 0;
      } else {
        return 1 + 0.4 * Math.log(d);
      }

    }

    const dragstarted = (d) => {
      hideInfo();
      this.drag = true;
      if (!d3.event.active && this.currentModle2 === false) {
        simulation.alphaTarget(0.05).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      hideInfo();
      this.drag = true;
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      this.drag = false;
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };

    let mouseOnDiv = false;

    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tip')
      .on('mouseover', () => {
        mouseOnDiv = true;
      })
      .on('mouseout', () => {
        mouseOnDiv = false;
        document.getElementById('tip').style.display = 'none';
      });

    const showInfo = (d) => {
      if (!this.drag) {
        document.getElementById('tip').style.display = 'block';
        div.transition().duration(20).style('opacity', 1.0);
        div.html(`<span class="title">${d.label}</span>`)
          .style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY + 10}px`);
      } else {
        document.getElementById('tip').style.display = 'none';
      }
    };

    const hideInfo = () => {
      document.getElementById('tip').style.display = 'none';
    };

    _drag = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

    // $scope.zommed.
    this.zoomed = function () {
      hideInfo();
      const transform = d3.zoomTransform(this);
      svg.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
      svg.selectAll('.initialText').data(_nodes).text((d) => {
        if (d.maxOccur > occursShow && (transform.k >= 3 || d.rank < snum)) {
          return d.label;
        }
        return '';
      }).attr('dy', (d) => {
        if (d.maxOccur > occursShow || d.degree < 300) {
          const top = getRadious(d.degree) * 1.4;
          return top + 1.5;
        } else {
          return transform.k + 16;
        }
      }).style('font-size', `${15 / transform.k}px`).attr('stroke-width', 3 / transform.k);
      svg.selectAll('.finalText').data(_nodes).text((d) => {
        if (d.maxOccur > occursShow && (transform.k >= 3 || d.rank < snum)) {
          return d.label;
        }
        return '';
      }).attr('dy', (d) => {
        if (d.maxOccur > occursShow || d.degree < 300) {
          const top = getRadious(d.degree) * 1.4;
          return top + 1.5;
        } else {
          return transform.k + 16;
        }
      }).attr('stroke-width', '0px').style('font-size', `${15 / transform.k}px`);
      return svg.selectAll('text').data(_nodes).style('font-size', `${15 / transform.k}px`);
    };

    const tempzoom = d3.zoom().scaleExtent([0, 10]).on('zoom', this.zoomed);

    svg = d3.select(`#${controlDivId}`).append('svg').attr('id', 'svg-object')
      .style('width', width)
      .style('height', height)
      .attr('class', 'jumbotron')
      .attr('bottom', '0px')
      .style('padding', '2px 2px 2px 2px')
      .call(tempzoom)
      .append('svg:g');
    console.log('svg: is ', svg);

    this.onSearch = (d) => {
      this.currentModle1 = true;
      nodeOrEdgeClick(d, 'node', true);
    };

    const nodeOrEdgeClick = (d, type, isSearch = false) => {
      if (type === '' || type === 'node' && !isSearch && _onclicknode === d.index || type === 'edge' && _onclickedge === d.index) {
        this.currentModle1 = false;
        this.setState({ currentNode: null, currentEdge: null });
        _onclicknode = -1;
        _onclickedge = -1;
        svg.selectAll('circle').data(_nodes).style('stroke', '#000').style('opacity', 1);
        svg.selectAll('line').data(_edges).style('stroke', this.lineColor).style('opacity', 1);
      } else if (type === 'node' || type === 'edge') {
        if (!d) {
          return;
        }
        svg.selectAll('circle').data(_nodes).style('stroke', '#fff').style('opacity', 0.5);
        svg.selectAll('line').data(_edges).style('stroke', this.lineColor).style('opacity', 0.3);
        if (type === 'node') {
          this.setState({ currentNode: d, currentEdge: null });
          _onclicknode = d.index;
          _onclickedge = -1;
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('stroke', '#000').style('opacity', 1);
          svg.selectAll('line').data(_edges).filter((e) => {
            return e.target.index === d.index || e.source.index === d.index;
          }).style('stroke', '#a28eee').style('opacity', 1);
        } else {
          this.setState({ currentNode: null, currentEdge: d });
          for (let i = 0; i < Math.min(d.pubs.length, 3); i++) {
            this.setTitle(d, i);
          }
          _onclicknode = -1;
          _onclickedge = d.index;
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.source.index || k.index === d.target.index;
          }).style('stroke', '#000').style('opacity', 1);
          svg.selectAll('line').data(_edges).filter((e) => {
            return e.index === d.index;
          }).style('stroke', '#a28eee').style('opacity', 1);
        }
      }
    };

    this.cancelSelected = () => {
      nodeOrEdgeClick(null, '');
    };

    const _drawNetOnly = () => {
      let link,
        node,
        nodes_text,
        final_text;
      this.setState({
        describeNodes1: _nodeSum,
        describeNodes2: _occurSum,
        describeNodes3: _edges.length
      });
      link = svg.append('g').attr('class', 'links').selectAll('line').data(_edges).enter().append('line')
        .style('stroke', this.lineColor)
        .style('stroke-width', (d) => {
          return getStrokeWidth(d.count);
        })
        .on('click', (d) => {
          this.currentModle1 = true;
          return nodeOrEdgeClick(d, 'edge');
        });
      node = svg.append('g').attr('class', 'nodes').selectAll('circle').data(_nodes).enter().append('circle')
        .attr('r', (d) => {
          return getRadious(d.degree);
        }).style('stroke', '#000').style('stroke-width', 0.5)
        .style('fill', (d) => {
          return getClusteringColor(d);
        }).call(_drag).on('mouseover', (d) => {
          showInfo(d);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', 'yellow');
        })
        .on('mouseout', (d) => {
          hideInfo();
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', (k) => {
            return getClusteringColor(k);
          });
        })
        .on('click', (d) => {
          this.currentModle1 = true;
          return nodeOrEdgeClick(d, 'node');
        });
      nodes_text = svg.selectAll('.nodetext').data(_nodes).enter().append('text').attr('class', 'initialText').style('cursor', ' pointer').style('font-size', '15px')
        .attr('dy', (d) => {
          const top = getRadious(d.degree) * 1.4;
          return top + 10;
        })
        .text((d) => {
          if (d.rank < snum && d.maxOccur > occursShow) {
            return d.label;
          } else {
            return '';
          }
        }).attr('text-anchor', (d) => {
          return 'middle';
        }).style('fill', '#333').attr('font-weight', 600).attr('stroke', '#fff')
        .attr('stroke-width', '2px').attr('stroke-linecap', 'butt').attr('stroke-linejoin', 'miter')
        .on('mouseover', (d) => {
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', 'yellow');
        })
        .on('mouseout', (d) => {
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', (k) => {
            return getClusteringColor(k);
          });
        })
        .on('click', (d) => {
          this.currentModle1 = true;
          return nodeOrEdgeClick(d, 'node');
        });

      final_text = svg.selectAll('.nodetextstyle').data(_nodes).enter().append('text').attr('class', 'finalText').style('cursor', ' pointer').style('font-size', '15px')
        .attr('dy', (d) => {
          const top = getRadious(d.degree) * 1.4;
          return top + 10;
        })
        .text((d) => {
          if (d.rank < snum && d.maxOccur > occursShow) {
            return d.label;
          } else {
            return '';
          }
        }).attr('font-weight', 600).style('fill', '#333')
        .attr('stroke', '#fff').attr('stroke-width', '0px').attr('stroke-linecap', 'butt')
        .attr('stroke-linejoin', 'miter').attr('text-anchor', 'middle')
        .on('mouseover', (d) => {
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', 'yellow');
        })
        .on('mouseout', (d) => {
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.index === d.index;
          }).style('fill', (d) => {
            return getClusteringColor(d);
          });
        })
        .on('click', (d) => {
          this.currentModle1 = true;
          return nodeOrEdgeClick(d, 'node');
        });

      const ticked = () => {
        link.attr('x1', (d) => {
          return d.source.x;
        }).attr('y1', (d) => {
          return d.source.y;
        }).attr('x2', (d) => {
          return d.target.x;
        }).attr('y2', (d) => {
          return d.target.y;
        });
        node.attr('cx', (d) => {
          return d.x;
        }).attr('cy', (d) => {
          return d.y;
        });
        final_text.attr('x', (d) => {
          return d.x;
        });
        final_text.attr('y', (d) => {
          return d.y;
        });
        nodes_text.attr('x', (d) => {
          return d.x;
        });
        return nodes_text.attr('y', (d) => {
          return d.y;
        });
      };
      simulation.nodes(_nodes).on('tick', ticked);
    };

    this.drawNet = () => {
      console.log('this.drawNet::query is:', this.query);
      this.currentModle1 = false;
      this.currentModle2 = false;
      this.setState({ currentNode: null, currentEdge: null });
      _onclicknode = -1;
      _onclickedge = -1;
      svg.selectAll('*').remove();
      const terms = this.data.terms;
      const coOccurs = this.data.co_occurs;
      const pubs = this.data.pubs;
      const nodes = [];
      for (let i = 0; i < terms.length; i++) {
        nodes.push({ index: i, label: terms[i], degree: 0, rank: 0, occursRec: [], maxOccur: 0 });
      }
      const edges = [];
      let maxCount = 0;
      for (let i = 0; i < coOccurs.length; i++) {
        const edge = coOccurs[i];
        const year = pubs[edge.pub].year;
        if (year >= this.startYear && year <= this.endYear) {
          let ind = -1;
          const j = edges.length - 1;
          if (j >= 0 && edges[j].node1 === edge.t1 && edges[j].node2 === edge.t2) {
            ind = j;
          }
          if (ind === -1) {
            ind = edges.length;
            edges.push({
              index: ind,
              node1: edge.t1,
              node2: edge.t2,
              source: nodes[edge.t1],
              target: nodes[edge.t2],
              count: 0,
              pubs: []
            });
          }
          edges[ind].count += 1;
          maxCount = Math.max(maxCount, edges[ind].count);
          edges[ind].pubs.push({
            href: `https://www.aminer.cn/archive/${pubs[edge.pub].id['$oid']}`,
            id: pubs[edge.pub].id['$oid'],
            title: 'loading...'
          });
          nodes[edge.t1].degree += 1;
          nodes[edge.t2].degree += 1;
        }
      }
      maxCount = Math.min(30, maxCount);
      this.activities = [];
      for (let i = 0; i < maxCount; i++) {
        this.activities.push(i.toString());
      }
      _occurSum = 0;
      for (let i = 0; i < edges.length; i++) {
        const n1 = edges[i].node1;
        const n2 = edges[i].node2;
        const c = edges[i].count;
        nodes[n1].maxOccur = Math.max(nodes[n1].maxOccur, c);
        nodes[n2].maxOccur = Math.max(nodes[n2].maxOccur, c);
        nodes[n1].occursRec.push({ index: n2, label: nodes[n2].label, count: c });
        nodes[n2].occursRec.push({ index: n1, label: nodes[n1].label, count: c });
        _occurSum += edges[i].count;
      }
      const nodesRank = [];
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].occursRec.sort((a, b) => {
          if (a.count > b.count || a.count === b.count && a.index < b.index) return -1;
          if (a.count === b.count && a.index === b.index) return 0;
          return 1;
        });
        nodesRank.push({ index: i, degree: nodes[i].degree });
      }
      nodesRank.sort((a, b) => {
        if (a.degree > b.degree || a.degree === b.degree && a.index < b.index) return -1;
        if (a.degree === b.degree && a.index === b.index) return 0;
        return 1;
      });
      _nodeSum = 0;
      for (let i = 0; i < nodes.length; i++) {
        nodes[nodesRank[i].index].rank = i;
        if (nodesRank[i].degree > 0) {
          _nodeSum += 1;
        }
      }
      snum = Math.max(2, Math.min(Math.floor(_nodeSum * 0.1), 10));

      if (!nodes || nodes.length <= 0) {
        message.info('No data, please change a query.');
        return;
      }
      _nodes = nodes;
      console.log('[debug] this is all nodes');
      console.log(_nodes);
      this.setState({ allNodes: _nodes });
      _edges = edges;
      console.log('[debug] this is all edges');
      console.log(_edges);
      const setLink = d3.forceLink(_edges).distance((d) => {
        return (-d.count * 2.5) + 15;
      });
      simulation = d3.forceSimulation(_nodes).velocityDecay(0.3)
        .force('charge', d3.forceManyBody().strength((d) => {
          return d.count;
        }))
        .force('link', setLink)
        .force('gravity', d3.forceCollide(height / 100 + 10).strength(0.6)).alpha(0.2)
        .force('center', d3.forceCenter(width / 2, height / 2));
      _drawNetOnly();
      if (process.env.NODE_ENV !== 'production') {
        console.log('RelationGraph: popover()!!!!');
      }
      return null;
    };

    this.changeModle2 = () => {
      this.currentModle2 = !currentThis.state.suspension_adjustment;
      currentThis.setState({
        suspension_adjustment: !currentThis.state.suspension_adjustment,
      });
      if (typeof simulation !== 'undefined') {
        if (this.currentModle2 === true) {
          return simulation.stop();
        } else {
          return simulation.restart();
        }
      }
    };

    // 筛选co-occur
    this.wholeLayout = () => {
      console.log('[debug] enter -> wholeLayout');
      svg.selectAll('line').data(_edges).attr('display', (d) => {
        if (d.count > occursShow) {
          return '';
        } else {
          return 'none';
        }
      });
      svg.selectAll('circle').data(_nodes).attr('display', (d) => {
        if (d.maxOccur > occursShow) {
          return '';
        } else {
          return 'none';
        }
      });
      svg.selectAll('.initialText').data(_nodes).attr('display', (d) => {
        if (d.maxOccur > occursShow) {
          return '';
        } else {
          return 'none';
        }
      });
      svg.selectAll('.finalText').data(_nodes).attr('display', (d) => {
        if (d.maxOccur > occursShow) {
          return '';
        } else {
          return 'none';
        }
      });
    };

    this.occursChange = (e) => {
      occursShow = parseInt(e, 10);
      this.wholeLayout();
    };

    this.startYearChange = (e) => {
      if (e === 'No limit') {
        this.startYear = 0;
      } else {
        this.startYear = parseInt(e, 10);
      }
      const b = document.getElementById('redrawButton');
      if (this.startYear > this.endYear) {
        b.disabled = true;
      } else {
        b.disabled = false;
      }
    };

    this.endYearChange = (e) => {
      if (e === 'No limit') {
        this.endYear = 10000;
      } else {
        this.endYear = parseInt(e, 10);
      }
      const b = document.getElementById('redrawButton');
      if (this.startYear > this.endYear) {
        b.disabled = true;
      } else {
        b.disabled = false;
      }
    };

    this.redrawGraph = () => {
      this.drawNet();
      this.wholeLayout();
    };

    this.setTitle = (d, i) => {
      if (d.pubs[i].title === 'loading...') {
        document.getElementById(`paperLink${i}`).text = 'loading...';
        d3.json(`https://api.aminer.org/api/pub/summary/${d.pubs[i].id}`, (error, data) => {
          if (error) {
            throw error;
          }
          if (data && data.title) {
            d.pubs[i].title = data.title;
            document.getElementById(`paperLink${i}`).text = data.title;
          }
        });
      }
    };

    return null;
    // insert something here.
  };

  // ############################# in big startup file ############################

  render() {
    const { describeNodes1, describeNodes2, describeNodes3, suspension_adjustment, currentNode, currentEdge } = this.state;
    return (
      <div>
        <div className={styles.relationHeader}>
          <div className={styles.statAndAction}>
            <div className={styles.statistics}>
              <span className={styles.statCount}>{describeNodes1}</span>
              <FM id="com.topicRelation.statistics.keywordsNum" defaultMessage="个关键词 " />
              <span className={styles.statCount}>{describeNodes2}</span>
              <FM id="com.topicRelation.statistics.coOccurenceNum" defaultMessage="对共现关系 " />
              <span className={styles.statCount}>{describeNodes3}</span>
              <FM id="com.topicRelation.statistics.edgeNum" defaultMessage="条边 " />
            </div>
            <div className={styles.action}>
              <label><FM id="com.topicRelation.header.relativeOperation" defaultMessage="相关操作：" /></label>
              <Button className={classnames({
                active: suspension_adjustment,
                [styles.selected]: suspension_adjustment,
              })}
                      onClick={this.changeModle2}>
                <span className={classnames('icon', styles.stop_drag_icon)} />
                <FM id="com.topicRelation.header.pauseAction" defaultMessage="暂停调整" />
              </Button>
              &nbsp;&nbsp;&nbsp;
              <label><FM id="com.topicRelation.header.coOccurenceNum"
                         defaultMessage="共现次数>" /></label>
              <Select defaultValue="0" style={{ width: 70, marginRight: 10 }} id="co-occur-select"
                      onChange={this.occursChange}>
                {this.activities.map((act) => {
                  return (
                    <Option key={act} value={act}>{act}</Option>
                  );
                })}
              </Select>
              <RgSearchTermBox size="default" style={{ width: 270 }} onSearch={this.onSearch}
                               suggesition={this.state.allNodes} />
            </div>
          </div>
          <div className={styles.filterBlock}>
            <label><FM id="com.topicRelation.header.startYear" defaultMessage="起始年份：" /></label>
            <Select defaultValue="No limit" style={{ width: 100, marginRight: 10 }}
                    onChange={this.startYearChange}>
              {this.startYearSet.map((act) => {
                return (
                  <Option key={act} value={act}>{act}</Option>
                );
              })}
            </Select>
            <label><FM id="com.topicRelation.header.endYear" defaultMessage="结束年份：" /></label>
            <Select defaultValue="No limit" style={{ width: 100, marginRight: 10 }}
                    onChange={this.endYearChange}>
              {this.endYearSet.map((act) => {
                return (
                  <Option key={act} value={act}>{act}</Option>
                );
              })}
            </Select>
            <Button id="redrawButton" onClick={this.redrawGraph}>
              go
            </Button>
          </div>
        </div>

        {/* 左侧显示选中点的信息 */}
        {currentNode !== null && currentNode &&
        <div id="leftInfoZone" className={styles.leftInfoZone}>
          <div>
            <div className={styles.title}>{currentNode.label}</div>
            <hr />
            <div className={styles.content}>
              <span>degree:</span>
              <span style={{ color: 'black' }}> {currentNode.degree}</span>&nbsp;
              |&nbsp;
              <span>max-co-occur:</span>
              <span style={{ color: 'black' }}> {currentNode.maxOccur}</span>
              <br />
              <span>Top {Math.min(currentNode.occursRec.length, 3)} co-occur terms:</span>
              <br />
              {currentNode.occursRec.length > 0 &&
              <div>{currentNode.occursRec[0].label}: {currentNode.occursRec[0].count}</div>}
              {currentNode.occursRec.length > 1 &&
              <div>{currentNode.occursRec[1].label}: {currentNode.occursRec[1].count}</div>}
              {currentNode.occursRec.length > 2 &&
              <div>{currentNode.occursRec[2].label}: {currentNode.occursRec[2].count}</div>}
            </div>
          </div>
          <div className={styles.delCurrent} style={{ color: '#a90329' }}
               onClick={this.cancelSelected}>
            <i className="fa fa-ban" aria-hidden="true" />
          </div>
        </div>}

        {/* 左侧显示选中边的信息 */}
        {currentEdge !== null && currentEdge &&
        <div id="leftInfoZone" className={styles.leftInfoZone}>
          <div>
            <div
              className={styles.title}>{currentEdge.source.label} - {currentEdge.target.label}</div>
            <hr />
            <div className={styles.content}>
              <span>weight:</span>
              <span style={{ color: 'black' }}> {currentEdge.count}</span>
              <br />
              <span>Relative papers:</span>
              <br />
              {currentEdge.pubs.length > 0 &&
              <a className={styles.paperLink} id="paperLink0" href={currentEdge.pubs[0].href}
                 target="_blank">{currentEdge.pubs[0].title}</a>}
              <br />
              {currentEdge.pubs.length > 1 &&
              <a className={styles.paperLink} id="paperLink1" href={currentEdge.pubs[1].href}
                 target="_blank">{currentEdge.pubs[1].title}</a>}
              <br />
              {currentEdge.pubs.length > 2 &&
              <a className={styles.paperLink} id="paperLink2" href={currentEdge.pubs[2].href}
                 target="_blank">{currentEdge.pubs[2].title}</a>}
            </div>
          </div>
          <div className={styles.delCurrent} style={{ color: '#a90329' }}
               onClick={this.cancelSelected}>
            <i className="fa fa-ban" aria-hidden="true" />
          </div>
        </div>}

        {/* 关系图 */}
        <div id="rgvis" style={{
          width: EgoWidth,
          height: EgoHeight,
          border: '1px solid #eee',
          marginTop: 10,
        }} />
        {/* 进度条 */}
        {this.pgshow && <Progress percent={this.state.pgLength} style={{
          width: EgoWidth / 2,
          position: 'relative',
          top: `-${parseInt(EgoHeight, 10) / 2}px`,
          marginLeft: '20%',
        }} />}
      </div>
    );
  }
}
