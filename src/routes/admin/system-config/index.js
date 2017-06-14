/**
 *  Created by BoGao on 2017-06-09;
 */
import React from 'react';
import { Tabs, Table, Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import UniversalConfig from '../../common/universal-config';

const TabPane = Tabs.TabPane;
const { ColumnGroup, Column } = Table;

const tabData = [
  {
    category: 'user_roles',
    label: '用户角色列表',
    desc: 'CCF 用户角色列表',
  },
  {
    category: 'activity_organizer_options',
    label: '活动承办单位',
    desc: 'CCF 活动的承办单位，包括专委/分部/项目等。',
  },
];

class SystemConfig extends React.Component {
// const SystemConfig = ({ dispatch, adminSystemConfig, loading }) => {

  // console.log('adminSystemConfig', adminSystemConfig);

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    this.onTabChange(tabData[0].category);
  }

  onTabChange = (activeKey) => {
    // console.log('Tab changes to ', activeKey);
    this.props.dispatch(
      {
        type: 'universalConfig/setCategory',
        payload: { category: activeKey },
      });
  };

  render() {
    return (
      <div className="content-inner">
        <h2>系统参数设置!</h2>

        {tabData &&
        <Tabs
          defaultActiveKey={tabData[0].category}
          type="card"
          className={styles.tabs}
          onChange={this.onTabChange}
        >
          {tabData.map((item) => {
            return (
              <TabPane
                key={item.category}
                tab={item.label}
                className={styles.tabContent}
              >
                <div className={styles.desc}>
                  <div className="title">描述:</div>
                  <div>{item.desc}</div>
                </div>
              </TabPane>
            );
          })}
        </Tabs>
        }

        <UniversalConfig />

      </div>
    );
  }
}
;

export default connect(
  ({ adminSystemConfig, loading }) => ({ adminSystemConfig, loading }),
)(SystemConfig);
