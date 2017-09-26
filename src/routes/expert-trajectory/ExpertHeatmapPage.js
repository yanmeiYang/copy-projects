/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmapPage.less';
import LeftInfoZoneCluster from './LeftInfoZoneCluster';
import LeftLineInfoCluster from './LeftLineInfoCluster';
import ExpertHeatmap from './ExpertHeatmap';
import EventsForYears from './EventForYears';
import { Layout, Tabs } from 'antd';
import { Spinner } from '../../components';
import { sysconfig, applyTheme } from 'systems';

const { Content, Sider } = Layout;
const TabPane = Tabs.TabPane;
const tc = applyTheme(styles);

class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google',
    from: '',
    to: '',
    rightType: '',
    infoTab: 'selection',
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
  }

  componentDidMount() {
    this.callSearchMap(this.state.query);
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    return true;
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query } });
  }

  callClusterPerson =(clusterIdList, from1, to1, type) => {
    console.log('id', clusterIdList);
    this.props.dispatch({ type: 'expertTrajectory/listPersonByIds', payload: { ids: clusterIdList } });
    this.props.dispatch({ type: 'expertTrajectory/setRightInfo', payload: { rightInfoType: type } });
    if (from1 && to1) {
      this.setState({ from: from1, to: to1 });
    }
  }

  onSearchBarSearch = (data) => {
    console.log('Enter query is ', data);
    const newOffset = data.offset || 0;
    const newSize = data.size || sysconfig.MainListSize;
    this.dispatch(routerRedux.push({
      pathname: `/${sysconfig.SearchPagePrefix}/${data.query}/${newOffset}/${newSize}?`, // eb=${filters.eb}TODO
    }));
    // this.doSearchUseProps(); // another approach;
  };

  onYearChange = (year1) => {
    this.setState({ year: year1 },()=>{console.log("hahahahha",this.state.year);});
    this.setState({ infoTab: 'event'});
    const e = document.getElementsByClassName("ant-tabs-content") // 滑动条
    // e[0].scrollTop = e[0].scrollHeight;
    e[0].scrollTo(0, e[0].scrollHeight)
    console.log("scrollTop",e[0].scrollTop)
  }

  onInfoTabChange = (e) => { // 改变tab的取值
    this.setState({ infoTab: e });
  };

  render() {
    const load = this.props.loading.models.expertTrajectory;
    this.state.rightType = this.props.expertTrajectory.infoZoneIds;
    console.log('rightType', this.state.rightType);
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
      <Layout contentClass={tc(['ExpertHeatmapPage'])} onSearch={this.onSearchBarSearch}
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
              <TabPane tab="SELECTION" key="selection">
                <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                {rightInfos[this.state.rightType] && rightInfos[this.state.rightType]()}
              </TabPane>

              <TabPane tab="EVENTS" key="event" >
                <h1> EVENTS: </h1>
                <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                <EventsForYears year={this.state.year} />
              </TabPane>
            </Tabs>
          </Sider>

          <Layout className={styles.right} >
            <Content className={styles.content}>
              <ExpertHeatmap onPageClick={this.callClusterPerson} yearChange={this.onYearChange} />
            </Content>
          </Layout>
        </Layout>


      </div>
      </Layout>
    );
  }
}

export default connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))(ExpertHeatmapPage);
