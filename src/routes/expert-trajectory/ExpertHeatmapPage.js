/*
 * created by ???? on 2017-??-??.
 */
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
import { Layout, Tabs, Button, Icon, TreeSelect, Menu, Dropdown, message  } from 'antd';
import styles from './ExpertHeatmapPage.less';
import ExpertHeatmap from './ExpertHeatmap';


const { Content, Sider } = Layout;
const { TabPane } = Tabs;
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
  };

  componentWillMount() {
    const { location } = this.props;
    const { query, domain } = queryString.parse(location.search);
    const q = query || ''; //设置一个默认值
    this.setState({
      query: q,
    });
    if (domain) {
      this.searchTrajByDomain(domain);
    } else if (q) {
      this.searchTrajByQuery(q);
      this.setState({ domainId: 'aminer' });
    }
  }

  componentDidMount() {
    //this.searchTrajByQuery(this.state.query);
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
      console.log(nextState.query);
      this.searchTrajByQuery(nextState.query);
    }
    if (nextState.domainId && nextState.domainId !== this.state.domainId) {
      console.log(nextState.domainId);
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
    console.log(data);
    const { query, themeKey, domainId } = this.state;
    const currentTheme = themes.filter(theme => theme.key === themeKey);

    const menu = (
      <Menu onClick={this.onSkinClick}>
        {themes && themes.map((theme)=>{
          return (
            <Menu.Item key={theme.key}>{themeKey === theme.key && <Icon type="check" />}
              <FM defaultMessage={theme.label} id={`com.expertTrajectory.theme.label.${theme.key}`} />
            </Menu.Item>
          );
        })}
      </Menu>
    );

    const load = this.props.loading.models.expertTrajectory;
    this.state.rightType = this.props.expertTrajectory.infoZoneIds;
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
            <div className={styles.statics}>
              <Button onClick={this.showModal}>
                <Icon type="line-chart" />
                <FM defaultMessage="Statistic & Analysis" id="com.expertMap.headerLine.label.statistic" />
              </Button>
            </div>
            <div className={styles.yourSkin}>
              <Dropdown overlay={menu} className={styles.skin}>
                <a className="ant-dropdown-link" href="#">
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
          <ExpertHeatmap data={data} themeKey={themeKey} />
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmapPage);
