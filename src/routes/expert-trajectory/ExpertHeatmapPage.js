/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Spinner } from 'components';
import { sysconfig } from 'systems';
import { applyTheme, theme } from 'themes';
import { Layout as Page } from 'routes';
import { Layout, Tabs } from 'antd';
import styles from './ExpertHeatmapPage.less';
import LeftInfoZoneCluster from './LeftInfoZoneCluster';
import LeftLineInfoCluster from './LeftLineInfoCluster';
import ExpertHeatmap from './ExpertHeatmap';
import EventsForYears from './EventForYears';
import LeftInfoAll from './LeftInfoAll';

const { Content, Sider } = Layout;
const { TabPane } = Tabs;
const tc = applyTheme(styles);


@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值
  };

  componentWillMount() {
    const { query } = this.state;
    const q = query || '59a772779ed5db1ed202d190'; //设置一个默认值
    this.setState({
      query: q,
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
      alert('啊！我还不能变啊!等荆榆', data.query);
    }
  };

  callSearchMap = (query) => {
    const rosterId = query;
    const start = 1900;
    const end = 2017;
    const size = 20;
    this.props.dispatch({ type: 'expertTrajectory/findTrajsByRosterId', payload: { rosterId, start, end, size } });
  };

  render() {
    const data = this.props.expertTrajectory.heatData;
    const { query } = this.state;


    const load = this.props.loading.models.expertTrajectory;
    this.state.rightType = this.props.expertTrajectory.infoZoneIds;
    return (
      <Page contentClass={tc(['ExpertHeatmapPage'])} onSearch={this.onSearch}
            query={query}>
        <div className={classnames('content-inner', styles.page)}>
          <Layout>
            <Sider className={classnames(styles.left, 'card-container')} width={260}
                   style={{ backgroundColor: '#fff' }}>
              <Tabs
                className={styles.card}
                type="card"
                onChange={this.onInfoTabChange}
                activeKey={this.state.infoTab}
                tabBarExtraContent={''}
              >
                <TabPane tab="VIEW" key="overview">
                  <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                  <LeftInfoAll />
                </TabPane>
                <TabPane tab="SELECTION" key="selection">
                  <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                </TabPane>
                <TabPane tab="EVENTS" key="event">
                  <div id="scroll">
                    <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
                    <EventsForYears data={data} />
                  </div>
                </TabPane>
              </Tabs>
            </Sider>
            <Layout className={styles.right}>
              <Content className={styles.content}>
                <ExpertHeatmap data={data} />
              </Content>
            </Layout>
          </Layout>
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmapPage);
