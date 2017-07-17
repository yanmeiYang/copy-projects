/**
 *  Created by BoGao on 2017-07-10;
 */
import React from 'react';
import { connect } from 'dva';
import { Checkbox, Select } from 'antd';
import { displayPositionFirst, displayAff } from '../../utils/profile_utils';
import styles from './RelationGraph.less';
import * as d3 from '../../../public/d3/d3.min';

const Option = Select.Option;
const controlDivId = 'rgvis';
const EgoHeight = 800;
const EgoWidth = document.body.scrollWidth - 188 - 24 * 2;

/*
 * @params: lang: [en|cn]
 */
class RelationGraph extends React.PureComponent {
  constructor(props) {
    super(props);

    this.filed = undefined;

    this.currentModle1 = false;
    this.currentModle2 = false;
    this.currentModle3 = false;
    this.currentModle4 = false;
    this.currentModle5 = false;

    this.engineer = {
      currentActivity: 'h-Index>0',
    };
    this.activities = ['h-Index>0', 'h-Index>10', 'h-Index>30', 'h-Index>60'];
    this.filed = 'DataMing';
    this.bn1 = 'btn btn-default active';
    this.pglength = 0;

    this.count = 0;


    this.pgshow = true;
    this.pglength = 0;
    this.webconnect = '';
  }

  state = {
    vm: {},
    describeNodes1: 0,
    describeNodes2: 0,
    subnet_selection: false,
    suspension_adjustment: false,
    two_paths: false,
    continuous_path: false,
    single_extension: false,
    // activities: ['h-Index>0', 'h-Index>10', 'h-Index>30', 'h-Index>60']
  };

  componentDidMount() {
    this.showVis(this);
    this.redraw(this.props.query);
  }

  componentDidUpdate(prevProps, prevState) {
    // this.showVis();
  }

  showVis = (t) => {
    this.startup(t);
  };

