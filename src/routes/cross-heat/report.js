/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, Switch, Tabs, Pagination, Tag, Tooltip } from 'antd';
import { routerRedux, withRouter } from 'dva/router';
import * as d3 from 'd3';
import { sysconfig } from 'systems';
import { PersonList } from 'components/person';
import { Spinner } from 'components';
import { Layout } from 'routes';
import { applyTheme } from 'themes';
import { Auth } from 'hoc';
import bridge from 'utils/next-bridge';
import { PublicationList } from '../../components/publication/index';
import Brush from './time-brush/index';
import CrossStatistics from './statistics/index';
import CrossContrast from './contrast/index';
import styles from './report.less';

const tc = applyTheme(styles);
const TabPane = Tabs.TabPane;

const a = d3.rgb(255, 255, 255); //红色
const b = d3.rgb(255, 127, 80); //绿色
const compute = d3.interpolate(a, b);
const barColor = {
  pub: '#92D1FF',
  expert: '#8EC267',
};

const rectTooltip = {
  heat: '中美对比',
  expert: '领域专家',
  pub: '领域论文',
  zero: '无交叉信息',
  minus: '正在计算...',
};

@withRouter
@Auth
class CrossReport extends React.Component {
  state = {
    visibleModal: false,
    dateDuring: [],
    defaultTab: 'expert',
    nullBtn: true,
    isHistory: true,
    yHeight: 0, // 图的高
    xWidth: 0, // 图的宽
  };
  heatNum = []; // 热力值数组
  barNum = []; //bar值数组
  title = '';
  modalWidth = 800; // modal 默认宽
  modalType = '';
  domain1 = '';
  domain2 = '';
  first10Authors = [];
  first10Pubs = [];
  nodeData = [];
  expertList = [];
  pubList = [];

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
    let xNode = [];
    let yNode = [];
    const { crossTree, crossInfo, domainMinInfo, experts, pubs, predict, modalInfo } = this.props.crossHeat;
    const nCrossTree = nextProps.crossHeat.crossTree;
    if (nCrossTree !== null) {
      xNode = this.getNodeChildren(nCrossTree.queryTree2, []);
      yNode = this.getNodeChildren(nCrossTree.queryTree1, []);
      this.title = `${nCrossTree.queryTree1.name} & ${nCrossTree.queryTree2.name}`;
    }
    if (nCrossTree !== crossTree) { // 树
      this.createBasic(nCrossTree.queryTree1, nCrossTree.queryTree2, xNode, yNode);
    }
    const nDate = nextState.dateDuring;
    const sDate = this.state.dateDuring;
    if (sDate && (nDate[0] !== sDate[0] || nDate[1] !== sDate[1])) { // 时间发生改变
      this.getDomainInfo(nCrossTree.queryTree1, nCrossTree.queryTree2, nextState.dateDuring);
    }
    if (crossInfo !== nextProps.crossHeat.crossInfo) { // 热力值改变
      this.createRect(nextProps.crossHeat.crossInfo.dataList, yNode.length);
    }
    if (experts !== nextProps.crossHeat.experts) { // 获取专家
      this.expertList = nextProps.crossHeat.experts;
    }
    if (pubs !== nextProps.crossHeat.pubs) { // 获取论文
      this.pubList = nextProps.crossHeat.pubs;
    }
    if (domainMinInfo !== this.props.crossHeat.domainMinInfo) { // 分页
      this.getPubPerson(this.modalType, domainMinInfo.authors, domainMinInfo.pubs);
    }
    if (predict !== nextProps.crossHeat.predict) { // 预测
      this.createRect(this.changePredictData(nextProps.crossHeat.predict), yNode.length);
    }
    if (modalInfo !== nextProps.crossHeat.modalInfo) { // modal info
      this.modalInit(this.modalType, nextProps.crossHeat.modalInfo);
    }
  }

  // 重新创建原图
  createBasic = (yTree, xTree, xNode, yNode) => { // 删除原来当图
    d3.select('#heat').selectAll('g').remove();
    d3.select('#xTree').selectAll('g').remove();
    d3.select('#yTree').selectAll('g').remove();
    const yHeight = yNode.length * 62;
    const xWidth = xNode.length * 62;
    this.setState({ yHeight, xWidth });
    this.createYTree(yTree, yHeight);
    this.createXTree(xTree, yHeight, xWidth);
  }
