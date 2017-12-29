/* eslint-disable no-restricted-globals*/
/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, Switch, Tabs, Pagination, Tag, Tooltip } from 'antd';
import { routerRedux, withRouter } from 'dva/router';
import { sysconfig } from 'systems';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import { Auth, RequireRes } from 'hoc';
import { ensure } from 'utils';
import bridge from 'utils/next-bridge';
import { PublicationList } from '../../components/publication/index';
import Brush from './time-brush/index';
import CrossStatistics from './statistics/index';
import CrossContrast from './contrast/index';
import styles from './report.less';

const tc = applyTheme(styles);
const TabPane = Tabs.TabPane;
const barColor = {
  pub: '#92D1FF',
  expert: '#8EC267',
};

const rectTooltip = {
  heat: '中美对比',
  expert: '学科专家',
  pub: '学科论文',
  zero: '无交叉信息',
  minus: '正在分析...',
};
const localDate = new Date();
const dateYear = localDate.getFullYear();
const sYear = dateYear - 10;

@withRouter
@Auth
@RequireRes('d3')
class CrossReport extends React.Component {
  state = {
    visibleModal: false,
    dateDuring: [],
    defaultTab: 'expert',
    nullBtn: true,
    isHistory: true,
    isAuto: true,
    yHeight: 0, // 图的高
    xWidth: 0, // 图的宽
    yearBuring: [], // 时间段
    pubCurrent: 1,
    personCurrent: 1,
  }

  heatNum = []; // 热力值数组
  barNum = []; //bar值数组
  title = '';
  modalWidth = 800; // modal 默认宽
  modalType = '';
  domain1 = '';
  domain2 = '';
  first10Authors = [];
  first10Pubs = [];
  expertList = [];
  pubList = [];
  countYear = 0;
  timer = 0;


  crossInfo = null;
  nodeData = null;
  crossingFields = [];
  years = [];


  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'crossHeat/getCrossFieldById',
      payload: { id },
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { isAuto } = this.state;
    this.barNum = [];
    this.heatNum = [];
    let xNode = [];
    let yNode = [];
    const { crossTree, crossInfo, experts, pubs, predict, modalInfo, autoDomainInfo, pageInfo } = this.props.crossHeat;
    const nCrossTree = nextProps.crossHeat.crossTree;
    if (nCrossTree !== null) {
      xNode = this.getNodeChildren(nCrossTree.queryTree2, []);
      yNode = this.getNodeChildren(nCrossTree.queryTree1, []);
      this.nodeData = this.getCrossFieldNode(xNode, yNode);
      this.title = `${nCrossTree.queryTree1.name} & ${nCrossTree.queryTree2.name}`;
    }
    if (nCrossTree !== crossTree) { // 树
      this.createBasic(nCrossTree.queryTree1, nCrossTree.queryTree2, xNode, yNode);
    }
    const nDate = nextState.dateDuring;
    const sDate = this.state.dateDuring;
    if (isAuto && sDate && (nDate[0] !== sDate[0] || nDate[1] !== sDate[1])) { // 时间发生改变
      this.getDomainInfo(nCrossTree.queryTree1, nCrossTree.queryTree2, nextState.dateDuring);
    }
    if (crossInfo !== nextProps.crossHeat.crossInfo) { // 热力值改变
      this.crossInfo = nextProps.crossHeat.crossInfo;
      this.createRect(this.crossInfo.data, yNode.length);
    }
    if (experts !== nextProps.crossHeat.experts) { // 获取专家
      this.expertList = nextProps.crossHeat.experts;
    }
    if (pubs !== nextProps.crossHeat.pubs) { // 获取论文
      this.pubList = nextProps.crossHeat.pubs;
    }
    if (pageInfo !== nextProps.crossHeat.pageInfo) { // 分页
      const info = nextProps.crossHeat.pageInfo;
      this.first10Authors = info.authors;
      this.first10Pubs = info.pubs;
      this.getPubPerson(this.modalType, this.first10Authors, this.first10Pubs);
    }
    if (predict !== nextProps.crossHeat.predict) { // 预测
      this.createRect(nextProps.crossHeat.predict, yNode.length);
    }
    if (modalInfo !== nextProps.crossHeat.modalInfo) { // modal info
      const info = nextProps.crossHeat.modalInfo;
      this.first10Authors = info.authors.top10;
      this.first10Pubs = info.pubs.top10;
      this.getPubPerson(this.modalType, this.first10Authors, this.first10Pubs);
    }
    const nAutoDomainInfo = nextProps.crossHeat.autoDomainInfo;
    if (autoDomainInfo !== nAutoDomainInfo && nAutoDomainInfo.length > 0) { // autoDomainInfo
      this.startAutoShow(nAutoDomainInfo, yNode);
    }
  }


