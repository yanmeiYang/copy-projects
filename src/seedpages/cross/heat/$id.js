/**
 * Created by ranyanchuan on 2017/9/15.
 */
import React from 'react';
import { routerRedux, withRouter } from 'engine';
import { connect } from 'dva';
import { Modal, Button, Tabs, Pagination } from 'antd';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { Layout } from 'components/layout';
import { PersonList } from 'components/person';

import { applyTheme } from 'themes';
import { Auth, RequireRes } from 'hoc';
import * as bridge from 'utils/next-bridge';

import { PublicationList } from 'components/publication/index';
import CrossContrast from '../components/contrast/index';
import CrossStatistics from '../components/statistics/index';
import Brush from '../components/time-brush/index';
import HeatTable from '../components/heat-table/index';
import History from '../components/line-chart/index';

import styles from './$id.less';

const tc = applyTheme(styles);
const TabPane = Tabs.TabPane;
const localDate = new Date();
const eYear = localDate.getFullYear() + 1;
const sYear = 2007;
const years = [];
const rYear = [];
for (let i = sYear; i <= eYear; i++) {
  years.push(i);
  if (i !== eYear) {
    rYear.push(i);
  }
}

@withRouter
@Auth
class Heat extends React.Component {
  state = {
    dateDuring: [sYear, eYear],
    defaultTab: 'author',
    pubCurrent: 1,
    authorCurrent: 1,
    isShow: true,
    isAuto: true,
    isHistory: true,
  }

