/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table, Input, Tabs } from 'antd';
import { connect } from 'dva';
import ExpertsList from './experts-list';
import CommitteeList from './committee-list';
import styles from './index.less';


const TabPane = Tabs.TabPane;
const tabData = [
  {
    category: 'activity_lists',
    label: '活动列表',
    desc: '活动列表',
  },
  {
    category: 'activity_detail',
    label: '分部列表',
    desc: '分部列表',
  },
  {
    category: 'experts_list',
    label: '专家列表',
    desc: '专家列表',
  },
];

class Statistics extends React.Component {
  state = {
    defaultTabKey: tabData[0].category,
  };

  componentWillMount() {
    const roles = this.props.app.roles;
    if (roles.admin || roles.role.includes('专委')) {
      this.setState({ defaultTabKey: tabData[0].category });
    } else {
      this.setState({ defaultTabKey: tabData[1].category });
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'statistics/getStatsOfCcfActivities', payload: {} });
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
    const { roles } = this.props.app;
    const activity_list = tabData[0];
    const activity_detail = tabData[1];
    const experts_list = tabData[2];
    let committee = [];
    let division = [];
    if (this.props.app.roles.admin) {
      committee = this.props.statistics.activity.filter(item => item.organizer.includes('专业委员会') || item.organizer.includes('专委会'));
      division = this.props.statistics.activity.filter(item => !item.organizer.includes('专业委员会') && !item.organizer.includes('专委会'));
    } else {
      committee = this.props.statistics.activity;
      division = this.props.statistics.activity;
    }
    return (
      <div style={{ marginTop: 10 }}>
        <div className="content-inner">
          {tabData &&
          <Tabs
            defaultActiveKey={this.state.defaultTabKey}
            type="card"
            className={styles.tabs}
            onChange={this.onTabChange}
          >
            {/* {tabData.map((item) => {*/}
            {/* return (*/}
            {/* <TabPane*/}
            {/* key={item.category}*/}
            {/* style={{ display: item.isShow }}*/}
            {/* tab={item.label}*/}
            {/* className={styles.tabContent}*/}
            {/* >*/}
            {/* {item.container}*/}
            {/* </TabPane>*/}
            {/* );*/}
            {/* })}*/}
            <TabPane
              key={activity_list.category}
              tab={activity_list.label}
            >
              <CommitteeList activity={this.props.statistics.activity} />
            </TabPane>

            {/*{(roles.admin || !roles.role.includes('专委')) &&*/}
            {/*<TabPane*/}
              {/*key={activity_detail.category}*/}
              {/*style={{ display: activity_detail.isShow }}*/}
              {/*tab={activity_detail.label}*/}
              {/*className={styles.tabContent}*/}
            {/*>*/}
              {/*<CommitteeList activity={division} />*/}
            {/*</TabPane>*/}
            {/*}*/}
            <TabPane
              key={experts_list.category}
              style={{ display: experts_list.isShow }}
              tab={experts_list.label}
              className={styles.tabContent}
            >
              <ExpertsList author={this.props.statistics.author} />
            </TabPane>

          </Tabs>
          }
        </div>
      </div>
    );
  }

}

export default connect(({ statistics, app }) => ({ statistics, app }))(Statistics);
