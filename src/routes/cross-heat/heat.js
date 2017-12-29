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
import { PublicationList } from '../../components/publication/index';
import { ensure } from 'utils';
import CrossContrast from './contrast/index';
import CrossStatistics from './statistics/index';
import bridge from 'utils/next-bridge';
import Brush from './time-brush/index';
import History from './line-chart/index';
import styles from './heat.less';

const tc = applyTheme(styles);
const TabPane = Tabs.TabPane;
const localDate = new Date();
const eYear = localDate.getFullYear() + 1;
const sYear = 2007;
const years = [];
for (let i = sYear; i <= eYear; i++) {
  years.push(i);
}
const colorHeat = ['#FFFFFF', '#FFF2EE', '#FFE5DC', '#FFD9CB', '#FFD9CB', '#FFBFA8', '#FFB296', '#FFA585', '#FF9973', '#FF8C62', '#cc4c1eeb'];
@withRouter
@Auth
@RequireRes('d3')
class Heat extends React.Component {
  state = {
    dateDuring: [sYear, eYear],
    defaultTab: 'author',
    iShadow: -1,
    tShadow: '',
    pubCurrent: 1,
    authorCurrent: 1,
    isShow: true,
    isAuto: true,
    isHistory: true,
  }
  crossInfo = null;
  crossInfoCache = {};
  xNode = [];
  yNode = [];
  domain1 = '';
  domain2 = '';
  title = '';
  heatInfo = [];
  modalWidth = 800; // modal 默认宽
  modalType = '';
  first10Authors = [];
  first10Pubs = [];
  expertList = [];
  pubList = [];
  countYear = 0;
  timer = 0;

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({
      type: 'crossHeat/getCrossFieldById',
      payload: { id },
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { crossTree, crossInfo, predict, experts, pubs, modalInfo, pageInfo, autoDomainInfo } = this.props.crossHeat;
    const { defaultTab, dateDuring, isAuto, isShow } = this.state;
    const nCrossTree = nextProps.crossHeat.crossTree;
    const nDate = nextState.dateDuring;
    if (isShow && (nCrossTree !== null) && (nCrossTree !== crossTree)) {
      this.xNode = this.getNodeChildren(nCrossTree.queryTree2);
      this.yNode = this.getNodeChildren(nCrossTree.queryTree1);
      this.nodeData = this.getCrossFieldNode(this.xNode, this.yNode);
      this.title = this.yNode[0] + " & " + this.xNode[0];
      this.getDomainInfo([sYear, eYear]);
    }
    const nCrossInfo = nextProps.crossHeat.crossInfo;
    if (crossInfo !== nCrossInfo) { // 热力值改变
      this.crossInfoCache[nDate[0] + '_' + nDate[1]] = nextProps.crossHeat.crossInfo;
      this.crossInfo = nextProps.crossHeat.crossInfo;
      this.heatInfo = this.domainChange(nCrossInfo.data);
    }

    if (isAuto && (nDate[0] !== dateDuring[0] || nDate[1] !== dateDuring[1])) {
      this.setState({ isShow: true });
      this.getShowXY();
      if (nDate[0] < eYear) {
        this.getDomainInfo([nDate[0], nDate[1]]);
      } else {
        this.getPredict([eYear, eYear + 1, eYear + 2]); //预测未来3年
      }
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
      this.getPubPerson(defaultTab, this.first10Authors, this.first10Pubs);
    }
    if (pubs !== nextProps.crossHeat.pubs) { // 获取论文
      this.pubList = nextProps.crossHeat.pubs;
    }
    if (modalInfo !== nextProps.crossHeat.modalInfo) { // modal info
      const info = nextProps.crossHeat.modalInfo;
      this.first10Authors = info.authors.top10;
      this.first10Pubs = info.pubs.top10;
      this.getPubPerson(defaultTab, this.first10Authors, this.first10Pubs);
    }
    const nAutoDomainInfo = nextProps.crossHeat.autoDomainInfo;
    if (autoDomainInfo !== nAutoDomainInfo && nAutoDomainInfo.length > 0) { // autoDomainInfo
      this.startAutoShow(nAutoDomainInfo);
    }

    if (predict !== nextProps.crossHeat.predict) { // 预测
      this.heatInfo = this.domainChange(nextProps.crossHeat.predict);
      this.crossInfo = { data: this.heatInfo, detail: null };
    }
  }


  // 获取 DomainInfo
  getDomainInfo = (dateDuring) => {
    if (this.crossInfoCache[dateDuring[0] + '_' + dateDuring[1]]) { //从缓存中获取
      this.crossInfo = this.crossInfoCache[dateDuring[0] + '_' + dateDuring[1]];
      this.heatInfo = this.domainChange(this.crossInfo.data);
    } else {
      const crossingFields = this.getCrossFieldNode(this.xNode, this.yNode);
      const yearList = [];
      for (let i = dateDuring[0]; i < dateDuring[1]; i++) {
        yearList.push(i);
      }
      const op = 'meta';
      const method = 'overview';
      const withCache = false;
      const dt = { years: yearList, crossingFields, withCache, op };
      this.getAggregate(method, dt);
    }
  };


  domainChange = (nodeArray) => {
    const { maxBar, heatArray, maxHeat, top } = this.getMaxMinChange(nodeArray);
    const arr = nodeArray.map((item) => {
      const temp = {};
      if (item) {
        const { pubsCount, authorsCount, heat, status } = item;
        const cPub = maxBar > 0 ? Math.log(pubsCount + 1) / Math.log(maxBar + 1) : 0;
        const cAuthor = maxBar > 0 ? Math.log(authorsCount + 1) / Math.log(maxBar + 1) : 0;
        temp.cHeat = (maxHeat > 0 && heat > 0) ? this.getColor(heat, heatArray, top) : status === 'sleep' ? '#E6E5E5' : colorHeat[0];
        temp.cPub = `${(cPub * 60).toFixed(0)}px`;
        temp.cAuthor = `${(cAuthor * 60).toFixed(0)}px`;
        temp.pubsCount = pubsCount;
        temp.authorsCount = authorsCount;
        temp.heat = heat;
      } else {
        temp.cHeat = '#fff';
        temp.cPub = '0px';
        temp.cAuthor = '0px';
        temp.pubsCount = 0;
        temp.authorsCount = 0;
        temp.heat = 0;
      }
      return temp;
    });
    return arr;
  }

  getColor = (value, heatArray, top) => {
    let color = colorHeat[1];
    for (let i = heatArray.length; i > 0; i--) {
      if (value * 1 > heatArray[i]) {
        color = colorHeat[i];
        break;
      }
    }
    for (let j = 0; j < top.length; j++) {
      if (value * 1 === top[j]) {
        color = '#a92e01';
        break;
      }
    }
    return color;
  }
  getNodeChange = (y, x) => this.heatInfo[(this.xNode.length * y) + x];
  getMaxMinChange = (nodeArray) => {
    const bar = [];
    const heat = [];
    for (const item of nodeArray || []) {
      if (item) {
        bar.push(parseInt(item.pubsCount), parseInt(item.authorsCount));
        const tmpHeat = item.heat * 1;
        if (tmpHeat > 0) {
          heat.push(tmpHeat);
        }
      }
    }
    const top = heat.sort(this.sortNumDown).slice(0, 5);
    const heatSet = new Set(heat);
    const heatSetSort = [...heatSet].sort(this.sortNumUp);
    const len = heatSetSort.length > 10 ? 10 : heatSetSort.length;
    const minHeat = len > 0 ? (heatSetSort.length / len).toFixed(0) : 0;
    const heatArray = [];
    for (let i = 0; i < len; i++) {
      heatArray.push(heatSetSort[i * minHeat]);
    }
    const maxBar = Math.max(...bar);
    const maxHeat = Math.max(...heatArray);
    return { maxBar, maxHeat, heatArray, top };
  }

  // 排序
  sortNumUp = (a, b) => {
    return a - b;
  }
  sortNumDown = (a, b) => {
    return b - a;
  }
  // 对两数组交叉  返回矩阵
  getCrossFieldNode = (xNode, yNode) => {
    const crossList = [];
    yNode.map((yVal) => {
      xNode.map((xVal) => {
        crossList.push({ _1: yVal, _2: xVal });
        return true;
      });
      return true;
    });
    return crossList;
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
  // 获取所有节点 扁平化
  getNodeChildren = (tree) => {
    const list = [];
    tree.children.map(item => list.push(item.name));
    return list;
  };
  // 获取时间段，通过时间轴
  getLocalYear = (date) => {
    if (date[1] > eYear) {
      this.setState({ dateDuring: date, isHistory: false });
    } else {
      this.setState({ dateDuring: date, isHistory: true });
    }
  };


  showModel = (type, indexY, indexX, isHistory, event) => {
    if (isHistory) {
      event.stopPropagation();
      const xNode = this.xNode[indexX];
      const yNode = this.yNode[indexY];
      this.getModalContent(type, xNode, yNode);
    }
  }
  getModalContent = (type, xNode, yNode) => {
    this.domain1 = xNode;
    this.domain2 = yNode;
    this.setState({
      visibleModal: true,
      defaultTab: type,
      pubCurrent: 1,
      authorCurrent: 1,
    });
    const { dateDuring } = this.state;
    const yearList = [];
    for (let i = dateDuring[0]; i < dateDuring[1]; i++) {
      yearList.push(i);
    }
    const crossingFields = [{ _1: yNode, _2: xNode }];
    this.crossingFields = crossingFields;
    this.years = years;
    const method = 'detail';
    const withCache = true;
    const dt = { years: yearList, crossingFields, withCache };
    this.getAggregate(method, dt);
  }


  // modal 消失
  hideModal = () => {
    this.expertList = [];
    this.pubList = [];
    this.setState({ visibleModal: false, defaultTab: 'author' });
  };


  //分页
  onChangePage = (page, pageSize) => {
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
    if (this.modalType === 'author') {
      pubs = { skip: 0, limit: 10 };
      authors = { skip, limit: 10 };
      this.setState({ authorCurrent: page });
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

  getPubPerson = (type, authorsIds, pubsIds) => {
    if (type === 'author') {
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
    if (type === 'history') {
      const method = 'meta';
      const withCache = true;
      const hYear = years.slice(0, years.length - 1);
      const dt = { crossingFields: this.crossingFields, years: hYear, withCache };
      this.getAggregate(method, dt);
    }
  };

  leafNodeClick = (type, node, isHistory) => {
    if (isHistory) {
      let crossingFields = this.getCrossFieldNode([node], this.yNode);
      this.domain1 = node;
      this.domain2 = '';
      if (type === 'y') { // y轴
        crossingFields = this.getCrossFieldNode(this.xNode, [node]);
      }
      this.crossingFields = crossingFields;
      this.setState({ visibleModal: true, defaultTab: 'history' });
      this.expertList = [];
      this.pubList = [];
      const yearDuring = this.state.dateDuring;
      const yearList = [];
      for (let i = yearDuring[0]; i < yearDuring[1]; i++) {
        yearList.push(i);
      }
      const method = 'detail';
      const withCache = true;
      const dt = { years: yearList, crossingFields, withCache };
      this.getAggregate(method, dt);
    }
  }


  // 自动演示方法
  startAutoShow = (autoDomainInfo) => {
    this.timer = setInterval(() => {
      this.crossInfo = autoDomainInfo[this.countYear];
      this.heatInfo = this.domainChange(this.crossInfo.data);
      this.setState({ dateDuring: [sYear + this.countYear, sYear + this.countYear + 1] });
      this.countYear += 1;
      if (this.countYear === (years.length - 1)) {
        this.countYear = 0;
      }
    }, 1000);
  };


  // 获取自动演示数据
  getAutoDomainInfo = () => {
    const yearDomainInfo = [];
    years.map((item) => {
      const op = 'meta';
      const method = 'overview';
      const withCache = true;
      yearDomainInfo.push({
        method,
        dt: { years: [item], crossingFields: this.nodeData, withCache, op },
      });
      return true;
    });
    this.props.dispatch({
      type: 'crossHeat/getAutoDomainInfo',
      payload: { yearDomainInfo },
    });
  };


  showChange = (isShow) => {
    clearInterval(this.timer);
    this.setState({ isShow: !isShow, isAuto: true });
    // 1.获取空白行
    if (isShow) {
      const { clearYNode, clearYHeat } = this.getClearY(this.xNode, this.yNode, this.heatInfo);
      const { clearXNode, clearXHeat } = this.getClearX(this.xNode, clearYNode, clearYHeat);
      this.yNode = clearYNode;
      this.xNode = clearXNode;
      this.heatInfo = clearXHeat;
    } else {
      this.getShowXY();
    }
  };


  // 恢复空白行

  getShowXY = () => {
    const { crossTree, crossInfo, predict } = this.props.crossHeat;
    const { isHistory } = this.state;
    this.xNode = this.getNodeChildren(crossTree.queryTree2);
    this.yNode = this.getNodeChildren(crossTree.queryTree1);
    if (isHistory) {
      this.heatInfo = this.domainChange(crossInfo.data);
    } else {
      this.heatInfo = this.domainChange(predict);
    }
  }

  // 清空列
  getClearX = (xNode, yNode, heatData) => {
    const xLength = xNode.length || 0;
    const yLength = yNode.length || 0;
    const clearXNode = [];
    const tempX = [];
    for (let i = 0; i < xLength; i++) {
      let status = false;
      const tmpData = [];
      for (let j = 0; j < yLength; j++) {
        const index = i + (j * xLength);
        tmpData.push(heatData[index]);
        if (heatData[index].heat > 0) {
          status = true;
        }
      }
      if (!status) {
        tempX.push(i);
      } else {
        clearXNode.push(xNode[i]);
      }
    }
    for (const item of tempX) {
      for (let n = 0; n < yLength; n++) {
        heatData[item + (xLength * n)] = null;
      }
    }
    const clearXHeat = heatData.filter(heat => heat);
    return { clearXNode, clearXHeat };
  }
  // 清除 空白行
  getClearY = (xNode, yNode, heatData) => {
    const xLength = xNode.length || 0;
    const yLength = yNode.length || 0;
    const clearYNode = [];
    const clearYHeat = [];
    for (let i = 0; i < yLength; i++) {
      let status = false;
      for (let j = 0; j < xLength; j++) {
        if (heatData[(i * xLength) + j].heat > 0) {
          status = true;
          break;
        }
      }
      if (status) {
        const basicNum = i * xLength;
        clearYNode.push(yNode[i]);
        clearYHeat.push(...heatData.slice(basicNum, basicNum + xLength));
      }
    }
    return { clearYNode, clearYHeat };
  }

  autoChange = (isAuto) => {
    const { autoDomainInfo } = this.props.crossHeat;
    this.setState({ isAuto: !isAuto, isShow: true });
    if (isAuto) {
      if (autoDomainInfo.length === 0) {
        this.getAutoDomainInfo(); // 获取自动演示数据
      } else {
        this.startAutoShow(autoDomainInfo);
      }
    } else {
      clearInterval(this.timer);
    }
  };


  getPredict = (preYears) => {
    const { predict } = this.props.crossHeat
    if (predict) {
      this.heatInfo = this.domainChange(predict);
      this.crossInfo = { data: this.heatInfo, detail: null };
    } else {
      const op = 'meta';
      const method = 'predict';
      const withCache = true;
      const dt = { years: preYears, crossingFields: this.nodeData, withCache, op };
      this.getAggregate(method, dt);
    }
  };

  yMouseOver = (num, isHistory) => {
    if (isHistory) {
      this.setState({ iShadow: num, tShadow: 'y' });
    }
  }
  yMouseOut = () => {
    this.setState({ iShadow: -1, tShadow: '' });
  }

  xMouseOut = () => {
    this.setState({ iShadow: -1, tShadow: '' });
  }

  xMouseOver = (num, isHistory) => {
    if (isHistory) {
      this.setState({ iShadow: num, tShadow: 'x' });
    }
  }

  render() {
    const loadPage = this.props.loading.effects['crossHeat/getPageInfo'];
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadAggregate = this.props.loading.effects['crossHeat/getAggregate'];
    const loadAutoDomainInfo = this.props.loading.effects['crossHeat/getAutoDomainInfo'];
    const { crossTree } = this.props.crossHeat;
    const { iShadow, tShadow } = this.state;
    const { isShow, isHistory, xWidth, isAuto, dateDuring, pubCurrent, authorCurrent } = this.state;
    let tabTitle = `${this.domain1} & ${this.domain2}`;
    if (this.domain1 === '' || this.domain2 === '') {
      tabTitle = this.domain2 + this.domain1;
    }
    const { modalInfo, history } = this.props.crossHeat;
    let historyPub = {};
    let historyExpert = {};
    if (history && history.length > 0) {
      const dataPub = [];
      const dataExpert = [];
      history[0].metaData.map((item) => {
        dataExpert.push(item.authorsCount);
        dataPub.push(item.pubsCount);
        return true;
      });
      historyPub = {
        id: 'publine',
        xAxis: years.slice(0, years.length - 1),
        data: dataPub,
        title: '历史论文数据',
        legend: ['历史论文数据'],
      };
      historyExpert = {
        id: 'expertline',
        xAxis: years.slice(0, years.length - 1),
        data: dataExpert,
        title: '历史专家数据',
        legend: ['历史专家数据'],
      };
    }

    const showInfo = isShow ? '隐藏空白行列' : '展示空白行列';
    const autoInfo = isAuto ? '自动演示' : '暂停演示';
    const operations = <span>{tabTitle}</span>;
    return (
      <Layout searchZone={[]} contentClass={tc(['heatLayout'])} showNavigator={false}>
        <div>
          <Brush getLocalYear={this.getLocalYear} xWidth={xWidth} yearBuring={dateDuring}
                 isAuto />
        </div>
        <div className={styles.actionBar}>
          <div>
            <span className={styles.title}>{this.title}</span>
            <span className={styles.title}>
              {dateDuring[0]}～ {dateDuring[1] > eYear ? eYear + 3 : dateDuring[1]}
            </span>
            <span className={styles.title}>
              {dateDuring[1] > eYear ? '趋势预测' : '交叉热点'}
            </span>
            <Button type="default"
                    onClick={this.showChange.bind(this, isShow)}>{showInfo}
            </Button>
            <Button type="default"
                    onClick={this.autoChange.bind(this, isAuto)}>{autoInfo}
            </Button>
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

        <div className={styles.mainBody}>
          <Spinner loading={loadTree || loadAggregate || loadAutoDomainInfo}
                   size="large" />
          {this.crossInfo &&
          <div className={styles.statistic}>
            <CrossStatistics cross={this.crossInfo} nodeData={this.nodeData}
                             getModalContent={this.getModalContent} />
          </div>
          }
          <div className={styles.heatLayout}>
            <div className={styles.yAxis}>
              { this.yNode.map((item, index) => {
                return (
                  <div className={styles.yVal} key={index.toString()}>
                  <span onMouseOut={this.yMouseOut}
                        className={isHistory ? styles.yTiltle : styles.yTiltleDefault}
                        onClick={this.leafNodeClick.bind(this, 'y', item, isHistory)}
                        onMouseOver={this.yMouseOver.bind(this, index, isHistory)}>{item}</span>
                  </div>
                );
              })}
            </div>
            <div>
              { this.heatInfo.length > 0 &&
              <div className={styles.heat}>
                { this.yNode.map((yNode, indexY) => {
                  return (
                    <div className={styles.heatY}
                         key={indexY.toString()}>
                      { this.xNode.map((xNode, indexX) => {
                        const { cHeat, cAuthor, cPub, authorsCount, pubsCount } = this.getNodeChange(indexY, indexX);
                        return (
                          <div
                            onClick={this.showModel.bind(this, 'history', indexY, indexX, isHistory)}
                            className={isHistory ? (tShadow === 'y' ? (iShadow === indexY ? styles.yShadow : styles.heatX) : (iShadow === indexX ? styles.xShadow : styles.heatX)) : styles.heatXDefault}
                            style={{ backgroundColor: cHeat }}
                            key={indexX.toString()}>
                            <div className={styles.author}
                                 style={{ width: cAuthor }} alt="专家"
                                 onClick={this.showModel.bind(this, 'author', indexY, indexX, isHistory)}

                            >
                              { authorsCount > 0 &&
                              <span>{authorsCount}</span>
                              }
                            </div>
                            <div className={styles.pub}
                                 style={{ width: cPub }} alt="论文"
                                 onClick={this.showModel.bind(this, 'pub', indexY, indexX, isHistory)}>
                              { pubsCount > 0 &&
                              <span> {pubsCount}</span>
                              }
                            </div>
                          </div>
                        );
                      })
                      }
                    </div>
                  );
                })}
              </div>
              }
              <div className={styles.xAxis}>
                {this.xNode.map((item, index) => {
                  return (
                    <div className={styles.titleLayout} key={index.toString()}>
                      <div className={isHistory ? styles.xTitle : styles.xTitleDefault}
                           onMouseOver={this.xMouseOver.bind(this, index, isHistory)}
                           onClick={this.leafNodeClick.bind(this, 'x', item, isHistory)}
                           onMouseOut={this.xMouseOut}>{item.trim()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div >
        </div>

        {/*modal*/}
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
            <TabPane tab="专家" key="author">
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
                            current={authorCurrent}
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

            <TabPane tab="趋势" key="history">
              <Spinner loading={loadAggregate} />
              {modalInfo &&
              <div className={styles.modalContent}>
                {history &&
                <div>
                  <History param={historyPub} />
                  <History param={historyExpert} />
                </div>
                }
              </div>
              }
            </TabPane>
          </Tabs>
        </Modal>


      </Layout >
    );
  }
}
export default connect(({ crossHeat, app, loading }) => ({
  crossHeat,
  app,
  loading,
}))(Heat);
