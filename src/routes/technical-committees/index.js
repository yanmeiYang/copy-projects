/**
 *  Created by BoGao on 2017-06-09;
 */
import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import UniversalConfig from '../common/universal-config';

const TabPane = Tabs.TabPane;

const tabData = [
  {
    category: 'technical-committee',
    label: '专业委员会列表',
    desc: '中国计算机学会（英文：China Computer Federation，缩写CCF）专业委员会（英文：Technical Committee，缩写TC）是根据计算机及相关领域的研究、开发及应用的发展需要，由CCF设立的二级专业分支机构，是CCF开展学术活动的主体。专业委员会接受CCF的直接领导。',
  },
];

class TechnicalCommittees extends React.Component {

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
        <h2>CCF 专业委员会列表</h2>

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

        <UniversalConfig hideValue />

      </div>
    );
  }
}
;

export default connect(
  ({ adminSystemConfig, loading }) => ({ adminSystemConfig, loading }),
)(TechnicalCommittees);
