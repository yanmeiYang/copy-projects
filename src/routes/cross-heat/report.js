/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Icon, Switch, Tabs, Pagination, Tag, Tooltip } from 'antd';
import classnames from 'classnames';
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
import BarChart from './bar-chart/index';
import Brush from './time-brush/index';
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
  comPer = {}; // 研究员
  comPub = {}; // 论文
  comCit = {}; // 影响力

  domain1 = '';
  domain2 = '';
  first10Authors = [];
  first10Pubs = [];
  heatInfo = [];
  barInfo = [];
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
        this.title = `${crossTree.queryTree1.name} & ${crossTree.queryTree2.name}`;
        this.createYTree(crossTree.queryTree1, this.yHeight);
        this.createXTree(crossTree.queryTree2, this.yHeight, this.xWidth);
      }
      if (nsDateDuring[0]) { // 获取交叉信息
        this.getDomainInfo(crossTree.queryTree1, crossTree.queryTree2, nextState.dateDuring);
      }
    }
    const crossInfo = this.props.crossHeat.crossInfo; // 热力值改变
    if (crossInfo !== nextProps.crossHeat.crossInfo) {
      this.createRect(nextProps.crossHeat.crossInfo.dataList);
    }
    if (this.props.crossHeat.experts !== nextProps.crossHeat.experts) {
      this.expertList = nextProps.crossHeat.experts;
    }
    if (this.props.crossHeat.pubs !== nextProps.crossHeat.pubs) {
      this.pubList = nextProps.crossHeat.pubs;
    }

    const predict = this.props.crossHeat.predict; // 预测
    if (predict !== nextProps.crossHeat.predict) {
      this.createRect(this.changePredictData(nextProps.crossHeat.predict));
    }
  }

