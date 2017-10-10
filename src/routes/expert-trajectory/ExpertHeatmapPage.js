/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import SearchComponent from 'routes/search/SearchComponent';
import styles from './ExpertHeatmapPage.less';
import LeftInfoZoneCluster from './LeftInfoZoneCluster';
import LeftLineInfoCluster from './LeftLineInfoCluster';
import ExpertHeatmap from './ExpertHeatmap';
import EventsForYears from './EventForYears';
import LeftInfoAll from './LeftInfoAll';
import { Layout, Tabs } from 'antd';
import { Spinner } from '../../components';
import { sysconfig, applyTheme } from 'systems';
import { Layout as Layout1 } from 'routes';

const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const tc = applyTheme(styles);

class ExpertHeatmapPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google',
    from: '',
    to: '',
    rightType: '',
    infoTab: 'overview',
    year: '',
  };

  componentWillMount() {
    const { query, type } = queryString.parse(location.search);
    if (query) {
      this.setState({ query });
    }
    if (type) {
      this.setState({ mapType: type || 'google' });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
    this.props.dispatch({ type: 'expertTrajectory/setRightInfo', payload: { rightInfoType: 'allYear' } });
    this.findIfQuery(this.state.query);
  }

  componentDidMount() {
    this.callSearchMap(this.state.query);
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.setState({ query: nextState.query });
      this.findIfQuery(nextState.query);
      // this.callSearchMap(nextState.query);
    }
    return true;
  }

  findIfQuery = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/heatFind', payload: { query } });
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-heatmap',
        query: { query: data.query },
      }));
    }
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query } });
  }

  callClusterPerson =(clusterIdList, from1, to1, type) => {
    this.props.dispatch({ type: 'expertTrajectory/listPersonByIds', payload: { ids: clusterIdList } });
    this.props.dispatch({ type: 'expertTrajectory/setRightInfo', payload: { rightInfoType: type } });
    if (from1 && to1) {
      this.setState({ from: from1, to: to1 });
    }
    if(type === 'scatter' || type === 'lines'){
      this.setState({ infoTab: 'selection' });
    }

  }

  onYearChange = (year1) => {
    this.setState({ year: year1 });
    this.setState({ infoTab: 'event' });
  }

  onInfoTabChange = (e) => { // 改变tab的取值
    this.setState({ infoTab: e });
  };

  callScroll= () => { // 滑动条滑到最底端
    const e = document.getElementsByClassName('ant-tabs-content ant-tabs-content-no-animated'); // 滑动条cfco
    e[0].scrollTop = e[0].scrollHeight;
  }

  render() {
    const load = this.props.loading.models.expertTrajectory;
    this.state.rightType = this.props.expertTrajectory.infoZoneIds;
    const ifPlay = this.state.ifPlay;
    const from = this.state.from;
    const to = this.state.to;
    const clusterPersons = this.props.expertTrajectory.clusterPersons;
    const { query } = this.props.match.params;
    const rightInfos = {
      scatter: () => (<LeftInfoZoneCluster persons={clusterPersons} />),
      // lines: () => (<LeftLineInfoCluster persons={clusterPersons} />),
      lines: () => (<LeftLineInfoCluster persons={clusterPersons} from={from} to={to} />),
    };
    return (
      <Layout1 contentClass={tc(['ExpertHeatmapPage'])} onSearch={this.onSearch}
              query={query}>
        <div className={classnames('content-inner', styles.page)}>
          <Layout >
            <Sider className={classnames(styles.left, 'card-container')} width={260} style={{ backgroundColor: '#fff' }}>
              <Tabs
              className={styles.card}
              type="card"
              onChange={this.onInfoTabChange}
              activeKey={this.state.infoTab}
              tabBarExtraContent={''}
            >
                <TabPane tab="OVERVIEW" key="overview">
                  <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                  <LeftInfoAll />
                </TabPane>

                <TabPane tab="SELECTION" key="selection">
                  <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                  {rightInfos[this.state.rightType] && rightInfos[this.state.rightType]()}
                </TabPane>

                <TabPane tab="EVENTS" key="event" >
                  <div id="scroll" >
                    <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                    <EventsForYears qquery={this.state.query} onDone={this.callScroll} year={this.state.year} />
                  </div>
                </TabPane>
              </Tabs>
            </Sider>

            <Layout className={styles.right} >
              <Content className={styles.content}>
                <ExpertHeatmap qquery={this.state.query} onPageClick={this.callClusterPerson} yearChange={this.onYearChange} />
              </Content>
            </Layout>
          </Layout>


        </div>
      </Layout1>
    );
  }
}

export default connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))(ExpertHeatmapPage);
