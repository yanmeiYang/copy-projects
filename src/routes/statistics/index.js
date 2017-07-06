/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table, Input, Tabs } from 'antd';
import { connect } from 'dva';
import ExpertsList from './experts-list';
import ActivityDetail from './activity-detail';
import ActivityList from './activity-list';
import styles from './index.less'


const TabPane = Tabs.TabPane;

const tabData = [
  {
    category: 'activity_lists',
    label: '活动列表',
    desc: '活动列表',
    container: <ActivityList />,
    isShow: true,
  },
  {
    category: 'activity_detail',
    label: '活动详情',
    desc: '活动详情',
    container: <ActivityDetail />,
    isShow: false,
  },
  {
    category: 'experts_list',
    label: '专家列表',
    desc: '专家列表',
    container: <ExpertsList />,
    isShow: true,
  }
];


class Statistics extends React.Component {

  componentDidMount() {
    this.props.dispatch({ type: 'statistics/getStatsOfCcfActivities',payload:{} });
    this.onTabChange(tabData[0].category);
  }

  onTabChange = (activeKey) => {
    // console.log('Tab changes to ', activeKey);
    // this.props.dispatch(
    //   {
    //     type: 'universalConfig/setCategory',
    //     payload: { category: activeKey },
    //   });
  };

  render() {
    console.log(this.props.statistics.activity);
    const activity_list = tabData[0];
    const activity_detail = tabData[1];
    const experts_list = tabData[2];
    return (
      <div style={{ marginTop: 10 }}>
        <div className="content-inner">
          {tabData &&
          <Tabs
            defaultActiveKey={tabData[0].category}
            type="card"
            className={styles.tabs}
            onChange={this.onTabChange}
          >
            {/*{tabData.map((item) => {*/}
            {/*return (*/}
            {/*<TabPane*/}
            {/*key={item.category}*/}
            {/*style={{ display: item.isShow }}*/}
            {/*tab={item.label}*/}
            {/*className={styles.tabContent}*/}
            {/*>*/}
            {/*{item.container}*/}
            {/*</TabPane>*/}
            {/*);*/}
            {/*})}*/}
            {activity_list.isShow && <TabPane
              key={activity_list.category}
              style={{ display: activity_list.isShow }}
              tab={activity_list.label}
            >
              <ActivityList activity={this.props.statistics.activity}/>
            </TabPane>}
            {activity_detail.isShow && <TabPane
              key={activity_detail.category}
              style={{ display: activity_detail.isShow }}
              tab={activity_detail.label}
              className={styles.tabContent}
            >
              {activity_detail.container}
            </TabPane>}
            {experts_list.isShow && <TabPane
              key={experts_list.category}
              style={{ display: experts_list.isShow }}
              tab={experts_list.label}
              className={styles.tabContent}
            >
              <ExpertsList author={this.props.statistics.author}/>
            </TabPane>}

          </Tabs>
          }
        </div>
      </div>
    )
  }

}

export default connect(({ statistics, app }) => ({ statistics, app })) (Statistics);