  redraw = (type) => {
    console.log(this.props.query);
    this.count = 0;
    this.pgshow = true;
    this.pglength = 0;
    this.pgshow = true;

    let max = 100;
    const interval = 200;
    setInterval(() => {
      if (max === 0) { // call then
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
    if (this.pglength < 100) {
      return this.pglength++;
    } else {
      return this.pglength = 0;
    }
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

    const color = d3.interpolateRgb(d3.rgb('blue'), d3.rgb(230, 0, 18));
    // const rawSvg = d3.select(`#${controlDivId}`).append('svg')
    //   .style('width', '850px')
    //   .style('height', '600px');

    let simulation = null;

    const getRadious = (d) => {
      return Math.sqrt(d);
    };

    const getColor = (d) => {
      if (d > 100) {
        d = 100;
      }
      return color(d / 100);
    };

    const getPaths = (cNode, pNode, sNode, eNode) => {
      console.log('getpaths');
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
            console.log(nNode);
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

    const isstraight = (a, b) => {
      let flag = false;
      svg.selectAll('line').data(_edges).filter((e, i) => {
        if ((e.target.index === a && e.source.index === b)
          || (e.target.index === b && e.source.index === a)) {
          flag = true;
          return true;
        } else {
          return false;
        }
      }).style('stroke', 'green');
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

    const expandNet = (goals, d) => {
      let edgeIndex,
        goalsId,
        tempEdges;
      goalsId = [];
      goals.forEach((f) => {
        return goalsId.push(f.id);
      });
      if (goals.length > 6) {
        tempEdges = [];
        edgeIndex = _edges.length;
        return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[0]}`, (error, data) => {
          if (error) {
            throw error;
          }
          if (data.count > 3) {
            data.nodes.forEach((f) => {
              let a,
                k;
              a = goalsId.indexOf(f.id);
              if (a !== -1) {
                k = {
                  index: edgeIndex += 1,
                  target: goals[a],
                  source: goals[0],
                  count: f.w,
                };
                return tempEdges.push(k);
              }
            });
            return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[1]}`, (error, data2) => {
              if (error) {
                throw error;
              }
              if (data2.count > 3) {
                data2.nodes.forEach((f) => {
                  let a,
                    k;
                  a = goalsId.indexOf(f.id);
                  if (a !== -1) {
                    k = {
                      index: edgeIndex += 1,
                      target: goals[a],
                      source: goals[1],
                      count: f.w,
                    };
                    return tempEdges.push(k);
                  }
                });
                return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[2]}`, (error, data3) => {
                  if (error) {
                    throw error;
                  }
                  if (data3.count > 3) {
                    data3.nodes.forEach((f) => {
                      let a,
                        k;
                      a = goalsId.indexOf(f.id);
                      if (a !== -1) {
                        k = {
                          index: edgeIndex += 1,
                          target: goals[a],
                          source: goals[2],
                          count: f.w,
                        };
                        return tempEdges.push(k);
                      }
                    });
                    return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[3]}`, (error, data4) => {
                      if (error) {
                        throw error;
                      }
                      if (data4.count > 3) {
                        data4.nodes.forEach((f) => {
                          let a,
                            k;
                          a = goalsId.indexOf(f.id);
                          if (a !== -1) {
                            k = {
                              index: edgeIndex += 1,
                              target: goals[a],
                              source: goals[3],
                              count: f.w,
                            };
                            return tempEdges.push(k);
                          }
                        });
                        return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[4]}`, (error, data5) => {
                          if (error) {
                            throw error;
                          }
                          if (data5.count > 3) {
                            data5.nodes.forEach((f) => {
                              let a,
                                k;
                              a = goalsId.indexOf(f.id);
                              if (a !== -1) {
                                k = {
                                  index: edgeIndex += 1,
                                  target: goals[a],
                                  source: goals[4],
                                  count: f.w,
                                };
                                return tempEdges.push(k);
                              }
                            });
                            return d3.json(`https://api.aminer.org/api/person/ego/${goalsId[5]}`, (error, data6) => {
                              let i,
                                k,
                                t;
                              if (error) {
                                throw error;
                              }
                              if (data6.count > 3) {
                                data6.nodes.forEach((f) => {
                                  let a,
                                    k;
                                  a = goalsId.indexOf(f.id);
                                  if (a !== -1) {
                                    k = {
                                      index: edgeIndex += 1,
                                      target: goals[a],
                                      source: goals[5],
                                      count: f.w,
                                    };
                                    return tempEdges.push(k);
                                  }
                                });
                                i = 0;
                                while (i < 10) {
                                  t = Math.floor(Math.random() * 10);
                                  k = {
                                    index: edgeIndex += 1,
                                    target: goals[t],
                                    source: goals[t + 10],
                                    count: 2 + Math.floor(Math.random() * 10),
                                  };
                                  tempEdges.push(k);
                                  i++;
                                }
                                i = 0;
                                while (i < 10) {
                                  t = 10 + Math.floor(Math.random() * 10);
                                  k = {
                                    index: edgeIndex += 1,
                                    target: goals[t],
                                    source: goals[t + 10],
                                    count: 2 + Math.floor(Math.random() * 10),
                                  };
                                  tempEdges.push(k);
                                  i++;
                                }
                                while (i < 10) {
                                  t = 20 + Math.floor(Math.random() * 10);
                                  k = {
                                    index: edgeIndex += 1,
                                    target: goals[t],
                                    source: goals[t + 10],
                                    count: 2 + Math.floor(Math.random() * 10),
                                  };
                                  tempEdges.push(k);
                                  i++;
                                }
                                if (tempEdges.length > 2) {
                                  console.log('22222222');
                                  console.log(this);
                                  // $('[data-toggle=\'popover\']').popover('hide');
                                  console.log('popoverHide()!!!!');

                                  svg.selectAll('circle').remove();
                                  svg.selectAll('line').remove();
                                  svg.selectAll('text').remove();
                                  tempEdges.forEach((k) => {
                                    return _edges.push(k);
                                  });
                                  _drawNetOnly(snum);
                                  svg.attr('transform', `translate(${width * d.vx},${height * d.vy}) scale(1)`);
                                  console.log(d);
                                  svg.selectAll('line').data(_edges).filter((k) => {
                                    return goalsId.indexOf(k.target.id) === -1 || goalsId.indexOf(k.source.id) === -1;
                                  }).style('opacity', 0);
                                  svg.selectAll('text').data(_nodes).filter((k) => {
                                    return goalsId.indexOf(k.id) === -1;
                                  }).style('opacity', 0);
                                  svg.selectAll('circle').data(_nodes).filter((k) => {
                                    return goalsId.indexOf(k.id) === -1;
                                  }).style('opacity', 0);
                                  simulation.restart();
                                  // return $('[data-toggle=\'popover\']').popover();
                                  console.log('popover again()!!!!');
                                  return null;
                                }
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    };

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
      svg.selectAll('line').data(_edges).style('stroke', (d) => {
        return '#888888';
      });
      svg.selectAll('text').data(_nodes).text((d) => {
        if (d.index < snum) {
          return d.name.n.en;
        } else {
          return '';
        }
      }).style('fill', '#333333');
      svg.selectAll('circle').data(_nodes).attr('fill', (d) => {
        return getColor(d.indices.hIndex);
      });
      return _onclicknodes.slice(0, _onclicknodes.length);
    };

    const dragstarted = (d) => {
      if (!d3.event.active && this.currentModle2 === false) {
        simulation.alphaTarget(0.2).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
    const div = d3.select('body').append('div').attr('class', 'tooltip').attr('id', 'tip').style('opacity', 0).style('background', 'white').style('color', 'black').style('padding', '0')
      .style('min-width', '300px').style('border-radius', '5px').style('padding-bottom', '10px');
    const showInfo = (d) => {
      const pageX = d3.event.pageX;
      const pageY = d3.event.pageY;
      let posObj,
        tempStr,
        temppos;
      tempStr = d.desc.n.en ? d.desc.n.en : '' ;
      posObj = d.pos[0];
      if (posObj) {
        posObj.name.n.en ? temppos = posObj.name.n.en : temppos = posObj.name.n.zh;
      } else {
        temppos = '';
      }
      setTimeout((d, px, py) => {
        document.getElementById('tip').style.display = 'none';
        document.getElementById('tip').style.display = 'block';
        div.transition().duration(500).style('opacity', 0);
        div.transition().duration(20).style('opacity', 1.0);
        div.html(`<div class="" style="background: #EEEEEE;height: 35px;line-height: 35px; padding-left: 10px; border-radius: 5px; margin-top: 1px;">
<a href='https://cn.aminer.org/profile/${d.id}'>${d.name.n.en}</a></div>
<div style="padding-left: 10px;margin-left: 5px;margin-right: 5px;"><strong style="color: #a94442">h-Index:</strong>${d.indices.hIndex}&nbsp;|&nbsp;<strong style="color: #a94442">#Papers:</strong>${d.indices.numPubs}</br><p><i  class="fa fa-briefcase">&nbsp;
</i>${temppos}</p><p><i class="fa fa-map-marker" style="word-break:break-all;text-overflow:ellipsis">&nbsp;${tempStr}</i></p></div>`)
          .style('left', `${px + 5}px`).style('top', `${py}px`);
        document.getElementById('tip').onmouseout = function (e) {
          if (this === e.relatedTarget) {
            document.getElementById('tip').style.display = 'none';
          }
        };
      }, 100, d, pageX, pageY);
    };
    const hideInfo = (d) => {
      const div = document.getElementById('tip');
      const x = d3.event.pageX;
      const y = d3.event.pageY;
      setTimeout((x, y) => {
        const x1 = div.offsetLeft;
        const y1 = div.offsetTop;
        const divx2 = div.offsetLeft + div.offsetWidth;
        const divy2 = div.offsetTop + div.offsetHeight;
        if (x < x1 || x > divx2 || y < y1 || y > divy2) {
          document.getElementById('tip').style.display = 'none';
        }
      }, 1500, x, y);
    };

    _drag = d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);

    // $scope.zommed.
    this.zoomed = function () {
      // console.log('[debug] in zommed, this:', this);
      const transform = d3.zoomTransform(this);
      svg.attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`);
      svg.selectAll('line').data(_edges).style('stroke-width', 1 / transform.k);
      svg.selectAll('circle').data(_nodes).attr('r', (d) => {
        if (d.indices.hIndex > indexShow || d.indices.hIndex < 400) {
          return getRadious(d.indices.hIndex / transform.k);
        } else {
          return getRadious(0);
        }
      }).style('stroke-width', (d) => {
          if (d.indices.hIndex > 50) {
            return '1px';
          } else {
            return '0.5px';
          }
      });
      svg.selectAll('text').data(_nodes).text((d) => {
        if (transform.k >= 3) {
          return d.name.n.en;
        } else if (transform.k >= 2 && d.index < snum*3) {
          return d.name.n.en;
        } else if (d.index < snum) {
          return d.name.n.en;
        } else {
          return '';
        }
      }).attr('dy', (d) => {
        if (d.indices.hIndex > indexShow || d.indices.hIndex < 400) {
          const top = getRadious(d.indices.hIndex / transform.k) * 2;
          return top + 1.5;
        } else {
          return transform.k;
        }
      });
      return svg.selectAll('text').data(_nodes).style('font-size', `${15 / transform.k}px`);
    };

    const tempzoom = d3.zoom().scaleExtent([1, 10]).on('zoom', this.zoomed);

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
      svg.selectAll('line').data(_edges).style('stroke-width', '1px').style('stroke', '#999999').style('opacity', 0.8);
      return svg.selectAll('circle').data(_nodes).attr('r', (d) => {
        if (d.indices.hIndex < 400) {
          return getRadious(d.indices.hIndex);
        } else {
          return getRadious(0);
        }
      }).style('stroke-width', '0px').style('opacity', 0.8).attr('fill', (d) => {
        return getColor(d.indices.hIndex);
      });
    };

    const orderdraw = (ds) => {
      ds = removeDuplicatedItem(ds);
      svg.selectAll('line').data(_edges).style('opacity', 0.3);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.3);
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
      }).style('stroke-width', '1px').transition().duration(1000).style('stroke', 'green').style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).filter((j) => {
        if (ds.indexOf(j.index) !== -1) {
          return true;
        } else {
          return false;
        }
      }).transition().duration(1000).attr('fill', 'yellow').style('opacity', 0.8);
      return svg.selectAll('text').data(_nodes).filter((j) => {
        if (ds.indexOf(j.index) !== -1) {
          return true;
        } else {
          return false;
        }
      }).text((d) => {
        return d.name.n.en;
      }).transition().duration(1000).style('fill', 'green').style('opacity', 0.8);
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
      return svg.selectAll('text').data(_nodes).filter((j) => {
        if (ds.indexOf(j.index) !== -1) {
          return true;
        } else {
          return false;
        }
      }).text((d) => {
        return d.name.n.en;
      }).transition().duration(1000).style('stroke', 'green');
    };


    const nodeclick = (d) => {
      let goalNodes,
        res,
        w;
      if (this.currentModle1 === true) {
        if (_onclicknodes.indexOf(d.id) === -1) {
          _onclicknodes.push(d.id);
          svg.selectAll('line').data(_edges).style('opacity', 0.3);
          return svg.selectAll('line').data(_edges).filter((e, i) => {
            return e.target.id === d.id || e.source.id === d.id;
          }).style('stroke', 'yellow').style('opacity', 0.8);
        } else {
          _onclicknodes[_onclicknodes.indexOf(d.id)] = '';
          return svg.selectAll('line').data(_edges).filter((e, i) => {
            return e.target.id === d.id || e.source.id === d.id;
          }).style('stroke', d => '#999999');
        }
      } else if (this.currentModle5 === true) {
        goalNodes = [];
        _edges.forEach((k) => {
          if (k.source.index === d.index) {
            return goalNodes.push(k.target);
          }
        });
        return expandNet(goalNodes, d);
      } else if (this.currentModle3 === true) {
        if (_lastNode === null) {
          _lastNode = d.index;
          clearAllChoosed(5);
          returndraw(5);
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', '#ffff00');
        } else {
          if (_lastNode !== null) {
            _endOfSortAdges = [];
            stack = [];
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
          return _lastNode = null;
        }
      } else if (this.currentModle4 === true) {
        if (_lastNode === null) {
          _lastNode = d.index;
          returndraw(5);
          svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', '#ffff00');
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
        ticked;
      // this.describeNodes1 = _nodes.length;
      // this.describeNodes2 = _edges.length;
      this.setState({ describeNodes1: _nodes.length, describeNodes2: _edges.length });
      link = svg.append('g').attr('class', 'links').selectAll('line').data(_edges).enter().append('line').style('stroke', '#999').style('stroke-opacity', '0.6').style('stroke-width', (d) => { return d; });
      node = svg.append('g').attr('class', 'nodes').selectAll('circle').data(_nodes).enter().append('circle').attr('r', (d) => {
        if (d.indices.hIndex < 400) {
          return getRadious(d.indices.hIndex);
        } else {
          return getRadious(0);
        }
      }).style('stroke', '#fff').style('stroke-width', (d) => {
        if (d.indices.hIndex > 50) {
          return '1.5px';
        } else {
          return '1px';
        }
      }).attr('fill', (d) => {
        return getColor(d.indices.hIndex);
      }).call(_drag).on('mouseover', (d) => {
        showInfo(d);
        svg.selectAll('text').data(_nodes).filter((k) => {
          return k.id === d.id;
        }).style('fill', 'yellow');
        svg.selectAll('circle').data(_nodes).filter((k) => {
          return k.id === d.id;
        }).attr('fill', 'yellow');
      }).on('mouseout', (d) => {
        hideInfo(d);
        svg.selectAll('text').data(_nodes).filter((k) => {
          return k.id === d.id;
        }).style('fill', '#fff');
        svg.selectAll('circle').data(_nodes).filter((k) => {
          return k.id === d.id;
        }).attr('fill', (d) => {
          return getColor(d.indices.hIndex);
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
        this.currentModle1 = true;
        nodeclick(d);
      });
      nodes_text = svg.selectAll('.nodetext').data(_nodes).enter().append('text').style('cursor', ' pointer').style('font-size', '15px')
        .attr('dy', (d) => {
          const top = getRadious(d.indices.hIndex) * 2;
          return top + 10;
        })
        .style('fill', '#fff').text((d) => {
          if (d.index < snum) {
            return d.name.n.en;
          } else {
            return '';
          }
        }).attr('text-anchor', (d) => {
          return 'middle';
        })
        // .on('click', (d) => {
        //   return window.open(`https://cn.aminer.org/profile/${d.id}`);
        // })
        .on('mouseover', (d) => {
          showInfo(d);
          svg.selectAll('text').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).style('fill', 'yellow');
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', 'yellow');
        }).on('mouseout', (d) => {
          hideInfo(d);
          svg.selectAll('text').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).style('fill', '#fff');
          return svg.selectAll('circle').data(_nodes).filter((k) => {
            return k.id === d.id;
          }).attr('fill', (d) => {
            return getColor(d.indices.hIndex);
          });
        }).on('click', (d) => {
          this.currentModle1 = true;
          return nodeclick(d);
        });
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
        nodes_text.attr('x', (d) => {
          return d.x;
        });
        return nodes_text.attr('y', (d) => {
          return d.y;
        });
      };
      return simulation.nodes(_nodes).on('tick', ticked);
    };


    this.drawNet = (type) => {
      console.log('this.drawNet::type is:', type);
      this.filed = type;
      svg.selectAll('*').remove();
      d3.json(`https://api.aminer.org/api/search/person?query=${type}&size=5&sort=h_index`, (error, graph) => {
        if (error) {
          throw error;
        }
        this.schoclars = [];
        const result = graph.result;
        return result.forEach((d) => {
          const k = {
            urlimage: `https:${d.avatar}`,
            name: d.name,
            hindex: d.indices.h_index,
            papers: d.indices.num_pubs,
            pos: d.aff.desc,
            sociability: d.indices.sociability,
            num_citation: d.indices.num_citation,
            activity: d.indices.activity,
            filed: d.tags.slice(0, 3),
          };
          return this.schoclars.push(k);
        });
      });
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
        _nodes.splice(0, _nodes.length);
        _onclicknodes.splice(0, _onclicknodes.length);
        _showNodes.splice(0, _showNodes.length);
        _edges.splice(0, _edges.length);
        showName = 76;
        dispalyAll = true;
        _nodes = graph.nodes;
        _edges = graph.edges;
        setlink = d3.forceLink(_edges).distance((d) => {
          return (-d.count * 2.5) + 30;
        });
        simulation = d3.forceSimulation(_nodes).velocityDecay(0.3).force('charge', d3.forceManyBody().strength((d) => {
          return d.count;
        })).force('link', setlink).force('gravity', d3.forceCollide(height / 100 + 5).strength(0.6)).alpha(0.2).force('center', d3.forceCenter(width / 2, height / 2));
        _saveRootAdges = [];
        _edges.forEach((f) => {
          if (f.target.index < snum) {
            const a = {
              start: f.source.index,
              end: f.target.index,
            };
            return _saveRootAdges.push(a);
          }
        });
        i = 0;
        while (i < snum) {
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
          }
          _saveSortAdges.push(a);
          i++;
        }
        _drawNetOnly(snum);
        // $('[data-toggle=\'popover\']').popover();
        console.log('popover()!!!!');
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
          if (_showNodes.indexOf(d.index) !== -1 && d.indices.hIndex > indexShow) {
            return getRadious(d.indices.hIndex);
          } else {
            return 0;
          }
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
          if (_showNodes.indexOf(d.index) !== -1 && d.indices.hIndex > indexShow) {
            return getRadious(d.indices.hIndex);
          } else {
            return 0;
          }
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
      return svg.selectAll('.nodetext').data(_nodes).text((d) => {
        if (d.indices.hIndex > showName && d.indices.hIndex > indexShow) {
          return d.name.n.en + d.indices.hIndex;
        } else {
          return '';
        }
      });
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
    this.changeModle2 = (e) => {
      this.currentModle2 = e.target.checked;
      // this.currentModle2 = !this.currentModle2;
      currentThis.setState({
        suspension_adjustment: e.target.checked,
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
      clearAllChoosed(5);
      _totalLine = [];
      _lastNode = null;
      this.currentModle3 = !this.currentModle3;
      svg.selectAll('line').data(_edges).style('opacity', 0.8);
      svg.selectAll('circle').data(_nodes).style('opacity', 0.8);
      currentThis.setState({
        subnet_selection: false,
        two_paths: e.target.checked,
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
        single_extension: e.target.checked,
      });
      // $('#cb1').attr('checked', false);
      this.currentModle1 = false;
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
    const { describeNodes1, describeNodes2, subnet_selection, suspension_adjustment, two_paths, continuous_path, single_extension } = this.state;
    return (
      <div className={styles.vis_container}>
        <div style={{ display: 'flex', 'flex-direction': 'row' }}>
          <h3>{this.props.query}</h3>
          <div style={{ marginLeft: 10 }}>{describeNodes1} people</div>
          <div style={{ marginLeft: 10 }}>{describeNodes2} relations</div>
        </div>
        <div>
          <label>相关操作：</label>
          <Checkbox checked={subnet_selection} onChange={this.changeModle1}>子网选取</Checkbox>
          <Checkbox checked={suspension_adjustment} onChange={this.changeModle2}>暂停调整</Checkbox>
          <Checkbox checked={two_paths} onChange={this.changeModle3}>两点路径</Checkbox>
          <Checkbox checked={continuous_path} onChange={this.changeModle4}>连续路径</Checkbox>
          <Checkbox checked={single_extension} onChange={this.changeModle5}>单点扩展</Checkbox>
          <label>过滤器：</label>
          <Select defaultValue="h-Index>0" style={{ width: 120 }} onChange={this.IndexChange}>
            {this.activities.map((act) => {
              return (
                <Option key={act} value={act}>{act}</Option>
              );
            })}
          </Select>
        </div>
        <div id="rgvis" style={{ background:'black', width: EgoWidth, height: EgoHeight, border: '1px solid #eee' }} />
      </div>
    );
  }

}

export default connect()(RelationGraph);
