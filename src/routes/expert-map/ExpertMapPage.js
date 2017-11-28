import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Layout } from 'routes';
import { sysconfig } from 'systems';
import { Button, Modal, Icon, Tabs, message, notification, Alert } from 'antd';
import { applyTheme } from 'themes';
import { FormattedMessage as FM } from 'react-intl';
import queryString from 'query-string';
import { Auth } from 'hoc';
import { detectSavedMapType, compare } from 'utils';
import { DomainSelector, MapFilter } from 'routes/expert-map';
import * as strings from 'utils/strings';
import { loadECharts } from 'utils/requirejs';
import ExpertGoogleMap from './expert-googlemap.js';
import ExpertMap from './expert-map.js';
import styles from './ExpertMapPage.less';
import { showSta, sortByBigArea, sortByCountries } from './utils/sta-utils';

const tc = applyTheme(styles);
const [ButtonGroup, TabPane] = [Button.Group, Tabs.TabPane];
let echarts;

const MAP_DISPATCH_KEY = 'map-dispatch';

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
    const q = query || '-';
    this.setState({
      query: domain ? '' : q,
      domainId: domain,
      mapType,
    });
    // first load.
    if (domain) {
      this.searchMapByDomain(domain);
    } else if (q) {
      this.searchMapByQuery(q);
      this.setState({ domainId: 'aminer' });
    }
  }

  componentDidMount() {
    loadECharts((ret) => {
      echarts = ret;
      if ((this.state.query === '' || this.state.query === '-') &&
        (this.state.domainId === '' || this.state.domainId === 'aminer') ) {
        this.openNotification();
      }
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

  shouldComponentUpdate(np, ns) { // nextProps, nextState
    if (ns.domainId && ns.domainId !== this.state.domainId && ns.domainId !== 'aminer') {
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
    if (np.expertMap.geoData !== this.props.expertMap.geoData) {
      return true;
    }
    return false;
  }

  openNotification = () => {
    let [message, description] = ['', ''];
    sysconfig.Locale === 'en' ? [message, description] = ['Attention Please!','You have an invalid keyword!Please select a domain keyword or type a keyword to see what you want!'] : [message, description] = ['请注意！','您当前的搜索词为空，请您输入选择一个搜索词或者领域进行搜索！'];
    notification.open({
      message: message,
      description: description,
      duration: 8,
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
    });
  };

  onDomainChange = (domain) => { //修改url,shouldComponentUpdate更新
    const { dispatch } = this.props;
    if (domain.id !== 'aminer') {
      this.setState({ query: '' });
      dispatch(routerRedux.push({ pathname: '/expert-map', search: `?domain=${domain.id}` }));
    } else {
      const data = { query: this.state.query || '-' };
      this.onSearch(data);
    }
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
      this.setState({ query: data.query, domainId: 'aminer' });
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
    if (query === '' || query === '-') {
      return;
    }
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
    }, () => {
      const chartsinterval = setInterval(() => {
        const divId = document.getElementById('bycountries');
        const data = this.props.expertMap.geoData;
        if (typeof (divId) !== 'undefined' && divId !== 'undefined'
          && typeof (data.results) !== 'undefined' && data.results !== 'undefined') {
          clearInterval(chartsinterval);
          showSta(echarts, divId, data, 'country');
        }
      }, 100);
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  changeStatistic = (key) => {
    const chartsinterval = setInterval(() => {
      let divId;
      let type;
      if (key === 1) {
        divId = document.getElementById('bycountries');
        type = 'country';
      } else {
        divId = document.getElementById('bigArea');
        type = 'bigArea';
      }
      const data = this.props.expertMap.geoData;
      if (typeof (divId) !== 'undefined' && divId !== 'undefined'
        && typeof (data.results) !== 'undefined' && data.results !== 'undefined') {
        clearInterval(chartsinterval);
        showSta(echarts, divId, data, type);
      }
    }, 100);
  };

  handleDownload = () => {
    const downloadinterval = setInterval(() => {
      const data = this.props.expertMap.geoData;
      if (typeof (data.results) !== 'undefined' && data.results !== 'undefined') {
        clearInterval(downloadinterval);
        this.downloadSta(data);
      }
    }, 100);
  };

  downloadSta = (data) => {
    let str = '';
    const d1 = sortByCountries(data);
    const d2 = sortByBigArea(data);
    str = '1.Statistics according to the states are as follows:\n\n';
    str += 'names,values\n';
    for (const dd of d1.result) {
      str += `${dd.name},${dd.value}\n`;
    }
    str += '\n\n\n\n2.Statistics by regions are as follows:\n\n';
    str += 'names,values\n';
    for (const ddd of d2.result) {
      str += `${ddd.name},${ddd.value}\n`;
    }
    const bom = '\uFEFF';
    str = encodeURI(str);
    const link = window.document.createElement('a');
    link.setAttribute('href', `data:text/csv;charset=utf-8,${bom}${str}`);
    link.setAttribute('download', 'statistics.csv');
    link.click();
  };


  render() {
    const { mapType, query, domainId } = this.state;
    const options = { ...this.state, title: this.titleBlock };//以便传入到组件里面

    const staJsx = (
      <div className={styles.charts}>
        <div id="bycountries" className={styles.chart1} />
      </div>
    );

    const staJsx1 = (
      <div className={styles.charts}>
        <div id="bigArea" className={styles.chart1} />
      </div>
    );
    //const hdType = 'selector';
    const hdType = sysconfig.HotDomains_Type;
    const hdFlag = (hdType === 'filter');
    const dp = hdFlag ? 'none' : '';
    return (
      <Layout
        contentClass={tc(['expertMapPage'])}
        query={query}
        onSearch={this.onSearch}
        disableAdvancedSearch
      >
        {
          hdFlag && <DomainSelector
            domains={sysconfig.Map_HotDomains}
            domainsLabel={sysconfig.Map_HotDomainsLabel}
            currentDomain={domainId}
            onChange={this.onDomainChange}
            time={Math.random()}
            type={hdType}
          />
        }
        <MapFilter
          onRangeChange={this.onRangeChange}
          onHindexRangeChange={this.onHindexRangeChange}
          MapFilterRange={sysconfig.Map_FilterRange}
        />

        <div className={styles.headerLine}>
          <div style={{ display: dp }}>
            {
              !hdFlag && <DomainSelector
                domains={sysconfig.Map_HotDomains}
                domainsLabel={sysconfig.Map_HotDomainsLabel}
                currentDomain={domainId}
                onChange={this.onDomainChange}
                time={Math.random()}
                type={hdType}
              />
            }
          </div>
          <div className={styles.left}>
            <div className={styles.level}>
              <span>
                <FM defaultMessage="Baidu Map"
                    id="com.expertMap.headerLine.label.level" />
              </span>
              <ButtonGroup id="sType" className={styles.sType}>
                {this.typeConfig.map((conf) => {
                  return !conf.disabled && (
                    <Button key={conf.key} onClick={this.onTypeChange.bind(this, conf.key)} onKeyDown={() => {}} type={this.state.type === conf.key ? 'primary' : ''}>
                      {conf.label}
                    </Button>
                    );
                })}
              </ButtonGroup>
            </div>
          </div>

          <div className={styles.scopes}>
            <div className={styles.analysis}>
              {process.env.NODE_ENV !== 'production' &&
              <Button onClick={this.showModal}>
                <Icon type="line-chart" />
                <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.statistic" />
              </Button>}
              <Modal
                title="Statistics & Analyses"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" size="large" onClick={this.handleDownload.bind(this)}>
                    <Icon type="download" />
                    <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.download" />
                  </Button>,
                  <Button key="submit" type="primary" size="large" onClick={this.handleOk}>
                    <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.ok" />
                  </Button>,
                ]}
                width="700px"
              >
                <Tabs defaultActiveKey="1" onChange={this.changeStatistic}>
                  <TabPane tab="国家" key="1">{staJsx && staJsx}</TabPane>
                  <TabPane tab="大区" key="2">{staJsx1 && staJsx1}</TabPane>
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
      </Layout>
    );
  }
}