// 获取时间段，通过时间轴
  getLocalYear = date => this.setState({ dateDuring: date });
// 重新创建原图
  createBasic = (yTree, xTree, xNode, yNode) => { // 删除原来当图
    ensure('d3', (d3) => {
      d3.select('#heat').selectAll('g').remove();
      d3.select('#xTree').selectAll('g').remove();
      d3.select('#yTree').selectAll('g').remove();
      const yHeight = yNode.length * 62;
      const xWidth = xNode.length * 62;
      this.setState({ yHeight, xWidth });
      this.createYTree(yTree, yHeight, d3);
      this.createXTree(xTree, yHeight, xWidth, d3);
    });
  };
// 绘制rect 图
  createRect = (domainList, yLength) => {
    if (domainList) {
      ensure('d3', (d3) => {
        d3.select('#heat').selectAll('g').remove();
        const changeData = this.domainChange(domainList, yLength);
        this.heatNum = changeData.heatNum;
        this.barNum = changeData.barNum;
        this.createAxis(changeData.heatInfo, changeData.barInfo, d3);
      });
    }
  };

//  domain 数据转换成d3需要的格式
  domainChange = (domainList, yLength) => {
    const { nodeData } = this.getXYNode();
    const heatNum = [];
    const barNum = [];
    const heatInfo = [];
    const barInfo = [];
    const status = this.props.crossHeat.crossTree.completeStatus;
    domainList.map((domain, num) => { // 将json 转换成d3格式
      const first = nodeData[num]._1;
      const second = nodeData[num]._2;
      num += 1;
      const x = Math.ceil(num / yLength); // 第几行
      const y = num - (yLength * (x - 1));// 第几列
      const { heat, authorsCount, pubsCount } = domain;
      const temPower = status ? heat : (heat > 0 ? heat : -1); //热力值
      // 获取 两个节点
      heatNum.push(temPower);
      barNum.push(authorsCount, pubsCount);
      heatInfo.push({ x, y, key: 'heat', heat: temPower, first, second }); // 格式heat json 数据
      const startY = (y - 1) * 2;
      barInfo.push( // 格式bar json 数据
        { x, y: startY + 1, h: authorsCount, key: 'expert', first, second },
        { x, y: startY + 2, h: pubsCount, key: 'pub', first, second },
      );
      return true;
    });
    return { heatNum, barNum, heatInfo, barInfo };
  };
// 获取 DomainInfo
  getDomainInfo = (yTree, xTree, dateDuring) => {
    const yNode = this.getNodeChildren(yTree, []);
    const xNode = this.getNodeChildren(xTree, []);
    const crossingFields = this.getCrossFieldNode(xNode, yNode);
    const years = [];
    for (let i = dateDuring[0] + 1; i < dateDuring[1] + 1; i++) {
      years.push(i);
    }
    const op = 'meta';
    const method = 'overview';
    const withCache = false;
    const dt = { years, crossingFields, withCache, op };
    this.getAggregate(method, dt);
  };

// 对两数组交叉  返回矩阵
  getCrossFieldNode = (xNode, yNode) => {
    const crossList = [];
    xNode.map((xVal) => {
      yNode.map((yVal) => {
        crossList.push({ _1: yVal, _2: xVal });
        return true;
      });
      return true;
    });
    return crossList;
  };
// 获取所有节点 扁平化
  getNodeChildren = (tree, children) => {
    if (tree.children && tree.children.length > 0) {
      tree.children.map(item => this.getNodeChildren(item, children));
    } else {
      children.push(tree.name);
    }
    return children;
  };