// 绘制rect 图
  createRect = (domainList, yLength) => {
    if (domainList) {
      d3.select('#heat').selectAll('g').remove();
      const changeData = this.domainChange(domainList, yLength);
      this.heatNum = changeData.heatNum;
      this.barNum = changeData.barNum;
      this.createAxis(changeData.heatInfo, changeData.barInfo);
    }
  };


//  domain 数据转换成d3需要的格式
  domainChange = (domainList, yLength) => {
    const heatNum = [];
    const barNum = [];
    const heatInfo = [];
    const barInfo = [];
    domainList.map((domain, num) => { // 将json 转换成d3格式
      const first = this.nodeData[num].first;
      const second = this.nodeData[num].second;
      num += 1;
      const x = Math.ceil(num / yLength); // 第几行
      const y = num - (yLength * (x - 1));// 第几列

      const temPower = domain ? domain.power : -1; //热力值
      const temPersonCount = domain ? domain.personCount : 0;// 默认专家
      const temPubCount = domain ? domain.pubCount : 0;// 默认论文
      // 获取 两个节点
      heatNum.push(temPower);
      barNum.push(temPersonCount, temPubCount);
      heatInfo.push({ x, y, key: 'heat', power: temPower, first, second }); // 格式heat json 数据
      const startY = (y - 1) * 2;
      barInfo.push( // 格式bar json 数据
        { x, y: startY + 1, h: temPersonCount, key: 'expert', first, second },
        { x, y: startY + 2, h: temPubCount, key: 'pub', first, second },
      );
      return true;
    });
    return { heatNum, barNum, heatInfo, barInfo };
  }


