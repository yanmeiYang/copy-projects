/* eslint-disable max-len */
/**
 *  Created by BoGao on 2017-07-10;
 */
import React from 'react';
import { connect } from 'dva';
import * as d3 from 'd3';
import { Checkbox, Select, Progress, message, Button } from 'antd';
import { RgSearchNameBox } from '../../components/relation-graph';
import { getAvatar } from '../../utils/profile-utils';
import { classnames } from '../../utils/index';
import styles from './RelationGraph.less';
import { Auth } from '../../hoc';

const Option = Select.Option;
const controlDivId = 'rgvis';
const EgoHeight = document.body.scrollHeight - 180;
const EgoWidth = document.body.scrollWidth - (24 * 2);

/*
 * @params: lang: [en|cn]
 */
@connect(({ app }) => ({ app }))
@Auth
export default class RelationGraph extends React.PureComponent {
  constructor(props) {
    super(props);

    this.filed = undefined;

    this.currentModle1 = false;
    this.currentModle2 = false;
    this.currentModle3 = false;
    this.currentModle4 = false;
    this.currentModle5 = false;
    this.drag = false;

    this.engineer = {
      currentActivity: 'h-Index>0',
    };
    this.activities = ['h-Index>0', 'h-Index>10', 'h-Index>30', 'h-Index>60'];
    this.filed = 'DataMing';
    this.bn1 = 'btn btn-default active';
    this.pglength = 0;

    this.count = 0;


    this.pgshow = true;
    // this.pglength = 0;
    this.webconnect = '';

    this.loadingInterval = null; // used to disable interval.
    this.hideInfoTimeOUt = null;

    this.lineColor = '#9ecae1';
    this.two_paths_endNode = '';
  }

  state = {
    vm: {},
    pgLength: 0,
    describeNodes1: 0,
    describeNodes2: 0,
    subnet_selection: false,
    suspension_adjustment: false,
    two_paths: false,
    continuous_path: false,
    single_extension: false,
    allNodes: [],
    currentNode: null,
    start_two_paths: null,
    end_two_paths: null,
    // activities: ['h-Index>0', 'h-Index>10', 'h-Index>30', 'h-Index>60']
  };