// 绘制 rect 和bar
  createAxis = (heatVal, barInfo, d3) => {
    const a = d3.rgb(255, 255, 255); //红色
    const b = d3.rgb(255, 127, 80); //绿色
    const compute = d3.interpolate(a, b);
    const maxHeatNum = d3.max(this.heatNum);
    const svg = d3.selectAll('#heat')
      .append('g')
      .attr('transform', 'translate(-62,0)');
    // 背景 热力图
    const cellSize = 62;
    if (maxHeatNum) {
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .selectAll('rect')
        .data(heatVal)
        .enter()
        .append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .style('cursor', d => ((d.heat > 0 && this.state.isHistory) ? 'pointer' : 'default'))
        .attr('x', d => d.x * cellSize)
        .attr('y', d => d.y * cellSize)
        .attr('fill', (d) => {
          if (d.heat > 0) { // 大于-1 表示计划完成
            const formatPower = d.heat / maxHeatNum;
            const hv = formatPower.toFixed(1);
            const h = formatPower < 0.1 ? 0.1 : hv;
            return compute(h);
          }
          if (d.heat === 0) {
            return '#fff';
          }
          if (d.heat === -1) {
            return '#f8f8f8';
          }
        })
        .attr('transform', `translate(${0},${-62})`)
        .on('mouseover', d => this.showTooltip(d))
        .on('mousedown', d => this.showModal(d))
        .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());
    }


    // 条形统计图
    const barVar = 12;
    const wMax = Math.log(d3.max(this.barNum));
    if (wMax) {
      const wMin = 62 / wMax;
      svg.append('g')
        .attr('fill', 'none')
        .selectAll('rect')
        .data(barInfo)
        .enter()
        .append('rect')
        .attr('stroke', d => (d.key === 'pub' ? '#92D1FF' : '#8EC267'))
        .attr('width', (d) => { // bar的宽
          if (d.h && d.h > 0) {
            const fWidth = Math.log(d.h + 1) * wMin;
            return fWidth > 58 ? 58 : fWidth;// 设置bar 默认宽度
          }
        })
        .style('cursor', () => (this.state.isHistory ? 'pointer' : 'default'))
        .attr('height', barVar)
        .attr('x', d => d.x * cellSize)
        .attr('y', (d) => {
          const num = parseInt((d.y - 1) / 2);
          const startX = num * 38;
          const tempNum = d.key === 'pub' ? 12 : 6;
          return tempNum + startX;
        })
        .attr('fill', d => barColor[d.key])
        .attr('transform', d => `translate(0,${d.y * barVar})`)
        .on('mousedown', d => this.showModal(d))
        .on('mouseover', d => this.showTooltip(d))
        .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());

      // 添加文字
      svg.append('g')
        .selectAll('text')
        .data(barInfo)
        .enter()
        .append('text')
        .attr('x', (d) => {
          if (d.h && d.h > 0) {
            return (d.x * cellSize) + 4;
          }
        })
        .attr('y', (d) => {
          const num = parseInt((d.y - 1) / 2);
          const startX = num * 38;
          const tempNum = d.key === 'pub' ? 12 : 6;
          return tempNum + startX + 2;
        })
        .attr('dy', '.75em')
        .style('cursor', () => (this.state.isHistory ? 'pointer' : 'default'))
        .text(d => (d.h > 0 ? d.h : ''))
        .attr('transform', d => `translate(0,${d.y * barVar})`)
        .on('mouseover', d => this.showTooltip(d))
        .on('mousedown', d => this.showModal(d))
        .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());
    }
  };

  createYTree = (yData, yHeight, d3) => {
    const height = yHeight;
    // 创建画板
    const svg = d3.selectAll('#yTree')
      .append('g')
      .attr('transform', 'translate(20,0)');
    //========yTree==================
    const yTree = d3.cluster().size([height, 316])
      .separation(() => 1);

    const rootY = d3.hierarchy(yData, d => d.children);
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
      .style('cursor', 'pointer')
      .attr('class', 'test')
      .text(d => d.data.name)
      .on('mousedown', (node) => {
        this.leafNodeClick('y', [node.data.name]);
      });

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', -10)
      .style('text-anchor', d => (d.parent ? 'middle' : 'start'))
      .text(d => d.data.name);
    // 叶子节点点击事件
  };
