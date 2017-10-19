/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Switch, Pagination, Tag, Tooltip } from 'antd';
import { routerRedux, withRouter } from 'dva/router';
import * as d3 from 'd3';
import { sysconfig } from 'systems';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import bridge from 'utils/next-bridge';
import { PublicationList } from '../../components/publication/index';
import BarChart from './bar-chart/index';
import Brush from './time-brush/index';
import styles from './heat.less';

const tc = applyTheme(styles);

const a = d3.rgb(255, 255, 255);    //红色
const b = d3.rgb(255, 127, 80);    //绿色
const compute = d3.interpolate(a, b);
const begin = 2013; // todo 拖动时间轴来确定
const end = 2016;
const barColor = {
  pub: '#ba7cc5',
  expert: '#229ea6',
};

const rectTooltip = {
  heat: '中美对比',
  expert: '领域专家',
  pub: '领域论文',
}
@withRouter
class Heat extends React.Component {
  state = {
    visibleModal: false,
    dateDuring: [],
  };
  yHeight = 0; // 图的高
  xWidth = 0; // 图的宽
  heatNum = []; // 热力值数组
  barNum = []; //bar值数组
  title = '';
  yNode = [];
  xNode = [];
  modalWidth = 800; // modal 默认宽
  modalType = '';
  modalTitle = '';
  comPer = {}; // 研究员
  comPub = {}; // 论文
  comCit = {}; // 影响力
  nationList = [];
  orgList = [];
  personList = [];
  pubList = [];

  heatInfo = [];
  barInfo = [];


  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'crossHeat/getCrossTree',
      payload: { id },
    });
  }

  componentWillUpdate(nextProps, nextState) {
    this.barNum = [];
    this.heatNum = [];
    const npCrossTree = nextProps.crossHeat.crossTree;
    const tpCrossTree = this.props.crossHeat.crossTree;
    const nsDateDuring = nextState.dateDuring;
    const tsDateDuring = this.state.dateDuring;
    const crossTree = nextProps.crossHeat.crossTree;
    if (npCrossTree !== tpCrossTree || nsDateDuring !== tsDateDuring) {
      if (crossTree !== null) {
        d3.select('#heat').selectAll('g').remove(); // 删除原来当图
        d3.select('#xTree').selectAll('g').remove();
        this.yNode = this.getNodeChildren(crossTree.queryTree1, []);
        this.xNode = this.getNodeChildren(crossTree.queryTree2, []);
        this.yHeight = this.yNode.length * 62;
        this.xWidth = this.xNode.length * 62;
        this.title = crossTree.queryTree1.name + ' & ' + crossTree.queryTree2.name;
        this.createYTree(crossTree.queryTree1, this.yHeight);
        this.createXTree(crossTree.queryTree2, this.yHeight, this.xWidth);
      }
      if (nsDateDuring[0]) { // 获取交叉信息
        this.getDomainInfo(crossTree.queryTree1, crossTree.queryTree2, nextState.dateDuring);
      }
    }
    const domainList = this.props.crossHeat.domainList; // 热力值改变
    if (domainList !== nextProps.crossHeat.domainList) {
      this.createRect(nextProps.crossHeat.domainList);
    }
    const domainAllInfo = this.props.crossHeat.domainAllInfo; // modal值改变
    if (domainAllInfo !== nextProps.crossHeat.domainAllInfo) {
      this.changeComData(nextProps.crossHeat.domainAllInfo);
    }
  }

  changeComData = (domainInfo) => {
    const uPerCount = domainInfo.USAPersonCount;
    const cPerCount = domainInfo.ChinaPersonCount;
    const oPerCount = (domainInfo.personCount) - uPerCount - cPerCount;

    const uPubCount = domainInfo.USAPubCount;
    const cPubCount = domainInfo.ChinaPubCount;
    const oPubCount = (domainInfo.pubCount) - uPubCount - cPubCount;

    const uCitCount = domainInfo.USACitationCount;
    const cCitCount = domainInfo.ChinaCitationCount;
    const oCitCount = (domainInfo.pubCitationSum) - uCitCount - cCitCount;

    const title = ['中国', '美国', '其他'];
    this.nationList = domainInfo.nationCitationList;
    this.orgList = domainInfo.orgCitationList;
    this.comPer = { title, num: [cPerCount, uPerCount, oPerCount] };
    this.comPub = { title, num: [cPubCount, uPubCount, oPubCount] };
    this.comCit = { title, num: [cCitCount, uCitCount, oCitCount] };
    this.personList = domainInfo.personList;
    this.pubList = domainInfo.pubList;
  }