  componentDidMount() {
    this.showVis(this);
    const query = this.props.query || 'data mining';
    this.redraw(query);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      // console.log('query changed to :', nextProps.query);
      // this.showVis(this);
      this.redraw(nextProps.query);
    }
  }

  componentWillUnmount() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }
    // 清除timeout、删除用于提示专家名字的div
    clearTimeout(this.hideInfoTimeOUt);
    document.body.removeChild(document.getElementById('tip'));
  }

  showVis = (t) => {
    this.startup(t);
  };

  redraw = (type) => {
    this.count = 0;
    this.pgshow = true;
    this.pglength = 0;
    this.pgshow = true;

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

    return this.drawNet(type);
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
      this.pglength = this.pglength + 10;
    }
    this.setState({ pgLength: this.pglength });
  };

  // ############################# in big startup file ############################
  startup = (t) => {
    const currentThis = t;
    console.log('[debug] startup relation vis.');

    let svg = null;

    let _drag;

    const vm = this.state.vm;
    const width = EgoWidth;
    const height = EgoHeight;
    let _nodes = [];
    let _edges = [];
    const _onclicknodes = [];
    let _saveRootAdges = [];
    let _endOfSortAdges = [];
    let stack = [];
    const snum = 10;
    const _showNodes = [];
    const _saveSortAdges = [];
    let _totalLine = [];
    let _lastNode = null;
    let showName = 100;
    let dispalyAll = true;
    let indexShow = 0;

    const color = d3.scaleOrdinal(d3.schemeCategory20);
    // const color = d3.interpolateRgb(d3.rgb('blue'), d3.rgb(230, 0, 18));
    // const rawSvg = d3.select(`#${controlDivId}`).append('svg')
    //   .style('width', '850px')
    //   .style('height', '600px');

    let simulation = null;

    // 设置圆的半径
    const getRadious = (d) => {
      if (d <= 15) {
        return 5;
      } else if (d < 60) {
        return 8;
      } else if (d >= 60) {
        return 12;
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
      const s = _edges.filter(item => item.source.id === d.id);
      const t = _edges.filter(item => item.target.id === d.id);
      if (s.length > 0) {
        return this.lineColor;
        // return color(s[0].source.index + 1);
      } else if (t.length > 0) {
        return 'rgb(253, 141, 60)';
        // return color(t[0].source.index + 1);
      } else {
        return 'rgb(253, 141, 60)';
      }
    };

    // 根据操作获取点与点之间的路径
    const getPaths = (cNode, pNode, sNode, eNode) => {
      let a,
        i,
        nNode;
      nNode = null;
      if (cNode !== null && pNode !== null && cNode === pNode) {
        return false;
      }
      if (cNode !== null) {
        i = 0;
        stack.push(cNode);
        if (cNode === eNode) {
          a = [];
          stack.forEach((f) => {
            return a.push(f);
          });
          _endOfSortAdges.push(a);
          return false;
        } else {
          nNode = _saveSortAdges[cNode][i];
          while (nNode !== null) {
            if (pNode !== null &&
              (nNode === sNode || nNode === pNode || stack.indexOf(nNode) !== -1)) {
              if (i >= _saveSortAdges[cNode].length) {
                nNode = null;
              } else {
                nNode = _saveSortAdges[cNode][i];
              }
              i += 1;
              continue;
            }
            if (getPaths(nNode, cNode, sNode, eNode)) {
              stack.pop();
            }
            if (i >= _saveSortAdges[cNode].length) {
              nNode = null;
            } else {
              nNode = _saveSortAdges[cNode][i];
            }
            i += 1;
          }
          stack.pop();
          return false;
        }
      } else {
        return false;
      }
    };
    // 两点之间的直线距离
    const isstraight = (a, b) => {
      let flag = false;
      svg.selectAll('line').data(_edges).style('opacity', 0.3);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.3);
      svg.selectAll('line').data(_edges).filter((e, i) => {
        if ((e.target.index === a && e.source.index === b)
          || (e.target.index === b && e.source.index === a)) {
          flag = true;
          return true;
        } else {
          return false;
        }
      }).style('stroke', 'black');
      return flag;
    };

    const sortNode = (a, b, c, d) => {
      const res = [];
      if (a >= snum) {
        _edges.forEach((f) => {
          if (f.target.index === a) {
            b = f.source.index;
            return b;
          }
        });
      }
      if (d >= snum) {
        _edges.forEach((f) => {
          if (f.target.index === d) {
            c = f.source.index;
            return c;
          }
        });
        _edges.forEach((f) => {
          if (f.target.index === d && f.source.index === b) {
            c = f.source.index;
            return c;
          }
        });
      }
      if (b === null) {
        b = a;
      }
      if (c === null) {
        c = d;
      }
      res.push(a);
      res.push(b);
      res.push(c);
      res.push(d);
      return res;
    };

    const saveSortAdges = (sum) => {
      _edges.forEach((f) => {
        if (f.target.index < sum) {
          const a = {
            start: f.source.index,
            end: f.target.index,
          };
          return _saveRootAdges.push(a);
        }
      });
      let a,
        i,
        k,
        setlink,
        temp;
      i = 0;
      while (i < sum) {
        a = [];
        _saveRootAdges.forEach((f) => {
          if (f.start === i && a.indexOf(f.end) === -1) {
            a.push(f.end);
          }
          if (f.end === i && a.indexOf(f.start) === -1) {
            return a.push(f.start);
          }
        });
        if (a.length === 0) {
          k = 0;
          a.push(k);
          _saveSortAdges.push([i]);
          temp = {
            target: _nodes[k],
            source: _nodes[i],
            count: 20,
          };
          _edges.push(temp);
        } else {
          _saveSortAdges.push(a);
        }
        i++;
      }
    }

    // 单点扩展
    const expandNet = (goals, d) => {
      let edgeIndex,
        goalsId,
        tempEdges;
      goalsId = goals[0];
      tempEdges = [];
      edgeIndex = _edges.length;
      if (goals.length > 0) {
        return d3.json(`https://api.aminer.org/api/person/ego/${goals[0]}`, (error, data) => {
          if (error) {
            throw error;
          }
          if (data.count > 3) {
            data.nodes.forEach((f, i) => {
              const step = i % 2 === 0 ? 0.1 : -0.1;
              const n = {
                name: { n: { en: f.name, zh: f.name_zh } },
                desc: { n: { en: '' } },
                avatar: '',
                num_viewed: '',
                indices: { hIndex: f.h_index || 10 },
                pos: [],
                id: f.id,
                index: _nodes.length + 1,
                x: d.x + step,
                y: d.y,
                vx: d.vx + step,
                vy: d.vy,
              };
              const k = {
                index: edgeIndex += 1,
                target: n,
                source: d,
                count: f.w,
              };
              if (_nodes.find(item => item.id === f.id) === undefined) {
                _nodes.push(n);
                tempEdges.push(k);
              }
            });
            if (tempEdges.length > 2) {
              svg.selectAll('*').remove();
              tempEdges.forEach((k) => {
                return _edges.push(k);
              });
              saveSortAdges(50);
              _drawNetOnly(snum);
              simulation.alphaTarget(0.05).restart();
              setTimeout((d) => {
                simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
              }, 2000, d);
              console.log('popover again()!!!!');
              return null;
            }
          }
        });
      }
    };
    // const expandNet = (goals, d) => {
    //   let edgeIndex,
    //     goalsId,
    //     tempEdges;
    //   goalsId = [];
    //   goals.forEach((f) => {
    //     return goalsId.push(f.id);
    //   });
    //   if (goals.length > 6) {
    //     tempEdges = [];
    //     edgeIndex = _edges.length;
    //     return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[0]}`, (error, data) => {
    //       if (error) {
    //         throw error;
    //       }
    //       if (data.count > 3) {
    //         data.nodes.forEach((f) => {
    //           let a,
    //             k;
    //           a = goalsId.indexOf(f.id);
    //           if (a !== -1) {
    //             k = {
    //               index: edgeIndex += 1,
    //               target: goals[a],
    //               source: goals[0],
    //               count: f.w,
    //             };
    //             return tempEdges.push(k);
    //           }
    //         });
    //         return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[1]}`, (error, data2) => {
    //           if (error) {
    //             throw error;
    //           }
    //           if (data2.count > 3) {
    //             data2.nodes.forEach((f) => {
    //               let a,
    //                 k;
    //               a = goalsId.indexOf(f.id);
    //               if (a !== -1) {
    //                 k = {
    //                   index: edgeIndex += 1,
    //                   target: goals[a],
    //                   source: goals[1],
    //                   count: f.w,
    //                 };
    //                 return tempEdges.push(k);
    //               }
    //             });
    //             return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[2]}`, (error, data3) => {
    //               if (error) {
    //                 throw error;
    //               }
    //               if (data3.count > 3) {
    //                 data3.nodes.forEach((f) => {
    //                   let a,
    //                     k;
    //                   a = goalsId.indexOf(f.id);
    //                   if (a !== -1) {
    //                     k = {
    //                       index: edgeIndex += 1,
    //                       target: goals[a],
    //                       source: goals[2],
    //                       count: f.w,
    //                     };
    //                     return tempEdges.push(k);
    //                   }
    //                 });
    //                 return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[3]}`, (error, data4) => {
    //                   if (error) {
    //                     throw error;
    //                   }
    //                   if (data4.count > 3) {
    //                     data4.nodes.forEach((f) => {
    //                       let a,
    //                         k;
    //                       a = goalsId.indexOf(f.id);
    //                       if (a !== -1) {
    //                         k = {
    //                           index: edgeIndex += 1,
    //                           target: goals[a],
    //                           source: goals[3],
    //                           count: f.w,
    //                         };
    //                         return tempEdges.push(k);
    //                       }
    //                     });
    //                     return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[4]}`, (error, data5) => {
    //                       if (error) {
    //                         throw error;
    //                       }
    //                       if (data5.count > 3) {
    //                         data5.nodes.forEach((f) => {
    //                           let a,
    //                             k;
    //                           a = goalsId.indexOf(f.id);
    //                           if (a !== -1) {
    //                             k = {
    //                               index: edgeIndex += 1,
    //                               target: goals[a],
    //                               source: goals[4],
    //                               count: f.w,
    //                             };
    //                             return tempEdges.push(k);
    //                           }
    //                         });
    //                         return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[5]}`, (error, data6) => {
    //                           let i,
    //                             k,
    //                             t;
    //                           if (error) {
    //                             throw error;
    //                           }
    //                           if (data6.count > 3) {
    //                             data6.nodes.forEach((f) => {
    //                               let a,
    //                                 k;
    //                               a = goalsId.indexOf(f.id);
    //                               if (a !== -1) {
    //                                 k = {
    //                                   index: edgeIndex += 1,
    //                                   target: goals[a],
    //                                   source: goals[5],
    //                                   count: f.w,
    //                                 };
    //                                 return tempEdges.push(k);
    //                               }
    //                             });
    //                             i = 0;
    //                             while (i < 10) {
    //                               t = Math.floor(Math.random() * 10);
    //                               k = {
    //                                 index: edgeIndex += 1,
    //                                 target: goals[t],
    //                                 source: goals[t + 10],
    //                                 count: 2 + Math.floor(Math.random() * 10),
    //                               };
    //                               tempEdges.push(k);
    //                               i++;
    //                             }
    //                             i = 0;
    //                             while (i < 10) {
    //                               t = 10 + Math.floor(Math.random() * 10);
    //                               k = {
    //                                 index: edgeIndex += 1,
    //                                 target: goals[t],
    //                                 source: goals[t + 10],
    //                                 count: 2 + Math.floor(Math.random() * 10),
    //                               };
    //                               tempEdges.push(k);
    //                               i++;
    //                             }
    //                             while (i < 10) {
    //                               t = 20 + Math.floor(Math.random() * 10);
    //                               k = {
    //                                 index: edgeIndex += 1,
    //                                 target: goals[t],
    //                                 source: goals[t + 10],
    //                                 count: 2 + Math.floor(Math.random() * 10),
    //                               };
    //                               tempEdges.push(k);
    //                               i++;
    //                             }
    //                             if (tempEdges.length > 2) {
    //                               // $('[data-toggle=\'popover\']').popover('hide');
    //                               console.log('popoverHide()!!!!');
    //
    //                               svg.selectAll('circle').remove();
    //                               svg.selectAll('line').remove();
    //                               svg.selectAll('text').remove();
    //                               tempEdges.forEach((k) => {
    //                                 return _edges.push(k);
    //                               });
    //                               _drawNetOnly(snum);
    //                               svg.attr('transform', `translate(${width * d.vx},${height * d.vy}) scale(1)`);
    //                               console.log(d);
    //                               // svg.selectAll('line').data(_edges).filter((k) => {
    //                               //   return goalsId.indexOf(k.target.id) === -1 || goalsId.indexOf(k.source.id) === -1;
    //                               // }).style('opacity', 0);
    //                               // svg.selectAll('text').data(_nodes).filter((k) => {
    //                               //   return goalsId.indexOf(k.id) === -1;
    //                               // }).style('opacity', 0);
    //                               // svg.selectAll('circle').data(_nodes).filter((k) => {
    //                               //   return goalsId.indexOf(k.id) === -1;
    //                               // }).style('opacity', 0);
    //                               simulation.restart();
    //                               // return $('[data-toggle=\'popover\']').popover();
    //                               console.log('popover again()!!!!');
    //                               return null;
    //                             }
    //                           }
    //                         });
    //                       }
    //                     });
    //                   }
    //                 });
    //               }
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // };

    const removeDuplicatedItem = (ar) => {
      let i,
        j,
        ret;
      ret = [];
      i = 0;
      j = ar.length;
      while (i < j) {
        if (ret.indexOf(ar[i]) === -1) {
          ret.push(ar[i]);
        }
        i++;
      }
      return ret;
    };

    const clearAllChoosed = (k) => {
      svg.selectAll('line').data(_edges).style('stroke', this.lineColor)
        .style('stroke-width', (d) => {
          return d;
        }).style('opacity', 0.3);
      svg.selectAll('text').data(_nodes).text((d) => {
        if (d.index < snum) {
          return d.name.n.en;
        } else {
          return '';
        }
      }).style('fill', '#fff');
      svg.selectAll('circle').data(_nodes)
        .style('stroke', '#fff')
        .style('stroke-width', (d) => {
          if (d.indices.hIndex > 50) {
            return '1.5px';
          } else {
            return '1px';
          }
        }).attr('fill', (d, index) => {
        return getClusteringColor(d);
      }).style('opacity', 1);
      return _onclicknodes.slice(0, _onclicknodes.length);
    };

    const dragstarted = (d) => {
      this.drag = true;
      if (!d3.event.active && this.currentModle2 === false) {
        simulation.alphaTarget(0.05).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
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
    // const div = d3.select('body').append('div').attr('class', 'tooltip').attr('id', 'tip').style('opacity', 0).style('background', 'white').style('color', 'black').style('padding', '0')
    //   .style('min-width', '300px').style('border-radius', '5px').style('padding-bottom', '10px');
    let mouseOnDiv = false;

    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tip')
      .on('mouseover', (d) => {
        mouseOnDiv = true;
      })
      .on('mouseout', (d) => {
        mouseOnDiv = false;
        document.getElementById('tip').style.display = 'none';
      });

    const showInfo = (d) => {
      if (!this.drag) {
        document.getElementById('tip').style.display = 'block';
        div.transition().duration(20).style('opacity', 1.0);
        div.html(`<span class="title">${d.name.n.en}</span>`)
          .style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY + 10}px`);
      } else {
        document.getElementById('tip').style.display = 'none';
      }
    };
    const hideInfo = (d) => {
      this.hideInfoTimeOUt = setTimeout(() => {
        if (!mouseOnDiv) {
          document.getElementById('tip').style.display = 'none';
        }
      }, 80);
    };

    _drag = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

    // $scope.zommed.
    this.zoomed = function () {
      const transform = d3.zoomTransform(this);
      svg.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
      svg.selectAll('line').data(_edges).style('stroke-width', (d) => {
        if (indexShow >= 10) {
          if (d.source.indices.hIndex > indexShow && d.target.indices.hIndex > indexShow) {
            return 1 / transform.k;
          } else {
            return 0;
          }
        } else {
          return 1 / transform.k;
        }
      });
      svg.selectAll('circle').data(_nodes).attr('r', (d) => {
        if (indexShow >= 10) {
          if (d.indices.hIndex > indexShow) {
            return getRadious(d.indices.hIndex);
          } else {
            return 0;
          }
        } else if (d.indices.hIndex < 400) {
          return getRadious(d.indices.hIndex);
        } else {
          return getRadious(15);
        }
      }).style('stroke-width', (d) => {
        if (d.indices.hIndex > 50) {
          return '1px';
        } else {
          return '0.5px';
        }
      });
      svg.selectAll('.initialText').data(_nodes).text((d) => {
        if (indexShow >= 60) {
          if (d.indices.hIndex > indexShow) {
            return d.name.n.en;
          } else if (transform.k >= 3) {
            console.log("放大到一定程度显示名字");
            console.log(transform.k);
            return d.name.n.en;
          } else {
            return '';
          }
        } else if (transform.k >= 3) {
          return d.name.n.en;
        } else if (d.index < snum) {
          return d.name.n.en;
        } else {
          return '';
        }
      }).attr('dy', (d) => {
        if (d.indices.hIndex > indexShow || d.indices.hIndex < 400) {
          const top = getRadious(d.indices.hIndex) * 2;
          return top + 1.5;
        } else {
          return transform.k + 16;
        }
      }).style('font-size', `${15 / transform.k}px`).attr('stroke-width', 3 / transform.k);
      svg.selectAll('.finalText').data(_nodes).text((d) => {
        if (indexShow >= 60) {
          if (d.indices.hIndex > indexShow) {
            return d.name.n.en;
          } else if (transform.k >= 3) {
            return d.name.n.en;
          } else {
            return '';
          }
        } else if (transform.k >= 3) {
          return d.name.n.en;
        } else if (d.index < snum) {
          return d.name.n.en;
        } else {
          return '';
        }
      }).attr('dy', (d) => {
        if (d.indices.hIndex > indexShow || d.indices.hIndex < 400) {
          const top = getRadious(d.indices.hIndex) * 2;
          return top + 1.5;
        } else {
          return transform.k + 16;
        }
      }).attr('stroke-width', '0px').style('font-size', `${15 / transform.k}px`);
      return svg.selectAll('text').data(_nodes).style('font-size', `${15 / transform.k}px`);
    };

    const tempzoom = d3.zoom().scaleExtent([0, 10]).on('zoom', this.zoomed);

    svg = d3.select(`#${controlDivId}`).append('svg')
      .style('width', width)
      .style('height', height)
      .attr('class', 'jumbotron')
      .attr('bottom', '0px')
      .style('padding', '2px 2px 2px 2px')
      .call(tempzoom)
      // .call(tip)
      .append('svg:g');
    console.log('svg: is ', svg);

    const returndraw = (k) => {
      svg.selectAll('line').data(_edges).style('stroke', this.lineColor).style('stroke-width', (d) => {
        return d;
      });
      return svg.selectAll('circle').data(_nodes).attr('r', (d) => {
        return getRadious(d.indices.hIndex);
        // if (d.indices.hIndex < 400) {
        //   return getRadious(d.indices.hIndex + 32);
        // } else {
        //   return getRadious(16);
        // }
      }).style('stroke-width', '0px').style('opacity', 0.8).attr('fill', (d) => {
        return getClusteringColor(d);
      });
    };

    const orderdraw = (ds) => {
      ds = removeDuplicatedItem(ds);
      svg.selectAll('line').data(_edges).style('opacity', 0.3).style('stroke', this.lineColor);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.3).style('stroke', '#fff');
      svg.selectAll('line').data(_edges).filter((e, i) => {
        let a,
          b;
        a = ds.indexOf(e.target.index);
        b = ds.indexOf(e.source.index);
        if (a !== -1 && b !== -1 && ((a > b && a === b + 1) || (a < b && b === a + 1))) {
          return true;
        } else {
          return false;
        }
      }).style('stroke-width', '1px').transition().duration(1000).style('stroke', 'black')
        .style('opacity', 0.8);
      svg.append('g').attr('class', 'ceter').enter().append('text').attr('dx', (d) => {
        return -20;
      }).text('s');
      svg.selectAll('circle').data(_nodes).filter((j) => {
        if (ds.indexOf(j.index) !== -1) {
          return true;
        } else {
          return false;
        }
      }).transition().duration(1000).style('stroke', (d) => {
        if (d.index === ds[ds.length - 1] || d.index === ds[0]) {
          return 'red';
        } else {
          return 'yellow';
        }
      }).style('stroke-width', '5px').style('opacity', 0.8);
      // return svg.selectAll('text').data(_nodes).filter((j) => {
      //   if (ds.indexOf(j.index) !== -1) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }).text((d) => {
      //   return d.name.n.en;
      // }).transition().duration(1000).style('fill', 'black').style('opacity', 0.8);
    };

    const orderdraw2 = (ds) => {
      ds = removeDuplicatedItem(ds);
      svg.selectAll('line').data(_edges).style('opacity', 0.3);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.3);
      svg.selectAll('line').data(_edges).filter((e, i) => {
        let a,
          b;
        a = ds.indexOf(e.target.index);
        b = ds.indexOf(e.source.index);
        if (a !== -1 && b !== -1) {
          return true;
        } else {
          return false;
        }
      }).transition().duration(1000).style('stroke', 'green').style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).filter((j) => {
        if (ds.indexOf(j.index) !== -1) {
          return true;
        } else {
          return false;
        }
      }).transition().duration(1000).attr('fill', 'yellow').style('opacity', 0.8);
      // return svg.selectAll('text').data(_nodes).filter((j) => {
      //   if (ds.indexOf(j.index) !== -1) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }).text((d) => {
      //   return d.name.n.en;
      // }).transition().duration(1000).style('stroke', 'green');
    };

    this.onSearch = (d) => {
      this.currentModle1 = true;
      this.currentModle3 = false;
      currentThis.setState({ two_paths: false });
      nodeclick(d);
      simulation.alphaTarget(0.1).restart();
      d.fx = EgoWidth / 2;
      d.fy = EgoHeight / 2;
      setTimeout((d) => {
        simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }, 2000, d);
      _onclicknodes.splice(_onclicknodes.indexOf(d.id), 1);
    };
    this.cancelSelected = () => {
      this.currentModle1 = false;
      this.currentModle2 = false;
      clearAllChoosed(5);
      this.setState({ currentNode: null });
    };
    this.onSearchTwoPathsStart = (d) => {
      _lastNode = null;
      nodeclick(d);
    };
    this.submitTwoPaths = () => {
      nodeclick(this.two_paths_endNode);
    };
    this.onSearchTwoPaths = (d) => {
      nodeclick(d);
    };
    const nodeclick = (d) => {
      let goalNodes,
        res,
        w;
      if (this.currentModle1 === true) {
        if (d.indices.numPubs) {
          this.setState({ currentNode: d });
        } else {
          d3.json(`https://api.aminer.org/api/person/summary/${d.id}`, (error, summary) => {
            if (summary) {
              d.avatar = summary.avatar;
              d.indices.numPubs = summary.indices.num_pubs;
              if (summary.aff) {
                d.desc.n.en = summary.aff.desc || summary.aff.desc_zh;
              }
              d.num_viewd = summary.num_viewd;
              if (summary.pos.length > 0) {
                d.pos[0] = { name: { n: { en: summary.pos[0].n || summary.pos[0].n_zh } } };
              }
            }
            this.setState({ currentNode: d });
          });
        }
        if (_onclicknodes.indexOf(d.id) === -1) {
          _onclicknodes.push(d.id);
          // svg.selectAll('line').data(_edges).style('opacity', 0.3);
          /* 清除样式开始 */
          svg.selectAll('circle').data(_nodes).style('stroke', '#fff').style('stroke-width', (d) => {
            if (d.indices.hIndex > 50) {
              return '1.5px';
            } else {
              return '1px';
            }
          }).style('opacity', 0.5);
          svg.selectAll('line').data(_edges).style('stroke', this.lineColor).style('opacity', 0.3);
          /* 清除样式结束 */

          svg.selectAll('circle').data(_nodes).filter((k) => {
            return d.name.n.en && k.id === d.id;
          }).style('stroke', 'yellow').style('stroke-width', '5px').style('opacity', 1);

          svg.selectAll('line').data(_edges).filter((e, i) => {
            return e.target.id === d.id || e.source.id === d.id;
          }).style('stroke', '#a28eee').style('stroke-width', '2').style('opacity', 1);
        } else {
          this.currentModle2 = false;
          this.setState({ currentNode: null });
          _onclicknodes[_onclicknodes.indexOf(d.id)] = '';
          svg.selectAll('circle').data(_nodes).style('stroke', '#fff')
            .style('stroke-width', (d) => {
              if (d.indices.hIndex > 50) {
                return '1.5px';
              } else {
                return '1px';
              }
            }).style('opacity', 1);
          svg.selectAll('line').data(_edges).style('stroke', this.lineColor).style('stroke-width', (d) => {
            return d;
          }).style('opacity', 0.3);
        }
      } else if (this.currentModle5 === true) {
        goalNodes = [];
        _edges.forEach((k) => {
          if (k.source.index === d.index) {
            return goalNodes.push(k.target);
          } else {
            return goalNodes;
          }
        });
        if (goalNodes.length < 6) {
          expandNet([d.id], d);
        } else {
          expandNet([], d);
        }
        // goalNodes.push(d.id)
        // return expandNet(goalNodes, d);
      } else if (this.currentModle3 === true) {
        if (_lastNode === null) {
          _lastNode = d.index;
          this.setState({ start_two_paths: d.name.n.en || d.name.n.zh });
          clearAllChoosed(5);
          returndraw(5);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).style('stroke', 'black').style('stroke-width', '5px');
        } else {
          if (_lastNode !== null) {
            _endOfSortAdges = [];
            stack = [];
            this.two_paths_endNode = d;
            this.setState({ end_two_paths: d.name.n.en || d.name.n.zh });
            if (!isstraight(d.index, _lastNode)) {
              res = [];
              res = sortNode(d.index, null, null, _lastNode);
              if (res !== null && res[1] === res[2]) {
                orderdraw(res);
              } else {
                getPaths(res[1], null, res[1], res[2]);
                console.log(`${res[1]},${res[2]}`);
                console.log(_endOfSortAdges);
                if (typeof _endOfSortAdges[0] !== 'undefined') {
                  w = [];
                  w.push(res[0]);
                  w = w.concat(_endOfSortAdges[0]);
                  w.push(res[3]);
                  orderdraw(w);
                } else {
                  alert('未找到路径');
                }
              }
            }
          }
          // this.setState({ end_two_paths: '', start_two_paths: '' });
          // return _lastNode = null;
        }
      } else if (this.currentModle4 === true) {
        if (_lastNode === null) {
          _lastNode = d.index;
          returndraw(5);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).style('stroke', 'black').style('stroke-width', '5px').style('fill', 'white');
        } else {
          _endOfSortAdges = [];
          stack = [];
          if (!isstraight(d.index, _lastNode)) {
            res = [];
            res = sortNode(d.index, null, null, _lastNode);
            if (res !== null && res[1] === res[2]) {
              orderdraw2(res);
            } else {
              getPaths(res[1], null, res[1], res[2]);
              if (_endOfSortAdges !== []) {
                w = [];
                w.push(res[0]);
                w = w.concat(_endOfSortAdges[0]);
                w.push(res[3]);
                _totalLine = _totalLine.concat(w);
                orderdraw2(_totalLine);
              } else {
                alert('未找到路径');
              }
            }
          }
        }
        _lastNode = d.index;
        return _lastNode;
      } else {
        return window.open(`https://cn.aminer.org/profile/${d.id}`);
      }
    };

    const _drawNetOnly = (b) => {
      let link,
        node,
        nodes_text,
        final_text,
        ticked;
      // this.describeNodes1 = _nodes.length;
      // this.describeNodes2 = _edges.length; .style('stroke-opacity', '0.6')
      this.setState({ describeNodes1: _nodes.length, describeNodes2: _edges.length });
      link = svg.append('g').attr('class', 'links').selectAll('line').data(_edges).enter().append('line').style('stroke', this.lineColor).style('stroke-width', (d) => {
        return d;
      });
      node = svg.append('g').attr('class', 'nodes').selectAll('circle').data(_nodes).enter().append('circle')
        .attr('r', (d) => {
          return getRadious(d.indices.hIndex);
          // if (d.indices.hIndex < 400) {
          //   return getRadious(d.indices.hIndex + 32);
          // } else {
          //   return getRadious(16);
          // }
        }).style('stroke', '#000').style('stroke-width', (d) => {
          return '.5px';
        }).attr('fill', (d, index) => {
          return getClusteringColor(d);
        }).call(_drag).on('mouseover', (d) => {
          showInfo(d);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id && _onclicknodes.indexOf(d.id) === -1;
          }).attr('fill', 'yellow');
        }).on('mouseout', (d) => {
          hideInfo(d);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', (d) => {
            return getClusteringColor(d);
          });
        }).attr('data-toggle', 'popover').attr('data-container', 'body').attr('data-placement', 'right').attr('data-html', true).attr('title', (d) => {
          return `<a href='https://cn.aminer.org/profile/${d.id}'>${d.name.n.en}</a>`;
        }).attr('data-trigger', 'hover').attr('delay', 500).attr('data-content', (d) => {
          let posObj,
            tempStr,
            temppos;
          tempStr = d.desc.n.en;
          posObj = d.pos[0];
          if (posObj) {
            temppos = posObj.name.n.en;
          }
          return `<strong class="text-danger">h-Index:</strong>${d.indices.hIndex}|<strong class="text-danger">#Papers:</strong>${d.indices.numPubs}<br><i  class="fa fa-briefcase">&nbsp;</i>${temppos}<br><i class="fa fa-map-marker" style="word-break:break-all;text-overflow:ellipsis">&nbsp;${tempStr}</i>`;
        }).on('click', (d) => {
          if (!this.currentModle3 && !this.currentModle4) {
            this.currentModle1 = !this.currentModle5;
          }
          this.currentModle2 = true;
          return nodeclick(d);
        });
      nodes_text = svg.selectAll('.nodetext').data(_nodes).enter().append('text').attr('class', 'initialText').style('cursor', ' pointer').style('font-size', '15px')
        .attr('dy', (d) => {
          const top = getRadious(d.indices.hIndex) * 2;
          return top + 10;
        })
        .text((d) => {
          if (d.index < snum) {
            return d.name.n.en;
          } else {
            return '';
          }
        }).attr('text-anchor', (d) => {
          return 'middle';
        }).style('fill', '#333').attr('font-weight', 600).attr('stroke', '#fff')
        .attr('stroke-width', '2px').attr('stroke-linecap', 'butt').attr('stroke-linejoin', 'miter')
        // .on('click', (d) => {
        //   return window.open(`https://cn.aminer.org/profile/${d.id}`);
        // })
        .on('mouseover', (d) => {
          showInfo(d);
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', 'yellow');
        }).on('mouseout', (d) => {
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', (d) => {
            return getClusteringColor(d);
          });
        }).on('click', (d) => {
          if (!this.currentModle3 && !this.currentModle4) {
            this.currentModle1 = !this.currentModle5;
          }
          this.currentModle2 = true;
          return nodeclick(d);
        });

      final_text = svg.selectAll('.nodetextstyle').data(_nodes).enter().append('text').attr('class', 'finalText').style('cursor', ' pointer').style('font-size', '15px')
        .attr('dy', (d) => {
          const top = getRadious(d.indices.hIndex) * 2;
          return top + 10;
        })
        .text((d) => {
          if (d.index < snum) {
            return d.name.n.en;
          } else {
            return '';
          }
        }).attr('font-weight', 600).attr('fill', '#333')
        .attr('stroke', '#fff').attr('stroke-width', '0px').attr('stroke-linecap', 'butt')
        .attr('stroke-linejoin', 'miter').attr('text-anchor', 'middle')
        // .on('click', (d) => {
        //   return window.open(`https://cn.aminer.org/profile/${d.id}`);
        // })
        .on('mouseover', (d) => {
          showInfo(d);
          // svg.selectAll('text').data(_nodes).filter((k) => {
          //   return k.id === d.id;
          // }).style('fill', 'yellow');
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', 'yellow');
        }).on('mouseout', (d) => {
          // hideInfo(d);
          // svg.selectAll('text').data(_nodes).filter((k) => {
          //   return k.id === d.id;
          // }).style('fill', '#fff');
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', (d) => {
            return getClusteringColor(d);
          });
        }).on('click', (d) => {
          if (!this.currentModle3 && !this.currentModle4) {
            this.currentModle1 = !this.currentModle5;
          }
          this.currentModle2 = true;
          return nodeclick(d);
        });

      // svg.selectAll('text').attr('stroke', 'orange').attr('stroke-width', '0px');
      ticked = function () {
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


    this.drawNet = (type) => {
      console.log('this.drawNet::type is:', type);
      this.filed = type;
      // d3.select('svg').remove();
      svg.selectAll('*').remove();
      // d3.json(`https://api.aminer.org/api/search/person?query=${type}&size=5&sort=h_index`, (error, graph) => {
      //   if (error) {
      //     throw error;
      //   }
      //   this.schoclars = [];
      //   const result = graph.result;
      //   return result.forEach((d) => {
      //     const k = {
      //       urlimage: `https:${d.avatar}`,
      //       name: d.name,
      //       hindex: d.indices.h_index,
      //       papers: d.indices.num_pubs,
      //       pos: d.aff.desc,
      //       sociability: d.indices.sociability,
      //       num_citation: d.indices.num_citation,
      //       activity: d.indices.activity,
      //       filed: d.tags.slice(0, 3),
      //     };
      //     return this.schoclars.push(k);
      //   });
      // });
      return d3.json(`https://api.aminer.org/api/search/person/ego?query=${type}&sort=h_index%20&size=${snum}`, (error, graph) => {
        let a,
          i,
          k,
          setlink,
          temp;
        if (error) {
          throw error;
        }
        this.pglength = 100;
        this.pgshow = false;
        // _nodes.splice(0, _nodes.length);
        _onclicknodes.splice(0, _onclicknodes.length);
        _showNodes.splice(0, _showNodes.length);
        // _edges.splice(0, _edges.length);
        showName = 76;
        dispalyAll = true;

        // special:
        if (!graph.nodes || graph.nodes.length <= 0) {
          message.info('No data, please change a query.');
          return;
        }

        _nodes = graph.nodes;
        this.setState({ allNodes: _nodes });
        _edges = graph.edges;
        setlink = d3.forceLink(_edges).distance((d) => {
          return (-d.count * 2.5) + 15;
        });
        simulation = d3.forceSimulation(_nodes).velocityDecay(0.3)
          .force('charge', d3.forceManyBody().strength((d) => {
            return d.count;
          }))
          .force('link', setlink)
          .force('gravity', d3.forceCollide(height / 100 + 10).strength(0.6)).alpha(0.2)
          .force('center', d3.forceCenter(width / 2, height / 2));
        _saveRootAdges = [];
        saveSortAdges(snum);
        // _edges.forEach((f) => {
        //   if (f.target.index < snum) {
        //     const a = {
        //       start: f.source.index,
        //       end: f.target.index,
        //     };
        //     return _saveRootAdges.push(a);
        //   }
        // });
        // i = 0;
        // while (i < snum) {
        //   a = [];
        //   _saveRootAdges.forEach((f) => {
        //     if (f.start === i && a.indexOf(f.end) === -1) {
        //       a.push(f.end);
        //     }
        //     if (f.end === i && a.indexOf(f.start) === -1) {
        //       return a.push(f.start);
        //     }
        //   });
        //   if (a.length === 0) {
        //     k = 0;
        //     a.push(k);
        //     _saveSortAdges.push([i]);
        //     temp = {
        //       target: _nodes[k],
        //       source: _nodes[i],
        //       count: 20,
        //     };
        //     _edges.push(temp);
        //   } else {
        //     _saveSortAdges.push(a);
        //   }
        //   i++;
        // }
        _drawNetOnly(snum);
        // $('[data-toggle=\'popover\']').popover();
        if (process.env.NODE_ENV !== 'production') {
          console.log('RelationGraph: popover()!!!!');
        }
        return null;
      });
    };

    // this.redraw('Data Mining');
    this.toField = (d) => {
      return window.open(`https://cn.aminer.org/search?t=b&q=${d}`);
    };


    this.lockedpeople = (name) => {
      let a = false;
      svg.selectAll('circle').data(_nodes).filter((d) => {
        if (d.name.n.en === name) {
          a = true;
          return true;
        } else {
          return false;
        }
      }).attr('fill', 'yellow');
      if (a === false) {
        return alert('图中没有该学者！');
      }
    };

    this.simpleLayout = () => {
      let i,
        j;
      this.bn1 = 'btn btn-default';
      dispalyAll = false;
      if (_showNodes.length === 0) {
        i = 0;
        while (i < 10) {
          _showNodes.push(Math.floor(Math.random() * _nodes.length));
          i++;
        }
        i = 0;
        j = 0;
        while (i < 2) {
          _edges.forEach((h) => {
            if (j % 3 === 0) {
              if (_showNodes.indexOf(h.target.index) !== -1) {
                _showNodes.push(h.source.index);
              }
              if (_showNodes.indexOf(h.source.index) !== -1) {
                _showNodes.push(h.target.index);
              }
            }
            return j++;
          });
          i++;
        }
        svg.selectAll('line').data(_edges).style('stroke-width', (d) => {
          if (_showNodes.indexOf(d.target.index) !== -1 && _showNodes.indexOf(d.source.index) !== -1 && d.target.indices.hIndex > indexShow && d.source.indices.hIndex > indexShow) {
            return '1px';
          } else {
            return '0px';
          }
        });
        svg.selectAll('circle').data(_nodes).attr('r', (d) => {
          return getRadious(d.indices.hIndex);
          // if (_showNodes.indexOf(d.index) !== -1 && d.indices.hIndex > indexShow) {
          //   return getRadious(d.indices.hIndex + 32);
          // } else {
          //   return 0;
          // }
        });
        return svg.selectAll('.nodetext').data(_nodes).text((d) => {
          if (_showNodes.indexOf(d.index) !== -1 && d.indices.hIndex > indexShow || d.index > snum) {
            return d.name.n.en;
          } else {
            return '';
          }
        });
      } else {
        svg.selectAll('line').data(_edges).style('stroke-width', (d) => {
          if (_showNodes.indexOf(d.target.index) !== -1 && _showNodes.indexOf(d.source.index) !== -1 && d.target.indices.hIndex > indexShow && d.source.indices.hIndex > indexShow) {
            return '1px';
          } else {
            return '0px';
          }
        });
        svg.selectAll('circle').data(_nodes).attr('r', (d) => {
          return getRadious(d.indices.hIndex);
          // if (_showNodes.indexOf(d.index) !== -1 && d.indices.hIndex > indexShow) {
          //   return getRadious(d.indices.hIndex + 32);
          // } else {
          //   return 0;
          // }
        });
        return svg.selectAll('.nodetext').data(_nodes).text((d) => {
          if (_showNodes.indexOf(d.index) !== -1 || d.index > snum) {
            return d.name.n.en;
          } else {
            return '';
          }
        });
      }
    };
    // 筛选h-index
    this.wholeLayout = () => {
      console.log('[debug] enter -> wholeLayout');
      dispalyAll = true;
      svg.selectAll('line').data(_edges).style('stroke-width', (d) => {
        if (d.target.indices.hIndex > indexShow && d.source.indices.hIndex > indexShow) {
          return '1px';
        } else {
          return '0px';
        }
      });
      svg.selectAll('circle').data(_nodes).attr('r', (d) => {
        if (d.indices.hIndex > indexShow) {
          return getRadious(d.indices.hIndex);
        } else {
          return 0;
        }
      });
      // return svg.selectAll('.nodetext').data(_nodes).text((d) => {
      //   if (d.indices.hIndex > showName && d.indices.hIndex > indexShow) {
      //     return d.name.n.en + d.indices.hIndex;
      //   } else {
      //     return '';
      //   }
      // });
    };
    this.IndexChange = (e) => {
      if (e === 'h-Index>0') {
        indexShow = 0;
      } else if (e === 'h-Index>10') {
        indexShow = 10;
      } else if (e === 'h-Index>30') {
        indexShow = 30;
      } else {
        indexShow = 60;
      }
      this.wholeLayout();
    };
    // console.log('Here is a watch, engineer.currentActivity');
    // this.$watch('engineer.currentActivity', function (d) {
    //   return $scope.wholeLayout();
    // });
    // 没有作用
    this.currentActivityChanged = () => {
      this.wholeLayout();
    };

    this.changeModle1 = (e) => {
      clearAllChoosed(5);
      _totalLine = [];
      _lastNode = null;
      this.currentModle1 = !this.currentModle1;
      svg.selectAll('line').data(_edges).style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.8);
      currentThis.setState({
        subnet_selection: e.target.checked,
        two_paths: false,
        continuous_path: false,
        single_extension: false,
      });
      // $('#cb5').attr('checked', false);
      this.currentModle5 = false;
      // $('#cb3').attr('checked', false);
      this.currentModle3 = false;
      // $('#cb4').attr('checked', false);
      return this.currentModle4 = false;
    };
    this.changeModle2 = () => {
      this.currentModle2 = !currentThis.state.suspension_adjustment;
      // this.currentModle2 = !this.currentModle2;
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
    this.changeModle3 = (e) => {
      console.log('两点路径', currentThis.state.two_paths);
      clearAllChoosed(5);
      _totalLine = [];
      _lastNode = null;
      this.currentModle3 = !this.currentModle3;
      svg.selectAll('line').data(_edges).style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.8);
      currentThis.setState({
        subnet_selection: false,
        two_paths: !currentThis.state.two_paths,
        continuous_path: false,
        single_extension: false,
      });

      // $('#cb1').attr('checked', false);
      this.currentModle1 = false;
      // $('#cb5').attr('checked', false);
      this.currentModle5 = false;
      // $('#cb4').attr('checked', false);
      return this.currentModle4 = false;
    };
    this.changeModle4 = (e) => {
      clearAllChoosed(5);
      _totalLine = [];
      _lastNode = null;
      this.currentModle4 = !this.currentModle4;
      svg.selectAll('line').data(_edges).style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.8);
      currentThis.setState({
        subnet_selection: false,
        two_paths: false,
        continuous_path: e.target.checked,
        single_extension: false,
      });
      // $('#cb1').attr('checked', false);
      this.currentModle1 = false;
      // $('#cb3').attr('checked', false);
      this.currentModle3 = false;
      // $('#cb5').attr('checked', false);
      return this.currentModle5 = false;
    };

    this.changeModle5 = (e) => {
      clearAllChoosed(5);
      _totalLine = [];
      _lastNode = null;
      this.currentModle5 = !this.currentModle5;
      svg.selectAll('line').data(_edges).style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.8);
      currentThis.setState({
        subnet_selection: false,
        two_paths: false,
        continuous_path: false,
        single_extension: !currentThis.state.single_extension,
      });
      // $('#cb1').attr('checked', false);
      this.currentModle1 = false;
      this.currentModle2 = false;
      // $('#cb3').attr('checked', false);
      this.currentModle3 = false;
      // $('#cb4').attr('checked', false);
      return this.currentModle4 = false;
    };
    return null;
    // insert something here.
  };

  // ############################# in big startup file ############################

  render() {
    const { describeNodes1, describeNodes2, suspension_adjustment, two_paths, continuous_path, single_extension, currentNode } = this.state;
    return (
      <div>
        <div className={styles.relationHeader}>
          <div className={styles.statAndAction}>
            {/* 搜索结果 */}
            <div className={styles.statistics}>
              共
              <span className={styles.statCount}>{describeNodes1}</span>
              位专家，
              <span className={styles.statCount}>{describeNodes2}</span>
              个关系
            </div>
            {/*style={{ width: EgoWidth }}*/}
            <div className={styles.action}>
              <label>相关操作：</label>
              {/* <Checkbox checked={subnet_selection} onChange={this.changeModle1}>子网选取</Checkbox> */}
              <Button className={classnames({
                active: suspension_adjustment,
                [styles.selected]: suspension_adjustment,
              })}
                      onClick={this.changeModle2}>
                <span className={classnames('icon', styles.stop_drag_icon)} />
                暂停调整
              </Button>
              <Button className={classnames(styles.two_paths, {
                active: two_paths,
                [styles.selected]: two_paths,
              })}
                      onClick={this.changeModle3}>
                <span className={classnames('icon', styles.two_paths_icon)} />
                两点路径
              </Button>
              {/*<Button onChange={this.changeModle4}>*/}
              {/*<span className={classnames('icon', styles.continue_paths_icon)} />*/}
              {/*连续路径*/}
              {/*</Button>*/}
              {/*<Checkbox checked={continuous_path} onChange={this.changeModle4}>连续路径</Checkbox>*/}
              {/*<Checkbox checked={single_extension} onChange={this.changeModle5}>单点扩展</Checkbox>*/}
              <Button className={classnames(styles.two_paths, {
                active: single_extension,
                [styles.selected]: single_extension,
              })}
                      onClick={this.changeModle5}>
                <span className={classnames('icon', styles.single_extension_icon)} />
                单点扩展
              </Button>
            </div>
          </div>
          <div className={styles.filterBlock}>
            <label>H-指数：</label>
            <Select defaultValue="h-Index>0" style={{ width: 120, marginRight: 10 }}
                    onChange={this.IndexChange}>
              {this.activities.map((act) => {
                return (
                  <Option key={act} value={act}>{act}</Option>
                );
              })}
            </Select>
            <RgSearchNameBox size="default" style={{ width: 230 }} onSearch={this.onSearch}
                             suggesition={this.state.allNodes} />
          </div>
        </div>
        {this.currentModle3 &&
        <div className={styles.twoExpertPathBySearch}>
          <span>
            <RgSearchNameBox size="default" style={{ width: 230 }}
                             onSearch={this.onSearchTwoPathsStart}
                             value={this.state.start_two_paths}
                             suggesition={this.state.allNodes} hideSearchBtn />
            &nbsp;-&nbsp;
            <RgSearchNameBox size="default" style={{ width: 230 }}
                             value={this.state.end_two_paths}
                             onSearch={this.onSearchTwoPaths}
                             suggesition={this.state.allNodes} hideSearchBtn />
            &nbsp;
            <Button type="primary" size="small" onClick={this.submitTwoPaths}>确定选择</Button>
          </span>
        </div>
        }

        {/* 左侧显示的专家信息 */}
        {currentNode !== null && currentNode &&
        <div id="leftInfoZone" className={styles.leftInfoZone}>
          <div>
            {currentNode.avatar &&
            <div className={styles.avatar}>
              <a href={`https://aminer.org/profile/-/${currentNode.id}`} target="_blank">
                <img src={getAvatar(currentNode.avatar, currentNode.id, 90)}
                     alt={currentNode.name.n.en} />
              </a>
            </div>
            }
            {currentNode.name
            && <a href={`https://aminer.org/profile/-/${currentNode.id}`} target="_blank">
              <h2>{currentNode.name.n.en}</h2></a>
            }
            {currentNode.indices &&
            <div style={{ marginBottom: 8 }}>
              <span>h-Index:</span>
              <span style={{ color: 'orange' }}> &nbsp;{currentNode.indices.hIndex}</span>&nbsp;
              |&nbsp;
              <span>#Papers:</span>
              <span style={{ color: 'orange' }}> &nbsp;{currentNode.indices.numPubs}</span>
            </div>
            }
            {currentNode.pos.length > 0 &&
            <p>
              <i className="fa fa-briefcase fa-fw" />
              {currentNode.pos.length > 0 ? currentNode.pos[0].name.n.en : ''}
            </p>
            }
            {currentNode.desc &&
            <p>
              <i className="fa fa-institution fa-fw" />
              {currentNode.desc.n.en ? currentNode.desc.n.en : ''}
            </p>
            }
          </div>
          <div className={styles.delCurrentNode} style={{ color: '#a90329' }}
               onClick={this.cancelSelected}>
            <i className="fa fa-ban" aria-hidden="true" />
          </div>
        </div>
        }
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
          top: `-${parseInt(EgoHeight) / 2}px`,
          marginLeft: '20%',
        }} />}
      </div>
    );
  }
}

// export default connect()(RelationGraph);
