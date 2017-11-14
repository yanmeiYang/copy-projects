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

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值
    domainId: '', //领域id
    themeKey: '0',
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
      const [name, offset, org, term, size] = ['', 0, '', data.query, 1000];
      this.props.dispatch({ type: 'expertTrajectory/findTrajsHeatAdvance', payload: { name, offset, org, term, size } });
    }
  };

  callSearchMap = (query) => {
    const rosterId = query;
    const start = 1960;
    const end = 2017;
    const size = 100;
    this.props.dispatch({ type: 'expertTrajectory/findTrajsByRosterId', payload: { rosterId, start, end, size } });
  };

  onSkinClick = (value) => {
    console.log("ddd",value.key)
    this.setState({ themeKey: value.key });
  }

  render() {
    const data = this.props.expertTrajectory.heatData;
    const { query, themeKey, domainId } = this.state;
    const menu = (
      <Menu onClick={this.onSkinClick}>
        <Menu.Item key="0">{themeKey === '0' && <Icon type="check" />} 原始风</Menu.Item>
        <Menu.Item key="1">{themeKey === '1' && <Icon type="check" />} 商务风</Menu.Item>
        <Menu.Item key="2">{themeKey === '2' && <Icon type="check" />} 暗黑风</Menu.Item>
        <Menu.Item key="3">{themeKey === '3' && <Icon type="check" />} 佩琦风</Menu.Item>
        <Menu.Item key="4">{themeKey === '4' && <Icon type="check" />} 抹茶风</Menu.Item>
        <Menu.Item key="5">{themeKey === '5' && <Icon type="check" />} 五花肉风</Menu.Item>
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
                  <Icon type="setting" />
                  <FM defaultMessage=" Choose Your Skin" id="com.expertHeatMap.headerLine.setting.yourSkin" />
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className={classnames('content-inner', styles.page)}>
          <ExpertHeatmap data={data} themeKey={themeKey} />
          {/*<Layout>*/}
            {/*<Sider className={classnames(styles.left, 'card-container')} width={260}*/}
                   {/*style={{ backgroundColor: '#fff' }}>*/}
              {/*<Tabs*/}
                {/*className={styles.card}*/}
                {/*type="card"*/}
                {/*onChange={this.onInfoTabChange}*/}
                {/*activeKey={this.state.infoTab}*/}
                {/*tabBarExtraContent={''}*/}
              {/*>*/}
                {/*<TabPane tab="VIEW" key="overview">*/}
                  {/*<Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />*/}
                {/*</TabPane>*/}
                {/*<TabPane tab="SELECTION" key="selection">*/}
                  {/*<Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />*/}
                {/*</TabPane>*/}
                {/*<TabPane tab="EVENTS" key="event">*/}
                  {/*<div id="scroll">*/}
                    {/*<Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />*/}
                  {/*</div>*/}
                {/*</TabPane>*/}
              {/*</Tabs>*/}
            {/*</Sider>*/}
            {/*<Layout className={styles.right}>*/}
              {/*<Content className={styles.content}>*/}
                {/*<ExpertHeatmap data={data} />*/}
              {/*</Content>*/}
            {/*</Layout>*/}
          {/*</Layout>*/}
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory, loading }) =>
  ({ expertTrajectory, loading }))(ExpertHeatmapPage);