// 绘制rect 图
  createRect = (domainList) => {
    if (domainList) {
      this.heatInfo = [];
      this.barInfo = [];
      domainList.map((domain, num) => { // 将json 转换成d3格式
        num += 1;
        const yLength = this.yNode.length;
        const x = Math.ceil(num / yLength); // 第几行
        const y = num - (yLength * (x - 1));// 第几列

        const temPower = domain.data ? domain.data.power : -1; //热力值
        const temPersonCount = domain.data ? domain.data.personCount : 0;// 默认专家
        const temPubCount = domain.data ? domain.data.pubCount : 0;// 默认论文

        this.heatNum.push(temPower);
        this.barNum.push(temPersonCount, temPubCount);
        const first = domain.first;
        const second = domain.second;
        this.heatInfo.push({ x, y, key: 'heat', power: temPower, first, second }); // 格式heat json 数据
        const startY = (y - 1) * 2;
        this.barInfo.push( // 格式bar json 数据
          { x, y: startY + 1, h: temPersonCount, key: 'expert', first, second },
          { x, y: startY + 2, h: temPubCount, key: 'pub', first, second },
        );
        return true;
      });
      this.createAxis(this.heatInfo, this.barInfo);
    }
  };
// 获取 DomainInfo
  getDomainInfo = (yTree, xTree, date) => {
    const yNode = this.getNodeChildren(yTree, []);
    const xNode = this.getNodeChildren(xTree, []);
    this.props.dispatch({
      type: 'crossHeat/getDomainInfo',
      payload: { begin: date[0], end: date[1], dt: this.getCrossNode(xNode, yNode) },
    });
  };
// 对两数组交叉  返回矩阵
  getCrossNode = (xNode, yNode) => {
    const crossList = [];
    xNode.map((xVal) => {
      yNode.map((yVal) => {
        crossList.push({ first: xVal, second: yVal });
        return true;
      });
      return true;
    });
    return crossList;
  }

// 获取所有节点 扁平化
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
// 绘制 rect 和bar
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
      .style('cursor', d => (d.power > 0 ? 'pointer' : 'default'))
      .attr('x', d => d.x * cellSize)
      .attr('y', d => d.y * cellSize)
      .attr('fill', (d) => {
        if (d.power > 0) { // 大于-1 表示计划完成
          const formatPower = d.power / maxHeatNum;
          let hv = formatPower.toFixed(1);
          hv = formatPower < 0.1 ? 0.1 : hv;
          return compute(hv);
        }
        if (d.power === 0) {
          return '#fff';
        }
        if (d.power === -1) {
          return '#f8f8f8';
        }
      })
      .attr('transform', `translate(${260},${-62})`);

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
      .attr('width', (d) => { // bar的宽
        const fWidth = d.h * wMin;
        return (fWidth > 0 && fWidth < 5) ? 5 : (fWidth > 55 ? 55 : fWidth);// 设置bar 默认宽度
      })
      .style('cursor', 'pointer')
      .attr('height', barVar)
      .attr('x', d => d.x * cellSize)
      .attr('y', (d) => {
        const num = parseInt((d.y - 1) / 2);
        const startX = num * 38;
        const tempNum = d.key === 'pub' ? 12 : 6;
        return tempNum + startX;
      })
      .attr('fill', d => barColor[d.key])
      .attr('transform', d => 'translate(260,' + d.y * barVar + ')')

    // 添加文字
    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#ff0000')
      .selectAll('text')
      .data(barInfo)
      .enter()
      .append('text')
      .attr('x', (d) => {
        let xStart = d.h * wMin;
        // 开始 最小6 最大 20
        xStart = (xStart > 0 && xStart <= 6) ? 6 : (xStart > 25 ? 20 : xStart);
        return (d.x * cellSize) + xStart;
      })
      .attr('y', (d) => {
        const num = parseInt((d.y - 1) / 2);
        const startX = num * 38;
        const tempNum = d.key === 'pub' ? 12 : 6;
        return tempNum + startX;
      })
      .attr('dy', '.75em')
      .style('cursor', 'pointer')
      .text(d => (d.h > 0 ? d.h : ''))
      .attr('transform', d => 'translate(260,' + d.y * barVar + ')')
      .on('mouseover', d => this.showTooltip(d))
      .on('mousedown', d => this.showModal(d))
      .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());
    //  点击事件
    svg.selectAll('rect')
      .on('mousedown', d => this.showModal(d))
      .on('mouseover', d => this.showTooltip(d))
      .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());
  }

