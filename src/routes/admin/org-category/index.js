/**
 *  Created by ranyanchuan on 2017-06-09;
 */
import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import UniversalConfig from '../../common/universal-config/index';
import styles from './index.less';


const TabPane = Tabs.TabPane;

class OrgCategory extends React.Component {

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    this.props.dispatch(
      {
        type: 'universalConfig/setTabList',
        payload: { category: 'orgcategory' },
      });
  };

  onTabChange = (activeKey) => {
    console.log(activeKey);
    this.props.dispatch(
      {
        type: 'universalConfig/setCategory',
        payload: { category: activeKey },
      });
  };

  render() {
    const tabData = this.props.universalConfig.tabList;
    return (
      <div style={{ paddingLeft: 24 }}>
        <h2 style={{ marginBottom: 12 }}>机构列表</h2>
        {tabData.length > 0 &&
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
                tab={item.name}
                className={styles.tabContent}
              >
              </TabPane>
            );
          })}
        </Tabs>
        }
        <UniversalConfig hideValue />
      </div>
    );
  }
}

export default connect(
  ({ universalConfig, loading }) => ({ universalConfig, loading }),
)(OrgCategory);
