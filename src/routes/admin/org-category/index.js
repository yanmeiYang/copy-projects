/**
 *  Created by ranyanchuan on 2017-06-09;
 */
import React from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import UniversalConfig from '../../common/universal-config/index';
import styles from './index.less';
import { classnames } from '../../../utils';


const TabPane = Tabs.TabPane;

class OrgCategory extends React.Component {
  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    this.props.dispatch({
      type: 'universalConfig/setTabList',
      payload: { category: 'orgcategory' },
    });
  }

  onTabChange = (activeKey) => {
    this.props.dispatch({
      type: 'universalConfig/setCategory',
      payload: { category: activeKey },
    });
  };

  onAddOrgList = () => {
    console.log('onAddOrgList');
  };

  onEditOrgList = () => {
    console.log('onAddOrgList');
  };

  onDeleteOrgList = () => {
    console.log('onAddOrgList');
  };

  render() {
    const { tabList } = this.props.universalConfig;
    console.log('tabList', tabList);
    return (
      <div className={classnames('', styles.page)}>
        <h2>机构列表</h2>

        <div className={styles.main}>
          <div className={styles.left}>

            <div className={styles.toolbox}>
              <a onClick={this.onAddOrgList}>添加</a>
              <span className="spliter">|</span>
              <a onClick={this.onEditOrgList}>编辑</a>
              <span className="spliter">|</span>
              <a onClick={this.onDeleteOrgList}>删除</a>
            </div>

            {tabList &&
            <Tabs
              type="line" size="small"
              tabPosition="left"
              onChange={this.onTabChange}
            >
              {tabList.map((item) => {
                return (
                  <TabPane
                    key={item.category}
                    tab={item.name}
                  />
                );
              })}
            </Tabs>
            }
          </div>

          <div className={styles.right}>
            <UniversalConfig hideValue />
          </div>

        </div>
      </div>
    );
  }
}

export default connect(
  ({ universalConfig, loading }) => ({ universalConfig, loading }),
)(OrgCategory);
