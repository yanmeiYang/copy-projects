/**
 * Created by yangyanmei on 17/6/16.
 */
import React from 'react';
import { Table, Input, Button, Tabs } from 'antd';
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
    this.setState({ defaultTabKey: activeKey });
    // console.log('Tab changes to ', activeKey);
    // this.props.dispatch(
    //   {
    //     type: 'universalConfig/setCategory',
    //     payload: { category: activeKey },
    //   });
  };


  clickDownload = (e) => {
    let info = '';
    let title = '';
    if (this.state.defaultTabKey === 'activity_lists') {
      title = '承办单位	,举办活动次数(总数),分部,NOI,ADL,CCCF,年度报告,CSP,走进高校,TF,	CCD,女工作者会议,精英大会,未来教育峰会,专委,YOCSEF,';
      title += '\n';
      this.props.statistics.activity.map((item) => {
        info += item.organizer ? (`${item.organizer},`) : ',';
        info += item.total ? (`${item.total},`) : ',';
        info += item.category['分部'] ? (`${item.category['分部']},`) : ',';
        info += item.category.NOI ? (`${item.category.NOI},`) : ',';
        info += item.category.ADL ? (`${item.category.ADL},`) : ',';
        info += item.category.CCCF ? (`${item.category.CCCF},`) : ',';
        info += item.category['年度报告'] ? (`${item.category['年度报告']},`) : ',';
        info += item.category.CSP ? (`${item.category.CSP},`) : ',';
        info += item.category['走进高校'] ? (`${item.category['走进高校']},`) : ',';
        info += item.category.TF ? (`${item.category.TF},`) : ',';
        info += item.category.CCD ? (`${item.category.CCD},`) : ',';
        info += item.category['女工作者会议'] ? (`${item.category['女工作者会议']},`) : ',';
        info += item.category['精英大会'] ? (`${item.category['精英大会']},`) : ',';
        info += item.category['未来教育峰会'] ? (`${item.category['未来教育峰会']},`) : ',';
        info += item.category['专委'] ? (`${item.category['专委']},`) : ',';
        info += item.category.YOCSEF ? (`${item.category.YOCSEF},`) : ',';
        info += '\n';
        return true;
      });
    }

    if (this.state.defaultTabKey === 'experts_list') {
      title = '专家,审稿活动,撰稿活动,总贡献度,演讲内容(平均分),演讲水平,综合评价(其他贡献),';
      title += '\n';
      this.props.statistics.author.map((item) => {
        if (item.n_zh) {
          info += item.n_zh;
        }
        if (item.n) {
          info += `(${item.n}),`;
        } else {
          info += ',';
        }

        info += item['撰稿次数'] ? (`${item['撰稿次数']},`) : ',';
        info += item['撰稿活动'] ? (`${item['撰稿活动']},`) : ',';
        info += item.contrib ? (`${item.contrib},`) : ',';
        info += item.content ? (`${item.content},`) : ',';
        info += item.level ? (`${item.level},`) : ',';
        info += item.integrated ? (`${item.integrated},`) : ',';
        info += '\n';
        return true;
      });
    }

    let str = title + info;
    const bom = '\uFEFF';
    str = encodeURIComponent(str);
    e.target.href = `data:text/csv;charset=utf-8,${bom}${str}`;
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
          <div>
            <Button key="submit" type="default"
                    style={{ float: 'right', marginBottom: -28, zIndex: 100 }}>
              <a onClick={this.clickDownload.bind(this)} download="data.csv" href="#">导出</a>
            </Button>
            <Tabs
              defaultActiveKey={this.state.defaultTabKey}
              type="card"
              style={{ clear: 'both', paddingTop: 0 }}
              className={styles.tabs}
              onChange={this.onTabChange}
            >
              {/* {tabData.map((item) => { */}
              {/* return ( */}
              {/* <TabPane */}
              {/* key={item.category} */}
              {/* style={{ display: item.isShow }} */}
              {/* tab={item.label} */}
              {/* className={styles.tabContent} */}
              {/* > */}
              {/* {item.container} */}
              {/* </TabPane> */}
              {/* ); */}
              {/* })} */}
              <TabPane
                key={activity_list.category}
                tab={activity_list.label}
              >
                <CommitteeList activity={this.props.statistics.activity} />
              </TabPane>

              {/* {(roles.admin || !roles.role.includes('专委')) && */}
              {/* <TabPane */}
              {/* key={activity_detail.category} */}
              {/* style={{ display: activity_detail.isShow }} */}
              {/* tab={activity_detail.label} */}
              {/* className={styles.tabContent} */}
              {/* > */}
              {/* <CommitteeList activity={division} /> */}
              {/* </TabPane> */}
              {/* } */}
              <TabPane
                key={experts_list.category}
                style={{ display: experts_list.isShow }}
                tab={experts_list.label}
                className={styles.tabContent}
              >

                <ExpertsList author={this.props.statistics.author} />
              </TabPane>

            </Tabs>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(({ statistics, app }) => ({ statistics, app }))(Statistics);
