/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Tag, Tooltip } from 'antd';
import { routerRedux, withRouter } from 'dva/router';
import * as d3 from 'd3';
import { sysconfig } from 'systems';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import { PublicationList } from '../../components/publication/index';
import GroupedBar from './grouped-bar/index';
import Brush from './time-brush/index';
import styles from './heat.less';

const a = d3.rgb(255, 255, 255);    //红色
const b = d3.rgb(255, 127, 80);    //绿色
const compute = d3.interpolate(a, b);
const begin = 2013; // todo 拖动时间轴来确定
const end = 2016;
const barColor = {
  pub: '#ba7cc5',
  expert: '#229ea6',
};
@withRouter
class Heat extends React.Component {
  state = {
    visibleModal: false,
    modalType: '',
    yHeight: 0,
    xWidth: 0,
    modalWidth: 0,
    modalTitle: '',
  };

  heatNum = [];
  barNum = [];
  yNode = [];
  xNode = [];
  componentWillMount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: true });
  };

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'crossHeat/getCrossTree',
      payload: { id },
    });
  }

  componentWillUpdate(nextProps) {
    if (nextProps.crossHeat.crossTree !== this.props.crossHeat.crossTree) {
      const crossTree = nextProps.crossHeat.crossTree;

      if (crossTree !== null) {
        this.yNode = this.getNodeChildren(crossTree.queryTree1, []);
        this.xNode = this.getNodeChildren(crossTree.queryTree2, []);
        const yHeight = this.yNode.length * 62;
        const xWidth = this.xNode.length * 62;
        this.setState({ yHeight, xWidth });
        this.createYTree(crossTree.queryTree1, yHeight);
        this.createXTree(crossTree.queryTree2, yHeight, xWidth);
        this.changeData(crossTree.queryTree1, crossTree.queryTree2);
      }
    }
    const domainList = this.props.crossHeat.domainList;
    if (domainList !== null) {
      const heatInfo = [];
      const barInfo = [];
      domainList.map((domain, num) => {
        num += 1;
        const yLength = this.yNode.length;
        const x = Math.ceil(num / yLength);
        const y = num - (yLength * (x - 1));
        this.heatNum.push(domain.data.power);
        this.barNum.push(domain.data.personCount, domain.data.pubCount);
        heatInfo.push({
          x,
          y,
          key: 'heat',
          power: domain.data.power,
          first: domain.first,
          second: domain.second,
        });
        const startY = (y - 1) * 2;
        barInfo.push(
          {
            x, y: startY + 1, h: domain.data.personCount, key: 'expert', first: domain.first,
            second: domain.second,
          },
          {
            x, y: startY + 2, h: domain.data.pubCount, key: 'pub', first: domain.first,
            second: domain.second,
          },
        );
        return true;
      });
      this.createAxis(heatInfo, barInfo);
    }
  }

  // 对json 数据格式化  返回矩阵
  changeData = (yTree, xTree) => {
    const yNode = this.getNodeChildren(yTree, []);
    const xNode = this.getNodeChildren(xTree, []);
    const heatVal = [];
    const crossList = [];
    xNode.map((xVal) => {
      yNode.map((yVal) => {
        crossList.push({ first: xVal, second: yVal });
        return true;
      });
      return true;
    });
    this.props.dispatch({
      type: 'crossHeat/getDomainInfo',
      payload: { begin, end, dt: crossList },
    });
    return heatVal;
  };

  getNodeChildren = (tree, children) => {
    if (tree.children.length > 0) {
      tree.children.map((item) => {
        this.getNodeChildren(item, children);
        return true;
      });
    } else {
      children.push(tree.name);
    }
    return children;
  }
  createAxis = (heatVal, barInfo) => {
    const maxHeatNum = d3.max(this.heatNum);
    const svg = d3.selectAll('#heat')
      .append('g')
      .attr('transform', 'translate(20,0)');
    // 背景 热力图
    const cellSize = 62;
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .selectAll('rect')
      .data(heatVal)
      .enter()
      .append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('x', (d) => {
        return d.x * cellSize;
      })
      .attr('y', (d) => {
        return d.y * cellSize;
      })
      .attr('fill', (d) => {
        const formatPower = d.power / maxHeatNum;
        let hv = formatPower.toFixed(1);
        if (formatPower > 0 && formatPower < 0.1) {
          hv = 0.1;
        }
        return compute(hv);
      })
      .attr('transform', `translate(${260},${-62})`)

    // 条形统计图
    const barVar = 12;
    const wMax = d3.max(this.barNum);
    const wMin = 62 / wMax;
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .selectAll('rect')
      .data(barInfo)
      .enter()
      .append('rect')
      .attr('width', (d) => {
        return d.h * wMin;
      })
      .attr('height', barVar)
      .attr('x', (d) => {
        return d.x * cellSize;
      })
      .attr('y', (d) => {
        const num = parseInt((d.y - 1) / 2);
        const startX = num * 38;
        return 10 + startX;
      })
      .attr('fill', (d) => {
        return barColor[d.key];
      })
      .attr('transform', (d, i) => {
        return 'translate(260,' + d.y * barVar + ')';
      })

    // 添加文字
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#ff0000')
      .selectAll('text')
      .data(barInfo)
      .enter()
      .append('text')
      .attr("x", (d) => {
        let xStart = d.h * wMin;
        if (xStart > 30) {
          xStart = 25;
        }
        return d.x * cellSize + xStart;
      })
      .attr("y", (d) => {
        const num = parseInt((d.y - 1) / 2);
        const startX = num * 38;
        return 10 + startX;
      })
      .attr('dy', '.75em')
      .text((d) => {
        if (d.h > 0) {
          return d.h;
        }
      })
      .attr('transform', (d, i) => {
        return 'translate(260,' + d.y * barVar + ')';
      })


    //  点击事件
    svg.selectAll('rect').on('click', (d) => {
      const that = this;
      const domain1 = d.first;
      const domain2 = d.second;
      const key = d.key;
      let modalWidth = 600;
      if (key === 'expert') {
        modalWidth = 800;
      }
      let show = true;
      if (key === 'heat' && d.power < 1) { // 对热力0进行过滤
        show = false;
      }
      if (show) {
        this.props.dispatch({
          type: 'crossHeat/getDomainAllInfo',
          payload: { domain1, domain2, begin, end },
        }).then(() => {
          const domainInfo = this.props.crossHeat.domainAllInfo;
          if (domainInfo && key === 'expert') {
            let personList = domainInfo.personList;
            // todo 通过分页实现
            if (personList.length > 10) {
              personList = personList.slice(0, 10);
            }
            this.props.dispatch({
              type: 'crossHeat/getDomainExpert',
              payload: { ids: personList },
            });
          }
          if (domainInfo && key === 'pub') {
            let pubList = domainInfo.pubList;
            // todo 通过分页实现
            if (pubList.length > 5) {
              pubList = pubList.slice(0, 5);
            }
            this.props.dispatch({
              type: 'crossHeat/getDomainPub',
              payload: { ids: pubList },
            });
          }
          that.setState({
            modalType: key,
            visibleModal: true,
            modalWidth,
            modalTitle: domain1 + ' + ' + domain2,
          });
        });
      }
    });
  }

  createYTree = (yData, yHeight) => {
    const height = yHeight;
    // 创建画板
    const svg = d3.selectAll('#heat')
      .append('g')
      .attr('transform', 'translate(20,0)');
    //========yTree==================
    const yTree = d3.cluster().size([height, 320])
      .separation((a, b) => {
        return 1;
      });

    const rootY = d3.hierarchy(yData, (d) => {
      return d.children;
    });
    rootY.x0 = height;
    rootY.y0 = 0;
    const yTreeData = yTree(rootY);
    const yNodes = yTreeData.descendants();
    const yLinks = yTreeData.descendants().slice(1);

    // Draw every datum a line connecting to its parent.
    const yLink = svg.selectAll('.link')
      .data(yLinks)
      .enter().append('path')
      .attr('class', styles.link)
      .attr('d', (d) => {
        return `M${d.y},${d.x
          }C${d.parent.y + 100},${d.x
          } ${d.parent.y + 100},${d.parent.x
          } ${d.parent.y},${d.parent.x}`;
      });

    const yNode = svg.selectAll('.node')
      .data(yNodes)
      .enter().append('g')
      .attr('class', (d) => {
        return `node${d.children ? ' node--internal' : ' node--leaf'}`;
      })
      .attr('transform', (d) => {
        return `translate(${d.y},${d.x})`;
      });

    // 圆节点.
    yNode.append('circle')
      .attr('class', styles.nodeCircle)
      .attr('r', 4.5);

    // 叶子几点
    const leafNodeG = svg.selectAll('.node--leaf')
      .append('g')
      .attr('class', 'node--leaf-g')
      .attr('transform', `translate(${8},${-13})`);

    leafNodeG.append('text')
      .attr('dy', 18)
      .attr('dx', -20)
      .style('text-anchor', 'end')
      .text((d) => {
        return d.data.name;
      });

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', -10)
      .style('text-anchor', 'middle')
      .text((d) => {
        return d.data.name;
      });
  }
  //=====xstree===================
  createXTree = (xData, yHeight, xWidth) => {
    const svg = d3.selectAll('#xTree')
      .append('g')
      .attr('transform', 'translate(340,-' + (yHeight - 182) + ')');
    const xTree = d3.cluster().size([xWidth, 180])
      .separation((a, b) => {
        return 1;
      });
    const rootX = d3.hierarchy(xData, (d) => {
      return d.children;
    });
    rootX.x0 = 0;
    rootX.y0 = 0;
    const xTreeData = xTree(rootX);
    const xNodes = xTreeData.descendants();
    const xLinks = xTreeData.descendants().slice(1);

    const xLink = svg.selectAll('.link')
      .data(xLinks)
      .enter().append('path')
      .attr('class', styles.link)
      .attr('d', (d) => {
        return "M" + d.parent.x + "," + (yHeight - d.parent.y)
          + "C" + d.parent.x + "," + (yHeight - (d.y + d.parent.y) / 2)
          + " " + d.x + "," + (yHeight - (d.y + d.parent.y) / 2)
          + " " + d.x + "," + (yHeight - d.y);
      });

    const xNode = svg.selectAll('.node')
      .data(xNodes)
      .enter().append('g')
      .attr('class', (d) => {
        return `node${d.children ? ' node--internal' : ' node--leaf'}`;
      })
      .attr('transform', (d) => {
        return "translate(" + d.x + "," + (yHeight - d.y) + ")";
      });

    // 圆节点.
    xNode.append('circle')
      .attr('class', styles.nodeCircle)
      .attr('r', 4.5);

    const leafNodeG = svg.selectAll('.node--leaf')
      .append('g')
      .attr('class', 'node--leaf-g')
      .attr('transform', `translate(${8},${-13})`);

    leafNodeG.append('text')
      .attr('dy', 18)
      .attr('dx', -20)
      .style('text-anchor', 'start')
      .attr('writing-mode', (d) => {
        return 'tb';
      })
      .text((d) => {
        return d.data.name;
      });

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', 10)
      .style('text-anchor', ' start')
      .attr('writing-mode', (d) => {
        return 'tb';
      })
      .text((d) => {
        return d.data.name;
      });
  }

  hideModal = () => {
    this.setState({
      visibleModal: false,
    });
  }

  render() {
    const domainInfo = this.props.crossHeat.domainAllInfo;
    let eData = [];
    let pData = [];
    let cData = [];
    let nationList = [];
    let orgList = [];
    if (domainInfo) {
      eData = [{ one: domainInfo.USAPersonCount, two: domainInfo.ChinaPersonCount }];
      pData = [{ one: domainInfo.USAPubCount, two: domainInfo.ChinaPubCount }];
      cData = [{ one: domainInfo.USACitationCount, two: domainInfo.ChinaPubCount }];
      nationList = domainInfo.nationCitationList;
      orgList = domainInfo.orgCitationList;
    }

    // TODO 传入数组没有成功
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const expertBase = 'aminer';
    const expertBaseId = 'aminer';

    return (
      <div className={styles.heat}>
        <div>
          <Brush />
        </div>
        <div style={{ margin: 0, }}>
          <svg id="heat" width={this.state.xWidth + 345} height={this.state.yHeight} />
        </div>
        <div style={{ margin: 0, padding: 0 }}>
          <svg id="xTree" width={this.state.xWidth + 340} height="500"></svg>
        </div>
        <Modal
          className={styles.heatModal}
          title={this.state.modalTitle}
          width={this.state.modalWidth}
          visible={this.state.visibleModal}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={null}
          okText="确认"
          cancelText="取消"
        >
          <div className={styles.modalContent}>
            <Spinner className={styles.heatSpinner} loading={loadPub} size="large" />
            {this.state.modalType === 'pub' &&
            <PublicationList pubs={this.props.crossHeat.pubs} showLabels={false} />
            }
            <Spinner className={styles.heatSpinner} loading={loadExpert} size="large" />
            { this.state.modalType === 'expert' &&
            <PersonList
              persons={this.props.crossHeat.experts}
              user={this.props.app.user}
              titleRightBlock={sysconfig.PersonList_TitleRightBlock}
              rightZoneFuncs={sysconfig.PersonList_RightZone}
              bottomZoneFuncs={sysconfig.PersonList_BottomZone}
              didMountHooks={sysconfig.PersonList_DidMountHooks}
              UpdateHooks={sysconfig.PersonList_UpdateHooks}
              expertBaseId={expertBaseId}
              expertBase={expertBase}
            />
            }
            {this.state.modalType === 'heat' &&
            <div>
              <div>
                <h4>中美研究人员对比</h4>
                <GroupedBar id="expert" compareVal={eData} />
              </div>
              <div>
                <h4>中美研究论文对比</h4>
                <GroupedBar id="pub" compareVal={pData} />
              </div>
              <div>
                <h4>中美论文影响对比</h4>
                <GroupedBar id="citation" compareVal={cData} />
              </div>
              <div>
                <h4>全球前10个国家</h4>
                <div>
                  {nationList.length > 0 && nationList.slice(0, 10).map((item, index) => {
                    return (
                      <Tooltip key={index} placement="top" title={item.nation}>
                        <a href="#"> <Tag className={styles.antTag}>{item.nation}</Tag></a>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4>全球前20个机构</h4>
                <div>
                  {orgList.length > 0 && orgList.slice(0, 10).map((item, index) => {
                    return (
                      <Tooltip key={index} placement="top" title={item.org}>
                        <a href="#"><Tag key={index} className={styles.antTag}>
                          {item.org.length > 80 ?
                            item.org.slice(0, 80) + '...' : item.org
                          }
                        </Tag></a>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
            }
          </div>
        </Modal>
      </div>

    );
  }
}
export default connect(({ crossHeat, app, loading }) => ({
  crossHeat,
  app,
  loading,
}))(Heat);

