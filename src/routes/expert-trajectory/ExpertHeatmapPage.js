import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Spinner } from 'components';
import { DomainSelector } from 'routes/expert-map';
import { FormattedMessage as FM } from 'react-intl';
import { applyTheme, theme } from 'themes';
import { Layout as Page } from 'routes';
import { Layout, Tabs, Button, Icon, TreeSelect, Menu, Dropdown, Checkbox, message, Modal } from 'antd';
import styles from './ExpertHeatmapPage.less';
import ExpertHeatmap from './ExpertHeatmap';
import { showBulkTraj, downloadData } from './utils/heatmap-statistic';


const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Location', 'Heat', 'Trajectory'];
const defaultCheckedList = ['Location', 'Heat', 'Trajectory'];
const tc = applyTheme(styles);
const themes = [
  { label: '常规', key: '0' },
  { label: '商务', key: '1' },
  { label: '黑暗', key: '2' },
  { label: '抹茶绿', key: '3' },
  { label: '牛皮纸', key: '4' },
  { label: '航海家', key: '5' },
  { label: '简约风', key: '6' },
];

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值
    domainId: '', //领域id
    themeKey: '2', //皮肤的I
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: true,
    embeded: false,
  };

  componentWillMount() {
    const { location } = this.props;
    const { query, domain, flag } = queryString.parse(location.search);
    const q = query || ''; //设置一个默认值
    this.setState({
      query: q,
    });
    if (domain) {
      this.setState({ domainId: domain });
      this.searchTrajByDomain(domain);
    } else if (q) {
      this.searchTrajByQuery(q);
      this.setState({ domainId: 'aminer' });
    } else {
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-heatmap',
      }));
    }
    if (flag) { //undefined的非是true
      this.setState({
        embeded: true,
      });
    } else {
      this.setState({
        embeded: false,
      });
    }
  }

  componentDidMount() {

  }

  componentWillReceiveProps(np) {
    const { location } = np;
    const { query, domain } = queryString.parse(location.search);
    if (this.state.query !== query) {
      this.setState({ query });
    }
    if (this.state.domain !== domain) {
      this.setState({ domainId: domain });
    }
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.searchTrajByQuery(nextState.query);
    }
    if (nextState.domainId && nextState.domainId !== this.state.domainId) {
      this.searchTrajByDomain(nextState.domainId);
    }
    if (nextProps.loading && nextProps.loading !== this.props.loading) {
      return true;
    }
    return true;
  }

  onSearch = (data) => {
    const { dispatch } = this.props;
    if (data.query) {
      this.setState({ query: data.query });
      dispatch(routerRedux.push({
        pathname: '/expert-heatmap',
        search: `?query=${data.query}`,
      }));
    }
  };

  onDomainChange = (domain) => { //修改url,shouldComponentUpdate更新
    const { dispatch } = this.props;
    if (domain.id !== 'aminer') {
      this.setState({ query: '' });
      dispatch(routerRedux.push({ pathname: '/expert-heatmap', search: `?domain=${domain.id}` }));
    } else {
      const data = { query: this.state.query || '-' };
      this.onSearch(data);
    }
  };

  onSkinClick = (value) => {
    this.setState({ themeKey: value.key });
  };

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  searchTrajByDomain = (domainEBID) => { //models里面重新查询数据
    const { dispatch } = this.props;
    const rosterId = domainEBID;
    const start = 1960;
    const date = new Date();
    const end = date.getFullYear();
    const size = 100;
    dispatch({ type: 'expertTrajectory/findTrajsByRosterId', payload: { rosterId, start, end, size } });
  };

  searchTrajByQuery = (query) => { //models里面重新查询数据
    const { dispatch } = this.props;
    const [name, offset, org, term, size] = ['', 0, '', query, 1000];
    dispatch({ type: 'expertTrajectory/findTrajsHeatAdvance', payload: { name, offset, org, term, size } });
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

  showModal = () => {
    this.setState({
      visible: true,
    }, () => {
      const chartsinterval = setInterval(() => {
        const divId = document.getElementById('timeDistribution');
        const data = this.props.expertTrajectory.heatData;
        const type = 'timeDistribution';
        if ((typeof (divId) !== 'undefined' && divId !== 'undefined'
            && data !== '') || (this.state.visible === false)) {
          clearInterval(chartsinterval);
          showBulkTraj(data, type);
        }
        if (!this.state.visible) {
          clearInterval(chartsinterval);
        }
      }, 100);
    });
  };

  changeStatistic = (key) => {
    const chartsinterval = setInterval(() => {
      let divId;
      let type;
      if (key === '0') {
        divId = document.getElementById('timeDistribution');
        type = 'timeDistribution';
      } else if (key === '1') {
        divId = document.getElementById('migrateHistory');
        type = 'migrateHistory';
      } else if (key === '2') {
        divId = document.getElementById('migrateCompare');
        type = 'migrateCompare';
      }
      const data = this.props.expertTrajectory.heatData;
      if (typeof (divId) !== 'undefined' && divId !== 'undefined') {
        clearInterval(chartsinterval);
        showBulkTraj(data, type);
      }
    }, 100);
  };

  handleDownload = () => {
    const data = this.props.expertTrajectory.heatData;
    console.log(data);
    if (typeof (data.staData) !== 'undefined' && data.staData !== 'undefined') {
      const date = new Date();
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
      let str = downloadData(data);
      const bom = '\uFEFF';
      str = encodeURI(str);
      const link = window.document.createElement('a');
      const timeString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getDate()}`;
      console.log(timeString);
      link.setAttribute('href', `data:text/csv;charset=utf-8,${bom}${str}`);
      link.setAttribute('download', `statistics-${timeString}.csv`);
      link.click();
    } else {
      //给个提示？
    }
  };

  render() {
    const data = this.props.expertTrajectory.heatData;
    const { query, themeKey, domainId } = this.state;
    const currentTheme = themes.filter(skin => skin.key === themeKey);

    const menu = (
      <Menu onClick={this.onSkinClick}>
        {themes && themes.map((skin) => {
          return (
            <Menu.Item key={skin.key}>{themeKey === skin.key && <Icon type="check" />}
              <FM defaultMessage={skin.label} id={`com.expertTrajectory.theme.label.${skin.key}`} />
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const staJsx = (
      <div className={styles.charts}>
        <div id="timeDistribution" className={styles.chart1} />
      </div>
    );

    const staJsx1 = (
      <div className={styles.charts}>
        <div id="migrateHistory" className={styles.chart1} />
      </div>
    );

    const staJsx2 = (
      <div className={styles.charts}>
        <div id="migrateCompare" className={styles.chart1} />
      </div>
    );
    const loading = this.props.loading.global;


    const showFlag = !this.state.embeded; //是去嵌入的时候不显示Layout
    const showLeft = showFlag ? '' : 'none';
    const showMargin = showFlag ? '' : '20px 0 0 20px';

    const content = (
      <div>
        <Spinner loading={loading} />
        <div className={styles.header}>
          <div className={styles.domain} style={{ display: `${showLeft}` }}>
            <DomainSelector
              domains={sysconfig.Map_HotDomains}
              domainsLabel={sysconfig.Map_HotDomainsLabel}
              currentDomain={domainId}
              onChange={this.onDomainChange}
              time={Math.random()}
              type="selector"
            />
          </div>
          <div className={styles.setting} style={{ margin: `${showMargin}` }}>
            <div className={styles.options}>
              <div className={styles.checkAll}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  All
                </Checkbox>
              </div>
              <div className={styles.group}>
                <CheckboxGroup options={plainOptions}
                               value={this.state.checkedList} onChange={this.onChange} />
              </div>
            </div>
            <div className={styles.statics}>
              <Button onClick={this.showModal}>
                <Icon type="line-chart" />
                <FM defaultMessage="Statistic & Analysis" id="com.expertMap.headerLine.label.statistic" />
              </Button>
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
                <Tabs defaultActiveKey="0" onChange={this.changeStatistic}>
                  <TabPane tab="时间分布" key="0">{staJsx && staJsx}</TabPane>
                  <TabPane tab="迁徙历史" key="1">{staJsx1 && staJsx1}</TabPane>
                  <TabPane tab="迁徙对比" key="2">{staJsx2 && staJsx2}</TabPane>
                </Tabs>
              </Modal>
            </div>
            <div className={styles.yourSkin}>
              <Dropdown overlay={menu} className={styles.skin}>
                <a className="ant-dropdown-link" href="#theme">
                  <Icon type="skin" />
                  {currentTheme && currentTheme.length > 0 &&
                  <FM defaultMessage={currentTheme[0].label} id={`com.expertTrajectory.theme.label.${currentTheme[0].key}`} />
                  }
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className={classnames('content-inner', styles.page)}>
          {/*设置成除了data外，其他的参数，如themeKey、checkType都是可以缺失的*/}
          <ExpertHeatmap data={data} themeKey={themeKey} checkType={this.state.checkedList}
                         domainId={this.state.domainId} />
        </div>
      </div>
    );
    return (
      <div>
        { showFlag &&
        <Page contentClass={tc(['ExpertHeatmapPage'])} onSearch={this.onSearch}
              query={query}>
          { content && content }
        </Page>
        }
        { !showFlag &&
          <div>
            { content && content }
          </div>
        }
      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmapPage);
