/**
 *  Created by BoGao on 2017-06-09;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs } from 'antd';
import styles from './index.less';
import UniversalConfig from '../../common/universal-config';
import { sysconfig } from '../../../systems';

const TabPane = Tabs.TabPane;
const { SysconfigDefaultCategory, SysConfigTabs, ShowConfigTab } = sysconfig;

class SystemConfig extends React.Component {
  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    this.updateCategory(this.props.adminSystemConfig.category);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.adminSystemConfig.category !== nextProps.adminSystemConfig.category;
  }

  componentDidUpdate() {
    this.updateCategory(this.props.adminSystemConfig.category);
  }

  onTabChange = (activeKey) => {
    this.props.dispatch(routerRedux.push({
      pathname: `/admin/system-config/${activeKey}`,
    }));
  };

  updateCategory = (category) => {
    if (!category) {
      return this.onTabChange(SysconfigDefaultCategory);
    }
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category },
    });
  };

  render() {
    const sc = this.props.adminSystemConfig;
    const defaultCategory = sc.category || SysconfigDefaultCategory;
    const tabConfig = SysConfigTabs.filter(item => item.category === defaultCategory);
    return (
      <div className="content-inner">

        <h2 className={styles.pageTitle}>
          {tabConfig && tabConfig.length > 0 && (tabConfig[0].label || '系统参数设置！')}
        </h2>

        {ShowConfigTab && SysConfigTabs &&
        <Tabs
          defaultActiveKey={defaultCategory}
          type="card"
          className={styles.tabs}
          onChange={this.onTabChange}
        >
          {SysConfigTabs.map((item) => {
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
        {sc.category === 'contribution_type' ?
          <UniversalConfig /> : <UniversalConfig hideValue />
        }


      </div>
    );
  }
}
;

export default connect(
  ({ adminSystemConfig, loading }) => ({ adminSystemConfig, loading }),
)(SystemConfig);
