/**
 *  Created by BoGao on 2017-06-07;
 *  Refactor on 2017-10-26;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { Button, Modal, Icon, Tabs } from 'antd';
import { applyTheme } from 'themes';
import { FormattedMessage as FM } from 'react-intl';
import queryString from 'query-string';
import { Auth } from 'hoc';
import { detectSavedMapType, compare } from 'utils';
import { DomainSelector, MapFilter } from 'routes/expert-map';
import * as strings from 'utils/strings';
import loadScript from 'load-script';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertMapPage.less';

const tc = applyTheme(styles);
const [ButtonGroup, TabPane] = [Button.Group, Tabs.TabPane];

const MAP_DISPATCH_KEY = 'map-dispatch';
let echarts;

@connect(({ app, expertMap }) => ({ app: { user: app.user, roles: app.roles }, expertMap }))
@Auth
export default class ExpertMapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    mapType: '', // [baidu|google]
    query: '',
    domainId: '', //领域id
    range: '', // Filter by acm, ieee
    hindexRange: '', // Filter by hindex
    type: '0', // 根据地图显示类型，默认为0
    visible: false, //模态框是否可见
  };

  componentWillMount() {
    const { location } = this.props;
    const { query, type, domain } = queryString.parse(location.search);
    const mapType = type || detectSavedMapType(MAP_DISPATCH_KEY); //判断该使用什么样的地图
    const q = query || 'Data Mining';
    this.setState({
      query: domain ? '' : q,
      domainId: domain,
      mapType,
    });
    // first laod.
    if (domain) {
      this.searchMapByDomain(domain);
    } else if (q) {
      this.searchMapByQuery(q);
    }
  }

  componentDidMount() {
    loadScript('/lib/echarts.js', () => {
      echarts = window.echarts; // eslint-disable-line prefer-destructuring
    });
  }

  componentWillReceiveProps(np) {
    const { location } = np;
    const { query, type, domain } = queryString.parse(location.search);
    if (this.state.type !== type) {
      const mapType = type || detectSavedMapType(MAP_DISPATCH_KEY);
      this.setState({ mapType });
    }
    if (this.state.query !== query) {
      this.setState({ query });
    }
    if (this.state.domain !== domain) {
      this.setState({ domainId: domain });
    }
  }

  // TODO use did update ?
  shouldComponentUpdate(np, ns) { // nextProps, nextState
    if (ns.domainId && ns.domainId !== this.state.domainId) {
      this.searchMapByDomain(ns.domainId);
      return true;
    }
    if (ns.query && ns.query !== this.state.query) {
      this.searchMapByQuery(ns.query);
      return true;
    }
    if (compare(ns, this.state, 'mapType', 'range', 'hindexRange', 'type')) {
      return true;
    }
    if (ns.visible !== this.state.visible) {
      return true;
    }
    return false;
  }

  onDomainChange = (domain) => { //修改url,shouldComponentUpdate更新
    const { dispatch } = this.props;
    dispatch(routerRedux.push({ pathname: '/expert-map', search: `?domain=${domain.id}` }));
  };

  onRangeChange = (key) => {
    this.setState({ range: key });
  };

  onHindexRangeChange = (key) => {
    this.setState({ hindexRange: key });
  };

  onSearch = (data) => { //修改url,shouldComponentUpdate更新
    const { dispatch } = this.props;
    if (data.query) {
      this.setState({ query: data.query });
      dispatch(routerRedux.push({
        pathname: '/expert-map',
        search: `?query=${data.query}`,
      }));
    }
  };

  // Tips: 不会根据state变化的jsx block放到外面。这样多次渲染的时候不会多次初始化;
  // titleBlock = <h1>专家地图:</h1>;

  onTypeChange = (type) => {
    this.setState({ type });
  };

  onMapTypeChange = (mapType) => {
    localStorage.setItem(MAP_DISPATCH_KEY, mapType);
    this.setState({ mapType });
  };

  searchMapByDomain = (domainEBID) => { //models里面重新查询数据
    const { dispatch } = this.props;
    dispatch({ type: 'expertMap/searchExpertBaseMap', payload: { eb: domainEBID } });
    this.resetRightInfo();
  };

  searchMapByQuery = (query) => { //models里面重新查询数据
    this.props.dispatch({
      type: 'expertMap/searchMap',
      payload: { query: strings.firstNonEmptyQuery(query) },
    });
    this.resetRightInfo(); //右边的置为全局的
  };

  resetRightInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'expertMap/setRightInfo',
      payload: { idString: '', rightInfoType: 'global' },
    });
  };

  typeConfig = [
    { key: '0', label: '自动' },
    { key: '1', label: '大区' },
    { key: '2', label: '国家' },
    { key: '3', label: '国内区', disabled: true },
    { key: '4', label: '城市' },
    { key: '5', label: '机构' },
  ];

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  changeStatistic = (key) => {
    console.log(key);
  };


  render() {
    const { mapType, query, domainId } = this.state;
    const options = { ...this.state, title: this.titleBlock };//以便传入到组件里面

    let staJsx;
    staJsx = (
      <div id="bycountries">

      </div>
    );

    return (
      <Layout
        contentClass={tc(['expertMapPage'])}
        query={query}
        onSearch={this.onSearch}
        disableAdvancedSearch
      >
        <DomainSelector
          domains={sysconfig.Map_HotDomains}
          currentDomain={domainId}
          onChange={this.onDomainChange}
          time={Math.random()}
        />
        <MapFilter
          onRangeChange={this.onRangeChange}
          onHindexRangeChange={this.onHindexRangeChange}
        />

        <div className={styles.headerLine}>
          <div className={styles.left}>
            <div className={styles.level}>
              <span>
                <FM defaultMessage="Baidu Map"
                    id="com.expertMap.headerLine.label.level" />
              </span>
              <ButtonGroup id="sType" className={styles.sType}>
                {this.typeConfig.map((conf) => {
                  return !conf.disabled && (
                    <Button
                      key={conf.key}
                      onClick={this.onTypeChange.bind(this, conf.key)}
                      type={this.state.type === conf.key ? 'primary' : ''}
                    >
                      {conf.label}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>
          </div>

          <div className={styles.scopes}>
            <div className={styles.analysis}>
              <Button onClick={this.showModal}>
                <Icon type="line-chart" />
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.statistic" />
              </Button>
              <Modal
                title="Results"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" size="large" onClick={this.handleCancel}>
                    <Icon type="download" />
                    <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.download" />
                  </Button>,
                  <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                    <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
                  </Button>,
                ]}
              >
                <Tabs defaultActiveKey="1" onChange={this.changeStatistic}>
                  <TabPane tab="地区" key="1">{staJsx && staJsx}</TabPane>
                  <TabPane tab="华人" key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
              </Modal>
            </div>
            <div className={styles.switch}>
              <ButtonGroup id="diffmaps">
                <Button
                  type={this.state.mapType === 'baidu' ? 'primary' : ''}
                  onClick={this.onMapTypeChange.bind(this, 'baidu')}
                >
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.baiduMap" />
                </Button>
                <Button
                  type={this.state.mapType === 'google' ? 'primary' : ''}
                  onClick={this.onMapTypeChange.bind(this, 'google')}
                >
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.googleMap" />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        {mapType === 'google'
          ? <ExpertGoogleMap {...options} />
          : <ExpertMap {...options} />
        }
        <div id="test"></div>
      </Layout>
    );
  }
}