// 展示tooltip
  showTooltip = (d) => {
    if (d.power > 0 || d.h > 0) {
      const toolTipTop = event.pageY + 20;
      const toolTipLeft = event.pageX + 15;
      // y 用d3画图
      const tooltipVal = rectTooltip[d.key];
      d3.select('#tooltip').selectAll('div').remove();
      d3.selectAll('#tooltip')
        .append('div')
        .attr('class', styles.tooltipDis)
        .style('top', toolTipTop + 'px')
        .style('left', toolTipLeft + 'px')
        .text(tooltipVal);
    }
  }

// 用户点击bar rect text事件
  showModal = (d) => {
    const domain1 = d.first;
    const domain2 = d.second;
    const modalType = d.key;// modal 展示类容类型
    const show = !(modalType === 'heat' && d.power < 1); // modal是否展示
    if (show) {
      this.modalTitle = domain1 + ' & ' + domain2;
      this.modalType = modalType;
      this.setState({ visibleModal: true });
      this.props.dispatch({
        type: 'crossHeat/getDomainAllInfo',
        payload: { domain1, domain2, begin, end },
      }).then(() => {
        this.getPubAndPerson(modalType, 0, 10);
      });
    }
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
      .attr('class', d => `node${d.children ? ' node--internal' : ' node--leaf'}`)
      .attr('transform', d => `translate(${d.y},${d.x})`);

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
      .text(d => d.data.name);

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', -10)
      .style('text-anchor', d => (d.parent ? 'middle' : 'start'))
      .text(d => d.data.name);
  }
//=====xstree===================
  createXTree = (xData, yHeight, xWidth) => {
    const svg = d3.selectAll('#xTree')
      .append('g')
      .attr('transform', 'translate(340,-' + (yHeight - 182) + ')');
    const xTree = d3.cluster().size([xWidth, 180])
      .separation(() => 1);
    const rootX = d3.hierarchy(xData, d => d.children);
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
        let y = d.y;
        let x = d.y;
        if (d.data.children.length === 0 && d.depth === 1) {
          x = y - 120;
          y = y - 80;
        }
        // 将树翻转
        return "M" + d.parent.x + "," + (yHeight - d.parent.y)
          + "C" + d.parent.x + "," + (yHeight - (x + d.parent.y) / 2)
          + " " + d.x + "," + (yHeight - (y + d.parent.y) / 2)
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
      .attr('writing-mode', () => 'tb')
      .text(d => d.data.name);

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', 10)
      .style('text-anchor', ' start')
      .attr('writing-mode', () => 'tb')
      .text(d => d.data.name);
  }

// modal 消失
  hideModal = () => this.setState({ visibleModal: false });
// 获取时间段，通过时间轴
  getLocalYear = date => this.setState({ dateDuring: date });

//分页
  onChangePage = (page, pageSize) => {
    this.getPubAndPerson(this.modalType, (page - 1) * pageSize, page * pageSize);
  }