  crossingFields = null;
  crossInfo = null;
  crossTree = null;
  crossInfoCache = {};
  title = '';
  first10Authors = [];
  first10Pubs = [];
  expertList = [];
  pubList = [];
  countYear = 0;
  timer = 0;

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch({ type: 'crossHeat/getCrossFieldById', payload: { id } });
  }

  componentWillUpdate(nextProps, nextState) {
    const { crossTree, crossInfo, predict, experts, pubs, modalInfo, pageInfo, autoDomainInfo } = this.props.crossHeat;
    const { defaultTab, dateDuring, isAuto, isShow } = this.state;
    const nCrossTree = nextProps.crossHeat.crossTree;
    const nDate = nextState.dateDuring;
    if (isShow && (nCrossTree !== null) && (nCrossTree !== crossTree)) {
      const { xNode, yNode, crossList } = nCrossTree;
      this.crossTree = nCrossTree;
      this.title = `${yNode[0]} & ${xNode[0]}`;
      this.getDomainInfo([sYear, eYear], crossList);
    }
    const nCrossInfo = nextProps.crossHeat.crossInfo;
    const nPredict = nextProps.crossHeat.predict;
    if (crossInfo !== nCrossInfo || predict !== nPredict) { // 热力值改变
      this.crossInfoCache[`${nDate[0]}_${nDate[1]}`] = nCrossInfo;
      this.crossInfo = crossInfo !== nCrossInfo ? nCrossInfo : nPredict;
    }
    if (isAuto && (nDate[0] !== dateDuring[0] || nDate[1] !== dateDuring[1])) {
      this.getShowXY();
      if (nDate[0] < eYear) {
        this.getDomainInfo([nDate[0], nDate[1]], nCrossTree.crossList);
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
    const nModalInfo = nextProps.crossHeat.modalInfo;
    const nPageInfo = nextProps.crossHeat.pageInfo;
    if (modalInfo !== nModalInfo || pageInfo !== nPageInfo) { // modal info & 分页
      const info = modalInfo !== nModalInfo ? nModalInfo : nPageInfo;
      this.first10Authors = info.authors.top10 || info.authors;
      this.first10Pubs = info.pubs.top10 || info.pubs;
      this.getPubPerson(defaultTab, this.first10Authors, this.first10Pubs);
    }
    const nAutoDomainInfo = nextProps.crossHeat.autoDomainInfo;
    if (autoDomainInfo !== nAutoDomainInfo && nAutoDomainInfo.length > 0) { // autoDomainInfo
      this.startAutoShow(nAutoDomainInfo);
    }
  }

  getDomainInfo = (yearData, crossingFields) => { // 获取 DomainInfo
    const temp = this.crossInfoCache[`${yearData[0]}_${yearData[1]}`];
    if (temp) { //从缓存中获取
      this.crossInfo = temp;
    } else {
      const yearList = this.getYearList(yearData[0], yearData[1]);
      const dt = { years: yearList, crossingFields, withCache: false, op: 'meta' };
      this.getAggregate('overview', dt);
    }
  };
  getAggregate = (method, dt) => this.props.dispatch({
    type: 'crossHeat/getAggregate', payload: { method, dt },
  });
  getLocalYear = (date) => { // 获取时间段，通过时间轴
    const isHistory = !(date[1] > eYear);
    this.setState({ dateDuring: date, isHistory });
  };
  getModalContent = (defaultTab, crossingFields, tabTitle) => {
    clearInterval(this.timer);
    this.setState({ isAuto: true, isShow: true });
    this.crossingFields = crossingFields;
    this.tabTitle = tabTitle;
    this.setState({ visibleModal: true, defaultTab, pubCurrent: 1, authorCurrent: 1 });
    const { dateDuring } = this.state;
    const yearList = this.getYearList(dateDuring[0], dateDuring[1]);
    const dt = { years: yearList, crossingFields, withCache: true };
    this.getAggregate('detail', dt);
  }
  getYearList = (sY, eY) => { // 获取日期数组
    const yearList = [];
    for (let item = sY; item < eY; item++) {
      yearList.push(item);
    }
    return yearList;
  }
  hideModal = () => { // modal 消失
    this.expertList = [];
    this.pubList = [];
    this.setState({ visibleModal: false, defaultTab: 'author' });
  };
  onChangePage = (page, pageSize) => { // 分页
    const { defaultTab } = this.state;
    const skip = (page - 1) * pageSize;
    let pubs = null;
    let authors = null;
    if (defaultTab === 'pub') {
      this.setState({ pubCurrent: page });
      pubs = { skip, limit: 10 };
      authors = { skip: 0, limit: 10 };
    }
    if (defaultTab === 'author') {
      pubs = { skip: 0, limit: 10 };
      authors = { skip, limit: 10 };
      this.setState({ authorCurrent: page });
    }
    const cFields = this.crossingFields;
    const { dateDuring } = this.state;
    const yearList = this.getYearList(dateDuring[0], dateDuring[1]);
    const dt = { years: yearList, crossingFields: cFields, withCache: true, pubs, authors };
    this.getPageInfo('slice', dt);
  };
  getPageInfo = (method, dt) => {
    this.props.dispatch({ type: 'crossHeat/getPageInfo', payload: { method, dt } });
  }
  modalTab = (type) => {
    this.setState({ defaultTab: type });
    this.getPubPerson(type, this.first10Authors, this.first10Pubs);
  }
  getPubPerson = (type, authorsIds, pubsIds) => {
    if (type === 'author') {
      this.props.dispatch({ type: 'crossHeat/getDomainExpert', payload: { ids: authorsIds } });
    }
    if (type === 'pub') {
      this.props.dispatch({ type: 'crossHeat/getDomainPub', payload: { ids: pubsIds } });
    }
    if (type === 'history') {
      const dt = { crossingFields: this.crossingFields, years: rYear, withCache: true };
      this.getAggregate('meta', dt);
    }
  };
  startAutoShow = (autoDomainInfo) => { // 自动演示方法
    this.timer = setInterval(() => {
      this.crossInfo = autoDomainInfo[this.countYear];
      const sY = sYear + this.countYear;
      const eY = sYear + this.countYear + 1;
      this.setState({ dateDuring: [sY, eY] });
      this.crossInfoCache[`${sY}_${eY}`] = autoDomainInfo[this.countYear];
      this.countYear += 1;
      if (this.countYear === rYear.length) {
        this.countYear = 0;
      }
    }, 1000);
  };
  getAutoDomainInfo = () => { // 获取自动演示数据
    const { crossList } = this.props.crossHeat.crossTree;
    const yearDomainInfo = [];
    for (const item of rYear) {
      const dt = { years: [item], crossingFields: crossList, withCache: true, op: 'meta' };
      yearDomainInfo.push({ method: 'overview', dt });
    }
    this.props.dispatch({ type: 'crossHeat/getAutoDomainInfo', payload: { yearDomainInfo } });
  };
  showChange = (isShow) => {
    clearInterval(this.timer);
    this.setState({ isShow: !isShow, isAuto: true });
    if (isShow) {
      const { xNode, yNode } = this.crossTree;
      const { data, detail, top, result } = this.crossInfo;
      const { clearYNode, clearYHeat } = this.getClearY(xNode, yNode, data);
      const { clearXNode, clearXHeat } = this.getClearX(xNode, clearYNode, clearYHeat);
      const crossList = this.getCrossFieldNode(clearYNode, clearXNode);
      this.crossTree = { xNode: clearXNode, yNode: clearYNode, crossList };
      this.crossInfo = { data: clearXHeat, detail, top, result };
    } else {
      this.getShowXY();
    }
  };
  getShowXY = () => { // 恢复空白行
    const { dateDuring } = this.state;
    const { crossTree, predict } = this.props.crossHeat;
    const { isHistory } = this.state;
    this.crossTree = crossTree;
    this.crossInfo = isHistory ? this.crossInfoCache[`${dateDuring[0]}_${dateDuring[1]}`] : predict;
  }
  // todo 清空列 算法优化
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
        if (heatData[index].cHeat !== '#FFFFFF') {
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
  //todo 清空行 算法优化
  getClearY = (xNode, yNode, heatData) => {
    const xLength = xNode.length || 0;
    const yLength = yNode.length || 0;
    const clearYNode = [];
    const clearYHeat = [];
    for (let i = 0; i < yLength; i++) {
      let status = false;
      for (let j = 0; j < xLength; j++) {
        if (heatData[(i * xLength) + j].cHeat !== '#FFFFFF') {
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
    this.getShowXY();
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
  getPredict = (preYears) => { // 获取预测数据
    const { predict, crossTree } = this.props.crossHeat;
    const { crossList } = crossTree;
    if (predict) {
      this.crossInfo = predict;
    } else {
      const op = 'meta';
      const method = 'predict';
      const withCache = true;
      const dt = { years: preYears, crossingFields: crossList, withCache, op };
      this.getAggregate(method, dt);
    }
  };
  getCrossFieldNode = (yNode, xNode) => {
    const crossList = [];
    for (const yVal of yNode) {
      for (const xVal of xNode) {
        crossList.push({ _1: yVal, _2: xVal });
      }
    }
    return crossList;
  }

  goReport = () => {
    const { id } = this.props.match.params;
    this.props.dispatch(routerRedux.push({
      pathname: `/cross/reportExport/${id}`,
    }));
  }

  render() {

    const loadCrossField = this.props.loading.effects['crossHeat/getCrossFieldById'];
    const loadPage = this.props.loading.effects['crossHeat/getPageInfo'];
    const loadPub = this.props.loading.effects['crossHeat/getDomainPub'];
    const loadExpert = this.props.loading.effects['crossHeat/getDomainExpert'];
    const loadTree = this.props.loading.effects['crossHeat/getCrossTree'];
    const loadAggregate = this.props.loading.effects['crossHeat/getAggregate'];
    const loadAutoDomainInfo = this.props.loading.effects['crossHeat/getAutoDomainInfo'];
    const { isShow, isHistory, visibleModal, xWidth, isAuto, dateDuring, pubCurrent, authorCurrent } = this.state;
    const { modalInfo, history } = this.props.crossHeat;
    const dataPub = [];
    const dataExpert = [];
    if (history && history.length > 0) {
      for (const item of history[0].metaData) {
        dataExpert.push(item.authorsCount);
        dataPub.push(item.pubsCount);
      }
    }
    const showInfo = isShow ? '隐藏空白行列' : '展示空白行列';
    const autoInfo = isAuto ? '自动演示' : '暂停演示';
    const loading = visibleModal ? false : loadAggregate;
    const spinner = loadCrossField || loadTree || loading || loadAutoDomainInfo;

    const operations = <span className={styles.tabTitle}>{this.tabTitle}</span>;
    return (
      <Layout searchZone={[]} contentClass={tc(['heatLayout'])}
              showNavigator={sysconfig.Cross_HasNavigator}>
        <Spinner loading={spinner} size="large" />
        <div>
          <Brush getLocalYear={this.getLocalYear} xWidth={xWidth} yearBuring={dateDuring}
                 isAuto />
        </div>
        <div className={styles.actionBar}>
          <div>
            <span className={styles.title}>{this.title}</span>
            <span className={styles.title}>
              {dateDuring[0]} ～ {dateDuring[1] > eYear ? eYear + 3 : dateDuring[1]}
            </span>
            <span className={styles.title}>{dateDuring[1] > eYear ? '趋势预测' : '交叉热点'}</span>
            <Button type="default" className={styles.tabBtn}
                    onClick={this.showChange.bind(this, isShow)}>{showInfo}
            </Button>
            <Button type="default" className={styles.tabBtn}
                    onClick={this.autoChange.bind(this, isAuto)}>{autoInfo}
            </Button>
          </div>
          <div>
            <a href="#" className={styles.tabBtn}>
              <Button type="default" onClick={this.goReport}>查看报告</Button>
            </a>
            <a href="/cross/startTask" className={styles.tabBtn}>
              <Button type="default">挖掘热点</Button>
            </a>
            <a href="/cross/index" className={styles.tabBtn}>
              <Button type="default">返回首页</Button>
            </a>
          </div>
        </div>
        <div className={styles.mainBody}>
          {this.crossInfo &&
          <div>
            <div className={styles.statistic}>
              <CrossStatistics cross={this.crossInfo} getModalContent={this.getModalContent} />
            </div>
            <HeatTable
              isHistory={isHistory}
              crossInfo={this.crossInfo}
              crossTree={this.crossTree}
              getModalContent={this.getModalContent}
            />
          </div>
          }
        </div>
        {/*modal*/}
        <Modal
          className={styles.heatModal}
          width={800}
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
                  <History id="publine" xAxis={rYear} data={dataPub} toolboxShow />
                  <div className={styles.tableFooter}>图1 {this.tabTitle}历史论文数据</div>
                  <History id="expertline" xAxis={rYear} data={dataExpert} toolboxShow />
                  <div className={styles.tableFooter}>图2 {this.tabTitle}历史专家数据</div>
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
export default connect(({ crossHeat, app, loading }) => ({ crossHeat, app, loading }))(Heat);