// 获取 DomainInfo
  getDomainInfo = (yTree, xTree, date) => {
    const yNode = this.getNodeChildren(yTree, []);
    const xNode = this.getNodeChildren(xTree, []);
    this.nodeData = this.getCrossNode(xNode, yNode);
    const pubSkip = 0;
    const pubLimit = 10;
    const authorSkip = 0;
    const authorLimit = 10;

    this.props.dispatch({
      type: 'crossHeat/getDomainInfo',
      payload: {
        beginYear: date[0],
        endYear: date[1],
        pubSkip,
        pubLimit,
        authorSkip,
        authorLimit,
        dt: this.nodeData,
      },
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
    if (tree.children && tree.children.length > 0) {
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
        .style('cursor', d => (d.power > 0 ? 'pointer' : 'default'))
        .attr('x', d => d.x * cellSize)
        .attr('y', d => d.y * cellSize)
        .attr('fill', (d) => {
          if (d.power > 0) { // 大于-1 表示计划完成
            const formatPower = d.power / maxHeatNum;
            const hv = formatPower.toFixed(1);
            const h = formatPower < 0.1 ? 0.1 : hv;
            return compute(h);
          }
          if (d.power === 0) {
            return '#fff';
          }
          if (d.power === -1) {
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
        .attr('transform', d => `translate(0,${d.y * barVar})`)
        .on('mousedown', d => this.showModal(d))
        .on('mouseover', d => this.showTooltip(d))
        .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());

      // 添加文字
      svg.append('g')
      // .attr('fill', 'none')
      // .attr('stroke', '#ff0000')
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
        .style('cursor', 'pointer')
        .text(d => (d.h > 0 ? d.h : ''))
        .attr('transform', d => `translate(0,${d.y * barVar})`)
        .on('mouseover', d => this.showTooltip(d))
        .on('mousedown', d => this.showModal(d))
        .on('mouseleave', () => d3.select('#tooltip').selectAll('div').remove());
    }
  }

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
      d3.select('#tooltip').selectAll('div').remove();
      d3.selectAll('#tooltip')
        .append('div')
        .attr('class', styles.tooltipDis)
        .style('top', `${toolTipTop}px`)
        .style('left', `${toolTipLeft}px`)
        .text(tooltipVal);
    }
  }

// 用户点击bar rect text事件
  showModal = (d) => {
    if (this.state.isHistory) {
      this.domain1 = d.first;
      this.domain2 = d.second;
      const beginYear = this.state.dateDuring[0];
      const endYear = this.state.dateDuring[1];
      const summary = true;
      const pubSkip = 0;
      const pubLimit = 0;
      const authorSkip = 0;
      const authorLimit = 0;
      const modalType = d.key;// modal 展示类容类型
      const show = !(modalType === 'heat' && d.power < 1); // modal是否展示
      if (show) {
        this.modalType = modalType;
        this.setState({ visibleModal: true, defaultTab: modalType });
        this.expertList = [];
        this.pubList = [];
        const params = {
          domain1: this.domain1,
          domain2: this.domain2,
          beginYear,
          endYear,
          summary,
          pubSkip,
          pubLimit,
          authorSkip,
          authorLimit,
        };
        this.props.dispatch({
          type: 'crossHeat/getModalInfo',
          payload: params,
        });
      }
    }
  }
  // modal 初始化
  modalInit = (type, info) => {
    this.first10Authors = info.first10Authors;
    this.first10Pubs = info.first10Pubs;
    this.getPubPerson(type, this.first10Authors, this.first10Pubs);
  }
  createYTree = (yData, yHeight) => {
    const height = yHeight;
    // 创建画板
    const svg = d3.selectAll('#yTree')
      .append('g')
      .attr('transform', 'translate(20,0)');
    //========yTree==================
    const yTree = d3.cluster().size([height, 316])
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
      .style('cursor', 'pointer')
      .attr('class','test')
      .style("background-color", "black")
      .text(d => d.data.name)
      .on('mousedown', (node) => {
        this.leafNodeClick('x', [node.data.name]);
      });

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', -10)
      .style('text-anchor', d => (d.parent ? 'middle' : 'start'))
      .text(d => d.data.name);
    // 叶子节点点击事件
  }
//=====xstree===================
  createXTree = (xData, yHeight, xWidth) => {
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
  }

  leafNodeClick = (type, node) => {
    const { crossTree} = this.props.crossHeat;
    const yNode = this.getNodeChildren(crossTree.queryTree1, []);
    let nodelist = this.getCrossNode(node, yNode);
    if (type === 'y') {  // y轴
      const xNode = this.getNodeChildren(crossTree.queryTree2, []);
      nodelist = this.getCrossNode(node, xNode);
    }
    this.domain1 = node;
    this.domain2 = '';
    this.modalType = 'expert';
    this.setState({ visibleModal: true, defaultTab: this.modalType });
    this.expertList = [];
    this.pubList = [];
    const pubSkip = 0;
    const pubLimit = 10;
    const authorSkip = 0;
    const authorLimit = 10;
    const beginYear = this.state.dateDuring[0];
    const endYear = this.state.dateDuring[1];
    this.props.dispatch({
      type: 'crossHeat/getTreeModalInfo',
      payload: {
        beginYear,
        endYear,
        pubSkip,
        pubLimit,
        authorSkip,
        authorLimit,
        dt: nodelist,
      },
    });
  }

// modal 消失
  hideModal = () => {
    this.expertList = [];
    this.pubList = [];
    this.setState({ visibleModal: false, defaultTab: 'expert' });
  }
// 获取时间段，通过时间轴
  getLocalYear = date => this.setState({ dateDuring: date });

//分页
  onChangePage = (page, pageSize) => {
    const beginYear = this.state.dateDuring[0];
    const endYear = this.state.dateDuring[1];
    const summary = false;
    const pubSkip = this.modalType === 'pub' ? (page - 1) * pageSize : 0;
    const pubLimit = this.modalType === 'pub' ? page * pageSize : 0;
    const authorSkip = this.modalType === 'expert' ? (page - 1) * pageSize : 0;
    const authorLimit = this.modalType === 'expert' ? page * pageSize : 0;
    const params = {
      domain1: this.domain1,
      domain2: this.domain2,
      beginYear,
      endYear,
      summary,
      pubSkip,
      pubLimit,
      authorSkip,
      authorLimit,
    };
    this.props.dispatch({
      type: 'crossHeat/getDomainMinInfo',
      payload: params,
    });
  }
  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/index',
    }));
  }

  modalTab = (type) => {
    this.modalType = type;
    this.setState({ defaultTab: type });
    this.getPubPerson(type, this.first10Authors, this.first10Pubs);
  }
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
  }

  heatChange = (isHistory) => {
    this.setState({ isHistory: !isHistory });
    // 先判断预测值是否已经存在
    const { predict, crossTree } = this.props.crossHeat;
    const yNode = this.getNodeChildren(crossTree.queryTree1, []);
    if (isHistory && predict) {
      this.createRect(this.changePredictData(predict), yNode.length);
    }
    if (isHistory && predict === null) {
      this.props.dispatch({
        type: 'crossHeat/getCrossPredict',
        payload: { dt: this.nodeData },
      });
    }
    if (!isHistory) {
      this.createRect(this.props.crossHeat.crossInfo.dataList, yNode.length);
    }
  };
  nullChange = (nullBtn) => {
    this.setState({ nullBtn: !nullBtn });
    d3.select('#heat').selectAll('g').remove(); // 删除原来当图
    d3.select('#xTree').selectAll('g').remove();
    d3.select('#yTree').selectAll('g').remove();
    const { crossTree, crossInfo } = this.props.crossHeat;
    const { queryTree1, queryTree2 } = crossTree;
    const yNodeOld = this.getNodeChildren(queryTree1, []);
    const xNodeOld = this.getNodeChildren(queryTree2, []);
    if (nullBtn) {
      const filterXNode = this.filterXNode(crossInfo.dataList, xNodeOld.length, yNodeOld.length);
      const xDomainList = JSON.parse(JSON.stringify(filterXNode.domainList));
      const filterYNode = this.filterYNode(xDomainList, xNodeOld.length - filterXNode.xVal.length, yNodeOld.length);
      const xNodeList = this.filterNode(filterXNode.xVal, xNodeOld);
      const yNodeList = this.filterNode(filterYNode.yVal, yNodeOld);
      let filterXTree = queryTree2;
      for (let i = 0; i < xNodeList.length; i++) {
        filterXTree = this.delTree(JSON.parse(JSON.stringify(filterXTree)), xNodeList[i]); // todo map
      }
      let filterYTree = queryTree1;
      for (let i = 0; i < xNodeList.length; i++) {
        filterYTree = this.delTree(JSON.parse(JSON.stringify(filterYTree)), yNodeList[i]); // todo map
      }
      const yNodeNew = this.getNodeChildren(filterYTree, []);
      const xNodeNew = this.getNodeChildren(filterXTree, []);
      // console.log(filterYTree, filterXTree, xNodeNew, yNodeNew);
      // // yTree, xTree, xNode, yNode
      this.createBasic(filterYTree, filterXTree, xNodeNew, yNodeNew);
      this.createRect(filterYNode.domainList, yNodeNew.length);

      // console.log('filterXTree', filterXTree);
      // this.createBasic(queryTree1, filterXTree, xNodeNew, yNodeOld);
      // this.createRect(filterXNode.domainList, yNodeOld.length);
    } else {
      this.createBasic(queryTree1, queryTree2, xNodeOld, yNodeOld);
      this.createRect(crossInfo.dataList, yNodeOld.length);
    }
  };

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
  }
  // 隐藏空白行
  filterXNode = (domainList, xLength, yLength) => {
    const xVal = [];
    const tempList = []
    for (let i = 0; i < xLength; i++) {
      let isNull = false;
      for (let j = i * yLength; j < (i + 1) * yLength; j++) {
        if (domainList[j].power !== 0) {
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
        if (domainList[n].power !== 0) {
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
    })
    return { domainList: endList, yVal };
  }

  autoChange = () => {

  };

  barWidth = (hindexData) => {
    const indexList = [hindexData['1'], hindexData['2'], hindexData['3'], hindexData['4'], hindexData['5']];
    const maxIndex = Math.max.apply(null, indexList);
    const tmp = 180 / maxIndex;
    const widthList = [tmp * hindexData['1'], tmp * hindexData['2'], tmp * hindexData['3'], tmp * hindexData['4'], tmp * hindexData['5']];
    return widthList;
  }

  changePredictData = (data) => {
    const predict = [];
    data.map((item) => {
      predict.push(item[0])
      return true;
    })
    return predict;
  };

  goCreate = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/cross/startTask',
    }));
  };

  render() {
    const loadPredict = this.props.loading.effects['crossHeat/getCrossPredict'];
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadDomain = this.props.loading.effects['crossHeat/getDomainAllInfo'];
    const loadTreeModal = this.props.loading.effects['crossHeat/getTreeModalInfo'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadDomainInfo = this.props.loading.effects['crossHeat/getDomainInfo'];
    const { crossInfo, modalInfo } = this.props.crossHeat;

    let tabTitle = this.domain2 + " & " + this.domain1;
    if (this.domain1 === '' || this.domain2 === '') {
      tabTitle = this.domain2 + this.domain1;
    }
    const operations = <span>{tabTitle}</span>;
    const { nullBtn, isHistory, xWidth, yHeight } = this.state;
    const heatInfo = isHistory ? '查看未来趋势' : '查看历史热点';
    const nullInfo = nullBtn ? '隐藏空白行列' : '展示空白行列';
    return (
      <Layout searchZone={[]} contentClass={tc(['heat'])} showNavigator={false}>
        <div >
          <Spinner loading={loadTree || loadDomainInfo || loadPredict} size="large" />
          <div className={styles.actionBar}>
            <div>
              <span className={styles.title}>{this.title}</span>
              <Button type="default"
                      onClick={this.heatChange.bind(this, isHistory)}>{heatInfo}</Button>
              <Button type="default"
                      onClick={this.nullChange.bind(this, nullBtn)}>{nullInfo}</Button>
              <Button type="default" onClick={this.autoChange}>自动演示</Button>
            </div>
            <div>
              <Button type="default" onClick={this.goCreate}>挖掘热点</Button>
              <Button type="default" onClick={this.goBack}>返回首页</Button>
            </div>
          </div>
          {crossInfo &&
          <CrossStatistics statisticsInfo={crossInfo}></CrossStatistics>
          }
          <div id="tooltip" />
          <div id="d3Content"
               className={styles.d3Content}
               style={{ minWidth: xWidth + 400 }}>
            {xWidth > 0 && isHistory &&
            <Brush getLocalYear={this.getLocalYear}
                   xWidth={xWidth} />
            }

            <div className={styles.yTreeHeat}>
              <svg id="yTree" width={340} height={yHeight}></svg>
              <svg id="heat" width={xWidth} height={yHeight}></svg>
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
                <Spinner loading={loadTreeModal || loadDomain || loadExpert}></Spinner>
                { modalInfo &&
                <div className={styles.modalContent}>
                  <PersonList persons={bridge.toNextPersons(this.expertList)} />
                  { this.expertList.length > 0 &&
                  <Pagination className={styles.pagination}
                              onChange={this.onChangePage}
                              defaultCurrent={1} defaultPageSize={10}
                              total={modalInfo.authorSize || 0} />
                  }
                </div>
                }
              </TabPane>
              <TabPane tab="论文" key="pub">
                <Spinner loading={loadTreeModal || loadDomain || loadPub}></Spinner>
                {modalInfo &&
                <div className={styles.modalContent}>
                  <PublicationList pubs={this.pubList} showLabels={false} />
                  <Pagination className={styles.pagination} onChange={this.onChangePage}
                              defaultCurrent={1} defaultPageSize={10}
                              total={modalInfo.pubSize || 0} />
                </div>
                }
              </TabPane>
              <TabPane tab="统计" key="heat">
                <Spinner loading={loadTreeModal || loadDomain}></Spinner>
                {modalInfo &&
                <CrossContrast compareData={modalInfo} />
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