// 获取modal 中论文或者专家信息
  getPubAndPerson = (type, beginSize, endSize) => {
    const domainInfo = this.props.crossHeat.domainAllInfo;
    if (domainInfo && type === 'expert') {
      const personList = domainInfo.personList.slice(beginSize, endSize);
      this.props.dispatch({
        type: 'crossHeat/getDomainExpert',
        payload: { ids: personList },
      });
    }
    if (domainInfo && type === 'pub') {
      const pubList = domainInfo.pubList.slice(beginSize, endSize);
      this.props.dispatch({
        type: 'crossHeat/getDomainPub',
        payload: { ids: pubList },
      });
    }
  }

  clearHeatZero = (value) => {
    // console.log(value);
    // console.log(this.heatInfo);
    // console.log('ynode', this.yNode);
    // console.log('xnode', this.xNode);

    //获取x轴所有为0
    //获取y轴所有为0
  };
  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/index',
    }));
  }


  render() {
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadDomain = this.props.loading.effects['crossHeat/getDomainAllInfo'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadDomainInfo = this.props.loading.effects['crossHeat/getDomainInfo'];
    const experts = this.props.crossHeat.experts;
    return (
      <Layout searchZone={[]} contentClass={tc(['heat'])} showNavigator={false}>
        <div >
          <Spinner loading={loadTree || loadDomainInfo} size="large" />
          <div className={styles.actionBar}>
            <span className={styles.title}>{this.title}</span>
            <span className={styles.back} onClick={this.goBack}>返回</span>
          </div>
          <div>
            {/*<Switch checkedChildren="开" onChange={this.clearHeatZero} unCheckedChildren="关" />*/}
            {/*<Button type="primary" onClick={this.toggle}>未来三年</Button>*/}
          </div>
          <div id="tooltip"></div>
          {this.xWidth > 0 &&
          <div>
            <Brush getLocalYear={this.getLocalYear} xWidth={this.xWidth} />
          </div>
          }
          <div style={{ margin: 0 }}>
            <svg id="heat" width={this.xWidth + 345} height={this.yHeight}
                 style={{ marginRight: 200 }} />
          </div>
          <div style={{ margin: 0, padding: 0 }}>
            <svg id="xTree" width={this.xWidth + 340} height="500"></svg>
          </div>
          <Modal
            title={this.modalTitle}
            className={styles.heatModal}
            width={this.modalWidth}
            visible={this.state.visibleModal}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            footer={null}
          >
            <div className={styles.modalContent}>
              <Spinner className={styles.heatSpinner}
                       loading={loadDomain || loadPub || loadExpert}
                       size="large" />
              {this.modalType === 'pub' &&
              <div>
                <PublicationList pubs={this.props.crossHeat.pubs} showLabels={false} />
                <Pagination className={styles.pagination} onChange={this.onChangePage}
                            defaultCurrent={1} defaultPageSize={10}
                            total={this.personList.length} />
              </div>
              }
              { this.modalType === 'expert' &&
              <div>
                <PersonList persons={bridge.toNextPersons(experts)} />
                <Pagination className={styles.pagination} onChange={this.onChangePage}
                            defaultCurrent={1} defaultPageSize={10} total={this.pubList.length} />
              </div>
              }
              {this.modalType === 'heat' &&
              <div>
                <div>
                  <h4>中美研究人员对比</h4>
                  <BarChart id="expert" compareVal={this.comPer} />
                </div>
                <div>
                  <h4>中美研究论文对比</h4>
                  <BarChart id="pub" compareVal={this.comPub} />
                </div>
                <div>
                  <h4>中美论文影响对比</h4>
                  <BarChart id="citation" compareVal={this.comCit} />
                </div>
                { this.nationList.length > 0 &&
                <div>
                  <h4>全球前10个国家</h4>
                  <div>
                    {this.nationList.slice(0, 10).map((item, index) => {
                      return (
                        <Tooltip key={index} placement="top" title={item.nation}>
                          <a href="#">
                            <Tag className={styles.antTag}>{item.nation}</Tag>
                          </a>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                }
                { this.orgList.length > 0 &&
                <div>
                  <h4>全球前20个机构</h4>
                  <div>
                    {this.orgList.slice(0, 20).map((item, index) => {
                      return (
                        <Tooltip key={index} placement="top" title={item.org}>
                          <a href="#">
                            <Tag key={index} className={styles.antTag}>
                              {item.org.length > 110 ? item.org.slice(0, 110) + '...' : item.org}
                            </Tag>
                          </a>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                }
              </div>
              }
            </div>
          </Modal>
        </div>
      </Layout>
    );
  }
}
export default connect(({ crossHeat, app, loading }) => ({ crossHeat, app, loading, }))(Heat);

