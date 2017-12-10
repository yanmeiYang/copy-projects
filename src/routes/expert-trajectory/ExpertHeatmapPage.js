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
import { Layout, Tabs, Button, Icon, TreeSelect, Menu, Dropdown, Checkbox, message  } from 'antd';
import styles from './ExpertHeatmapPage.less';
import ExpertHeatmap from './ExpertHeatmap';


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
    themeKey: '1', //皮肤的I
    checkedList: defaultCheckedList,
    indeterminate: true,
    checkAll: true,
  };

  componentWillMount() {
    const { location } = this.props;
    const { query, domain } = queryString.parse(location.search);
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
    const end = 2017;
    const size = 100;
    dispatch({ type: 'expertTrajectory/findTrajsByRosterId', payload: { rosterId, start, end, size } });
  };

  searchTrajByQuery = (query) => { //models里面重新查询数据
    const { dispatch } = this.props;
    const [name, offset, org, term, size] = ['', 0, '', query, 1000];
    dispatch({ type: 'expertTrajectory/findTrajsHeatAdvance', payload: { name, offset, org, term, size } });
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
    return (
      <Page contentClass={tc(['ExpertHeatmapPage'])} onSearch={this.onSearch}
            query={query}>
        <div className={styles.header}>
          <div className={styles.domain}>
            <DomainSelector
              domains={sysconfig.Map_HotDomains}
              domainsLabel={sysconfig.Map_HotDomainsLabel}
              currentDomain={domainId}
              onChange={this.onDomainChange}
              time={Math.random()}
              type="selector"
            />
          </div>
          <div className={styles.setting}>
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
          <ExpertHeatmap data={data} themeKey={themeKey} checkType={this.state.checkedList} />
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmapPage);