//=====xstree===================
  createXTree = (xData, yHeight, xWidth, d3) => {
    const svg = d3.selectAll('#xTree')
      .append('g')
      .attr('transform', `translate(340,-${yHeight - 186})`);
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
          y -= 80;
        }
        // 将树翻转
        return `M${d.parent.x},${yHeight - d.parent.y
          }C${d.parent.x},${yHeight - (x + d.parent.y) / 2
          } ${d.x},${yHeight - (y + d.parent.y) / 2
          } ${d.x},${yHeight - d.y}`;
      });

    const xNode = svg.selectAll('.node')
      .data(xNodes)
      .enter().append('g')
      .attr('class', (d) => {
        return `node${d.children ? ' node--internal' : ' node--leaf'}`;
      })
      .attr('transform', (d) => {
        return `translate(${d.x},${yHeight - d.y})`;
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
      .style('cursor', 'pointer')
      .text(d => d.data.name)
      .on('mousedown', (node) => {
        this.leafNodeClick('x', [node.data.name]);
      });

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', 10)
      .style('text-anchor', ' start')
      .attr('writing-mode', () => 'tb')
      .text(d => d.data.name);
  };

// 展示tooltip
  showTooltip = (d) => {
    if (d.power === -1 || d.power > 0 || d.h > 0) {
      let tooltipVal = rectTooltip.minus;
      if (d.power > 0 || d.h > 0) {
        tooltipVal = rectTooltip[d.key];
      }
      const toolTipTop = event.pageY + 20;
      const toolTipLeft = event.pageX + 15;
      // y 用d3画图
      ensure('d3', (d3) => {
        d3.select('#tooltip').selectAll('div').remove();
        d3.selectAll('#tooltip')
          .append('div')
          .attr('class', styles.tooltipDis)
          .style('top', `${toolTipTop}px`)
          .style('left', `${toolTipLeft}px`)
          .text(tooltipVal);
      });
    }
  };

// 用户点击bar rect text事件
  showModal = (d) => {
    clearInterval(this.timer);
    if (this.state.isHistory) {
      this.domain1 = d.first;
      this.domain2 = d.second;
      const modalType = d.key;// modal 展示类容类型
      const show = !(modalType === 'heat' && d.heat <= 0); // modal是否展示
      if (show) {
        this.modalType = modalType;
        this.setState({
          visibleModal: true,
          defaultTab: modalType,
          pubCurrent: 1,
          personCurrent: 1,
        });
        this.expertList = [];
        this.pubList = [];
        const yearDuring = this.state.dateDuring;
        const years = [];
        for (let i = yearDuring[0] + 1; i < yearDuring[1] + 1; i++) {
          years.push(i);
        }
        const crossingFields = [{ _1: d.first, _2: d.second }];
        this.crossingFields = crossingFields;
        this.years = years;
        const method = 'detail';
        const withCache = true;
        const dt = { years, crossingFields, withCache };
        this.getAggregate(method, dt);
      }
    }
  };

  leafNodeClick = (type, node) => {
    const { crossTree } = this.props.crossHeat;
    const yNode = this.getNodeChildren(crossTree.queryTree1, []);
    let crossingFields = this.getCrossFieldNode(node, yNode);
    this.domain1 = node;
    this.domain2 = '';
    if (type === 'y') { // y轴
      const xNode = this.getNodeChildren(crossTree.queryTree2, []);
      crossingFields = this.getCrossFieldNode(xNode, node);
    }
    this.crossingFields = crossingFields;
    this.setState({ visibleModal: true, defaultTab: 'heat' });
    this.expertList = [];
    this.pubList = [];
    const yearDuring = this.state.dateDuring;
    const years = [];
    for (let i = yearDuring[0] + 1; i < yearDuring[1] + 1; i++) {
      years.push(i);
    }
    this.years = years;
    const method = 'detail';
    const withCache = true;
    const dt = { years, crossingFields, withCache };
    this.getAggregate(method, dt);
  };

// modal 消失
  hideModal = () => {
    this.expertList = [];
    this.pubList = [];
    this.setState({ visibleModal: false, defaultTab: 'expert' });
  };

//分页
  onChangePage = (page, pageSize) => { //todo 分页
    const skip = (page - 1) * pageSize;
    const method = 'slice';
    const withCache = true;
    let pubs = null;
    let authors = null;
    if (this.modalType === 'pub') {
      this.setState({ pubCurrent: page });
      pubs = { skip, limit: 10 };
      authors = { skip: 0, limit: 10 };
    }
    if (this.modalType === 'expert') {
      pubs = { skip: 0, limit: 10 };
      authors = { skip, limit: 10 };
      this.setState({ personCurrent: page });
    }
    const dt = {
      years: this.years,
      crossingFields: this.crossingFields,
      withCache,
      pubs,
      authors,
    };
    this.getPageInfo(method, dt);
  };

  getPageInfo = (method, dt) => {
    this.props.dispatch({
      type: 'crossHeat/getPageInfo',
      payload: {
        method,
        dt,
      },
    });
  }


  modalTab = (type) => {
    this.modalType = type;
    this.setState({ defaultTab: type });
    this.getPubPerson(type, this.first10Authors, this.first10Pubs);
  }
  heatChange = (isHistory) => {
    const { xTree, yTree, xNode, yNode, nodeData } = this.getXYNode();
    const { predict, crossInfo } = this.props.crossHeat;
    clearInterval(this.timer);
    const yearBuring = [sYear, dateYear];
    this.setState({ isHistory: !isHistory, isAuto: true, nullBtn: true, yearBuring });
    if (isHistory) {
      if (predict) { // 先判断预测值是否已经存在
        this.createBasic(yTree, xTree, xNode, yNode);
        this.createRect(predict, yNode.length);
      } else {
        const crossingFields = nodeData;
        const years = [dateYear];
        const op = 'meta';
        const method = 'predict';
        const withCache = true;
        const dt = { years, crossingFields, withCache, op };
        this.getAggregate(method, dt);
      }
    } else {
      this.createBasic(yTree, xTree, xNode, yNode);
      this.createRect(crossInfo.data, yNode.length);
    }
  };
  nullChange = (nullBtn) => {
    clearInterval(this.timer);
    this.setState({ nullBtn: !nullBtn, isAuto: true });
    const { xTree, yTree, xNode, yNode } = this.getXYNode();
    if (nullBtn) {
      this.getNullData(this.crossInfo);
    } else {
      this.createBasic(yTree, xTree, xNode, yNode);
      this.createRect(this.crossInfo.data, yNode.length);
    }
  };
  autoChange = (isAuto) => {
    const { autoDomainInfo } = this.props.crossHeat;
    this.setState({ isAuto: !isAuto, nullBtn: true });
    if (isAuto) {
      if (autoDomainInfo.length === 0) {
        const tmp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const yearList = [];
        tmp.map((item) => {
          yearList.push([sYear + item]);
          return true;
        });
        this.getAutoDomainInfo(yearList); // 获取自动演示数据
      } else {
        this.startAutoShow(autoDomainInfo);
      }
    } else {
      clearInterval(this.timer);
    }
  };

  getNullData = (crossInfo) => {
    const { xTree, yTree, xNode, yNode } = this.getXYNode();
    const filterXNode = this.filterXNode(crossInfo.data, xNode.length, yNode.length);
    const xDomainList = JSON.parse(JSON.stringify(filterXNode.domainList));
    const filterYNode = this.filterYNode(xDomainList, xNode.length - filterXNode.xVal.length, yNode.length);
    const xNodeList = this.filterNode(filterXNode.xVal, xNode);
    const yNodeList = this.filterNode(filterYNode.yVal, yNode);
    let filterXTree = xTree;
    for (let i = 0; i < xNodeList.length; i++) {
      filterXTree = this.delTree(JSON.parse(JSON.stringify(filterXTree)), xNodeList[i]);
    }
    let filterYTree = yTree;
    for (let i = 0; i < yNodeList.length; i++) {
      filterYTree = this.delTree(JSON.parse(JSON.stringify(filterYTree)), yNodeList[i]);
    }
    const yNew = this.getNodeChildren(filterYTree, []);
    const xNew = this.getNodeChildren(filterXTree, []);
    const dataList = filterYNode.domainList;
    this.createBasic(filterYTree, filterXTree, xNew, yNew);
    this.createRect(dataList, yNew.length);
  }

  filterNode = (list, node) => {
    const tempNode = [];
    list.map((item) => {
      tempNode.push(node[item]);
      return true;
    });
    return tempNode;
  };
// 删除数的节点
  delTree = (dt, node) => {
    if (dt.children) {
      dt.children.map((item, i) => {
        if (item.children.length === 0) {
          if (item.name === node) {
            dt.children.splice(i, 1);
          }
        } else {
          this.delTree(item, node);
        }
        return true;
      });
    }
    return dt;
  };
// 隐藏空白行
  filterXNode = (domainList, xLength, yLength) => {
    const xVal = [];
    const tempList = [];
    for (let i = 0; i < xLength; i++) {
      let isNull = false;
      for (let j = i * yLength; j < (i + 1) * yLength; j++) {
        if (domainList[j].heat !== 0) {
          isNull = true;
          break;
        }
      }
      if (isNull) {
        const tem = domainList.slice(i * yLength, (i + 1) * yLength);
        tempList.push(...tem);
      } else {
        xVal.push(i);
      }
    }
    return { domainList: tempList, xVal };
  };
// 隐藏空白列
  filterYNode = (domainList, xLength, yLength) => {
    const yVal = [];
    const tempList = domainList.slice(0, domainList.length);
    for (let i = 0; i < yLength; i++) {
      let isNull = false;
      for (let j = 0; j < xLength; j++) {
        const n = i + (j * yLength);
        if (domainList[n].heat !== 0) {
          isNull = true;
        }
      }
      if (!isNull) { //删除数组
        for (let a = 0; a < xLength; a++) {
          const n = i + (a * yLength);
          tempList.splice(n, 1, 0);
        }
        yVal.push(i);
      }
    }
    const endList = [];
    tempList.map((item) => {
      if (item) {
        endList.push(item);
      }
      return true;
    });
    return { domainList: endList, yVal };
  };

// 自动演示方法
  startAutoShow = (autoInfo) => {
    const { xTree, yTree, xNode, yNode } = this.getXYNode();
    this.timer = setInterval(() => {
      this.crossInfo = autoInfo[this.countYear];
      this.setState({ yearBuring: [sYear + this.countYear, sYear + this.countYear + 1] });
      this.createBasic(yTree, xTree, xNode, yNode);
      this.createRect(autoInfo[this.countYear].data, yNode.length);
      this.countYear += 1;
      if (this.countYear === 10) {
        this.countYear = 0;
      }
    }, 1000);
  };

// 获得node
  getXYNode = () => {
    const { crossTree } = this.props.crossHeat;
    const { queryTree2, queryTree1 } = crossTree;
    const yNode = this.getNodeChildren(queryTree1, []);
    const xNode = this.getNodeChildren(queryTree2, []);
    const nodeData = this.getCrossFieldNode(xNode, yNode);
    return { xTree: queryTree2, yTree: queryTree1, xNode, yNode, nodeData };
  };


// 获取自动演示数据
  getAutoDomainInfo = (yearList) => {
    const { nodeData } = this.getXYNode();
    const yearDomainInfo = [];
    yearList.map((item) => {
      const years = item;
      const op = 'meta';
      const method = 'overview';
      const withCache = true;
      yearDomainInfo.push({ method, dt: { years, crossingFields: nodeData, withCache, op } });
      return true;
    });
    this.props.dispatch({
      type: 'crossHeat/getAutoDomainInfo',
      payload: { yearDomainInfo },
    });
  };

// 执行 getAggregate 方法
  getAggregate = (method, dt) => {
    this.props.dispatch({
      type: 'crossHeat/getAggregate',
      payload: {
        method,
        dt,
      },
    });
  };
  getPubPerson = (type, authorsIds, pubsIds) => {
    if (type === 'expert') {
      this.props.dispatch({
        type: 'crossHeat/getDomainExpert',
        payload: { ids: authorsIds },
      });
    }
    if (type === 'pub') {
      this.props.dispatch({
        type: 'crossHeat/getDomainPub',
        payload: { ids: pubsIds },
      });
    }
  };

  goCreate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  };

  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/index',
    }));
  };

  render() {
    const loadPage = this.props.loading.effects['crossHeat/getPageInfo'];
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadAggregate = this.props.loading.effects['crossHeat/getAggregate'];
    const loadAutoDomainInfo = this.props.loading.effects['crossHeat/getAutoDomainInfo'];
    const { modalInfo } = this.props.crossHeat;
    const { nullBtn, isHistory, xWidth, yHeight, isAuto, yearBuring, pubCurrent, personCurrent } = this.state;
    let tabTitle = `${this.domain1} & ${this.domain2}`;
    if (this.domain1 === '' || this.domain2 === '') {
      tabTitle = this.domain2 + this.domain1;
    }
    let tempYearBuring = yearBuring;
    if (yearBuring.length === 0) {
      tempYearBuring = [sYear, dateYear];
    }
    const operations = <span>{tabTitle}</span>;
    const heatInfo = isHistory ? '查看未来趋势' : '查看历史热点';
    const nullInfo = nullBtn ? '隐藏空白行列' : '展示空白行列';
    const autoInfo = isAuto ? '自动演示' : '暂停演示';
    return (
      <Layout searchZone={[]} contentClass={tc(['heat'])} showNavigator={false}>
        <div >
          <Spinner loading={loadTree || loadAggregate || loadAutoDomainInfo}
                   size="large" />
          <div className={styles.actionBar}>
            <div>
              <span className={styles.title}>{this.title}</span>
              <Button type="default"
                      onClick={this.heatChange.bind(this, isHistory)}>{heatInfo}
              </Button>
              { isHistory &&
              <Button type="default"
                      onClick={this.nullChange.bind(this, nullBtn)}>{nullInfo}
              </Button>
              }
              { isHistory &&
              <Button type="default"
                      onClick={this.autoChange.bind(this, isAuto)}>{autoInfo}
              </Button>
              }
            </div>
            <div>
              <a href="/cross/startTask">
                <Button type="default" onClick={this.goCreate}>挖掘热点</Button>
              </a>
              <a href="/cross/index">
                <Button type="default" onClick={this.goBack}>返回首页</Button>
              </a>
            </div>
          </div>
          {this.crossInfo && isHistory &&
          <CrossStatistics cross={this.crossInfo} nodeData={this.nodeData}
                           showModal={this.showModal} />
          }
          <div id="tooltip" />
          <div id="d3Content"
               className={styles.d3Content}
               style={{ minWidth: xWidth + 400 }}>
            {xWidth > 0 && isHistory &&
            <Brush getLocalYear={this.getLocalYear}
                   xWidth={xWidth} yearBuring={tempYearBuring} isAuto />
            }

            <div className={styles.yTreeHeat}>
              <svg id="yTree" width={340} height={yHeight} />
              <svg id="heat" width={xWidth} height={yHeight} />
            </div>
            <svg className={styles.xTree} id="xTree" width={xWidth + 340} />
          </div>
          <Modal
            className={styles.heatModal}
            width={this.modalWidth}
            visible={this.state.visibleModal}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            footer={null}
          >
            <Tabs tabBarExtraContent={operations}
                  activeKey={this.state.defaultTab}
                  className={styles.tabs}
                  onChange={this.modalTab}>
              <TabPane tab="专家" key="expert">
                <Spinner loading={loadPage || loadAggregate || loadExpert} />
                { modalInfo &&
                <div className={styles.modalContent}>
                  <PersonList persons={bridge.toNextPersons(this.expertList)}
                              PersonList_PersonLink_NewTab />
                  { this.expertList && this.expertList.length > 0 &&
                  <Pagination className={styles.pagination}
                              onChange={this.onChangePage}
                              defaultPageSize={10}
                              defaultCurrent={1}
                              current={personCurrent}
                              total={modalInfo.authorsCount || 0} />
                  }
                </div>
                }
              </TabPane>
              <TabPane tab="论文" key="pub">
                <Spinner loading={loadPage || loadAggregate || loadPub} />
                {modalInfo &&
                <div className={styles.modalContent}>
                  <PublicationList pubs={this.pubList} pubLinkTargle showLabels={false} />
                  <Pagination className={styles.pagination}
                              onChange={this.onChangePage}
                              defaultCurrent={1}
                              defaultPageSize={10}
                              current={pubCurrent}
                              total={modalInfo.pubsCount || 0} />
                </div>
                }
              </TabPane>
              <TabPane tab="统计" key="heat">
                <Spinner loading={loadAggregate} />
                {modalInfo &&
                <div className={styles.modalContent}>
                  <CrossContrast compareData={modalInfo} />
                </div>
                }
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </Layout >
    );
  }
}
export default connect(({ crossHeat, app, loading }) => ({
  crossHeat,
  app,
  loading,
}))(CrossReport);