// 绘制rect 图
  createRect = (domainList) => {
    console.log('domainList', domainList);
    if (domainList) {
      this.heatInfo = [];
      this.barInfo = [];
      domainList.map((domain, num) => { // 将json 转换成d3格式
        const first = this.nodeData[num].first;
        const second = this.nodeData[num].second;
        num += 1;
        const yLength = this.yNode.length;
        const x = Math.ceil(num / yLength); // 第几行
        const y = num - (yLength * (x - 1));// 第几列

        const temPower = domain ? domain.power : -1; //热力值
        const temPersonCount = domain ? domain.personCount : 0;// 默认专家
        const temPubCount = domain ? domain.pubCount : 0;// 默认论文
        // 获取 两个节点
        this.heatNum.push(temPower);
        this.barNum.push(temPersonCount, temPubCount);
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
        .attr('transform', `translate(${260},${-62})`);
    }


    // 条形统计图
    const barVar = 12;
    const wMax = Math.log(d3.max(this.barNum));
    if (wMax) {
      const wMin = 62 / wMax;
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .selectAll('rect')
        .data(barInfo)
        .enter()
        .append('rect')
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
        .attr('transform', d => `translate(260,${d.y * barVar})`)
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
          return tempNum + startX;
        })
        .attr('dy', '.75em')
        .style('cursor', 'pointer')
        .text(d => (d.h > 0 ? d.h : ''))
        .attr('transform', d => `translate(260,${d.y * barVar})`)
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
          type: 'crossHeat/getDomainAllInfo',
          payload: params,
        }).then(() => {
          const info = this.props.crossHeat.domainAllInfo;
          this.modalInit(this.modalType, info);
        });
      }
    }
  }

  // modal 初始化
  modalInit = (type, info) => {
    this.first10Authors = info.first10Authors;
    this.first10Pubs = info.first10Pubs;
    const title = ['中国', '美国', '其他'];
    this.comPer = { title, num: [info.ChinaAuthorSize, info.USAAuthorSize, 0] };
    this.comPub = { title, num: [info.ChinaPubSize, info.USAPubSize, 0] };
    this.comCit = { title, num: [info.ChinaCitationCount, info.USACitationCount, 0] };
    this.getPubPerson(type, this.first10Authors, this.first10Pubs);
  }
  createYTree = (yData, yHeight) => {
    const height = yHeight;
    // 创建画板
    const svg = d3.selectAll('#heat')
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
      .text(d => d.data.name);

    // 非叶子节点
    const internalNode = svg.selectAll('.node--internal');
    internalNode.append('text')
      .attr('y', 10)
      .style('text-anchor', ' start')
      .attr('writing-mode', () => 'tb')
      .text(d => d.data.name);
  }


  leafNodeClick = (type, node) => {
    let nodelist = this.getCrossNode(node, this.yNode);
    if (type === 'y') {  // y轴
      nodelist = this.getCrossNode(node, this.xNode);
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
    }).then(() => {
      const info = this.props.crossHeat.modalInfo;
      this.modalInit('expert', info);
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
    }).then(() => {
      const info = this.props.crossHeat.domainMinInfo;
      this.getPubPerson(this.modalType, info.authors, info.pubs);
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
    if (isHistory) {
      this.props.dispatch({
        type: 'crossHeat/getCrossPredict',
        payload: { dt: this.nodeData, },
      });
    }
  };
  nullChange = (nullBtn) => {
    this.setState({ nullBtn: !nullBtn });
  };

  autoChange = () => {

  };


  hIndexBarWidth = (hindexData) => {
    const indexList = [hindexData['1'], hindexData['2'], hindexData['3'], hindexData['4'], hindexData['5']];
    const maxIndex = Math.max.apply(null, indexList);
    const tmp = 180 / maxIndex;
    const widthList = [tmp * hindexData['1'], tmp * hindexData['2'], tmp * hindexData['3'], tmp * hindexData['4'], tmp * hindexData['5']];
    return widthList;
  }

  onTagChange = (item) => {
    const title = item.split(',');
    const param = { first: title[0], second: title[1], key: 'expert', power: 1 };
    this.showModal(param);
  }

  changePredictData = (data) => {
    const predict = [];
    data.map((item) => {
      predict.push(item[0])
      return true;
    })
    return predict;
  };

  render() {
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadDomain = this.props.loading.effects['crossHeat/getDomainAllInfo'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadDomainInfo = this.props.loading.effects['crossHeat/getDomainInfo'];
    const { domainAllInfo, crossInfo } = this.props.crossHeat;
    const modalInfo = domainAllInfo;
    let hIndexBarWidth = [];
    if (crossInfo) {
      hIndexBarWidth = this.hIndexBarWidth(crossInfo.hIndexDistribution);
    }
    let tabTitle = this.domain2 + "&" + this.domain1;
    if (this.domain1 === '' || this.domain2 === '') {
      tabTitle = this.domain2 + this.domain1;
    }

    const operations = <span>{tabTitle}</span>;
    const { nullBtn, isHistory } = this.state;
    const heatInfo = isHistory ? '查看未来趋势' : '查看历史热点';
    const nullInfo = nullBtn ? '隐藏空白' : '展示空白';
    return (
      <Layout searchZone={[]} contentClass={tc(['heat'])} showNavigator={false}>
        <div >
          <Spinner loading={loadTree || loadDomainInfo} size="large" />
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
              <Button type="default" onClick={this.goBack}>返回首页</Button>
            </div>
          </div>
          {crossInfo &&
          <div className={styles.statistics} style={{ minWidth: this.xWidth + 400 }}>
            <div>
              <div className={styles.title}>
                <i className="fa fa-bar-chart" aria-hidden="true" />
                <span>统计</span>
              </div>
              <div className={styles.content}>
                <div className={styles.basic}>
                  <span>专家：</span>
                  <span className={styles.num}>{crossInfo.authorSize}</span>
                  <span>人</span>
                </div>
                <div className={styles.basic}>
                  <span>论文：</span>
                  <span className={styles.num}>{crossInfo.pubSize}</span>
                  <span>篇</span>
                </div>
                <div className={styles.basic}>
                  <span>华人：</span>
                  <span className={styles.num}>{crossInfo.ChinaAuthorSize}</span>
                  <span>人</span>
                </div>
                <div className={styles.basic}>
                  <span>H-index均值：</span>
                  <span className={styles.num}>{crossInfo.averageHIndex.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>
                <i className="fa fa-area-chart" aria-hidden="true" />
                <span>H-index分布</span>
              </div>
              <div className={styles.content}>
                <div className={styles.hBar}>
                  <div className={styles.itemAxias}>&lt;10</div>
                  <div className={styles.item1}
                       style={{ width: hIndexBarWidth[0] }}
                  >{crossInfo.hIndexDistribution['1']}</div>
                </div>
                <div className={styles.hBar}>
                  <div className={styles.itemAxias}>10~20</div>
                  <div className={styles.item2}
                       style={{ width: hIndexBarWidth[1] }}>{crossInfo.hIndexDistribution['2']}
                  </div>
                </div>
                <div className={styles.hBar}>
                  <div className={styles.itemAxias}>20~40</div>
                  <div className={styles.item3} style={{ width: hIndexBarWidth[2] }}>
                    { crossInfo.hIndexDistribution['3']}
                  </div>
                </div>
                <div className={styles.hBar}>
                  <div className={styles.itemAxias}>40~60</div>
                  <div className={styles.item4} style={{ width: hIndexBarWidth[3] }}>
                    {crossInfo.hIndexDistribution['4']}
                  </div>
                </div>
                <div className={styles.hBar}>
                  <div className={styles.itemAxias}>&gt;60</div>
                  <div className={styles.item5} style={{ width: hIndexBarWidth[4] }}>
                    {crossInfo.hIndexDistribution['5']}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>
                <i className="fa fa-sort-amount-desc" aria-hidden="true" />
                <span>最热交叉</span>
              </div>
              <div className={styles.content}>
                {crossInfo.hottestFive.map((item, index) => {
                  return (
                    <Tooltip key={index} placement="top" title={item}
                             onClick={this.onTagChange.bind(this, item)}>
                      <div href="#" className={styles.hTitle}>
                        <Tag
                          className={styles.antTag}>{index + 1}. {item.replace(',', ' & ')}</Tag>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.title}>
                <span alt="" className={classnames('icon', styles.titleIcon)} />
                <span>图例</span>
              </div>
              <div className={styles.content}>
                <div className={styles.legend}>
                  <div className={styles.label}>交叉学科热度：</div>
                  <div className={styles.hColor1}>
                    <div>低</div>
                    <div>高</div>
                  </div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.label}>交叉学科专家：</div>
                  <div className={styles.eColor}></div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.label}>交叉学科论文：</div>
                  <div className={styles.pColor}></div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.label}>正在计算交叉：</div>
                  <div className={styles.lColor}></div>
                </div>
              </div>
            </div>
          </div>
          }

          <div id="tooltip" />
          <div id="d3Content" className={styles.d3Content}
               style={{ minWidth: this.xWidth + 400 }}>
            {this.xWidth > 0 && isHistory &&
            <div>
              <Brush getLocalYear={this.getLocalYear} xWidth={this.xWidth} />
            </div>
            }
            <div style={{ margin: 0, marginBottom: -5 }}>
              <svg id="heat" width={this.xWidth + 345} height={this.yHeight}
                   style={{ marginRight: 200 }} />
            </div>
            <div style={{ margin: 0, padding: 0 }}>
              <svg id="xTree" width={this.xWidth + 340} height="300" />
            </div>
          </div>
          <Modal
            className={styles.heatModal}
            width={this.modalWidth}
            visible={this.state.visibleModal}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            footer={null}
          >

            <Tabs tabBarExtraContent={operations} activeKey={this.state.defaultTab}
                  onChange={this.modalTab} style={{ height: 650 }}>
              <TabPane tab="专家" key="expert">
                { modalInfo && this.expertList &&
                <div className={styles.modalContent}>
                  <Spinner loading={loadExpert} size="large" />
                  <PersonList persons={bridge.toNextPersons(this.expertList)} />
                  { this.expertList.length > 0 &&
                  <Pagination className={styles.pagination} onChange={this.onChangePage}
                              defaultCurrent={1} defaultPageSize={10}
                              total={modalInfo.authorSize || 0} />
                  }
                </div>
                }
              </TabPane>
              <TabPane tab="论文" key="pub">
                { modalInfo &&
                <div className={styles.modalContent}>
                  <Spinner loading={loadPub} size="large" />
                  <PublicationList pubs={this.pubList} showLabels={false} />
                  {this.pubList && this.pubList.length > 0 &&
                  <Pagination className={styles.pagination} onChange={this.onChangePage}
                              defaultCurrent={1} defaultPageSize={10}
                              total={modalInfo.pubSize || 0} />
                  }
                </div>
                }
              </TabPane>
              <TabPane tab="统计" key="heat">
                { modalInfo &&
                <div className={styles.modalContent}>
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
                  { modalInfo.nationCitationList.length > 0 &&
                  <div>
                    <h4>全球前10个国家</h4>
                    <div>
                      {modalInfo.nationCitationList.slice(0, 10).map((item, index) => {
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
                  { modalInfo.orgCitationList.length > 0 &&
                  <div>
                    <h4>全球前20个机构</h4>
                    <div>
                      {modalInfo.orgCitationList.slice(0, 20).map((item, index) => {
                        return (
                          <Tooltip key={index} placement="top" title={item.org}>
                            <a href="#">
                              <Tag key={index} className={styles.antTag}>
                                {item.org.length > 110 ? `${item.org.slice(0, 110)}...` : item.org}
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
              </TabPane>
            </Tabs>
          </Modal>
        </div>
      </Layout>
    );
  }
}
export default connect(({ crossHeat, app, loading }) => ({
  crossHeat,
  app,
  loading,
}))(CrossReport);

