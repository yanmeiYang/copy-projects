/**
 * Created by yangyanmei on 17/8/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { system } from '../../../utils';
import EmailContent from './emailCotent';
// import styles from './index.less';


const TabPane = Tabs.TabPane;

class EmailTemplate extends React.Component {
  state = { src: '' };
  componentWillMount = () => {
    this.props.dispatch({
      type: 'systemSetting/getTemplateContent',
      payload: { src: system.AvailableSystems[0], type: 'welcome' },
    });
    this.setState({ src: system.AvailableSystems[0], type: 'welcome' });
    this.props.dispatch({ type: 'app/handleNavbar', payload: true });
  };
  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.systemSetting.status !== this.props.systemSetting.status) {
  //     if (!nextProps.systemSetting.status) {
  //       Modal.error({
  //         title: '您没有权限',
  //       });
  //     } else {
  //       Modal.success({
  //         title: '邮箱模板定制成功',
  //       });
  //     }
  //   }
  // };
  componentWillUnmount = () => {
    this.props.dispatch({ type: 'app/handleNavbar', payload: false });
  };

  onTabChange = (e) => {
    this.setState({ src: e, type: 'welcome' });
    this.props.dispatch({
      type: 'systemSetting/getTemplateContent',
      payload: { src: e, type: 'welcome' },
    });
  };

  onTypeChange = (e) => {
    this.setState({ type: e });
    this.props.dispatch({
      type: 'systemSetting/getTemplateContent',
      payload: { src: this.state.src, type: e },
    });
  };

  render() {
    const { emailContent } = this.props.systemSetting;
    const { src, type } = this.state;
    return (
      <div style={{ maxWidth: '1228px' }}>
        <div>
          <Tabs
            defaultActiveKey="ccf"
            tabPosition="left"
            onChange={this.onTabChange}
          >
            {system.AvailableSystems &&
            system.AvailableSystems.map((sys) => {
              return <TabPane tab={sys} key={sys}>
                <Tabs
                  defaultActiveKey="welcome"
                  tabPosition="top"
                  onChange={this.onTypeChange}
                >
                  <TabPane tab="welcome" key="welcome">
                    <EmailContent setFormValue={emailContent} source={src} type={type} />
                  </TabPane>
                  <TabPane tab="reset-password" key="reset-password">
                    <EmailContent setFormValue={emailContent} source={src} type={type} />
                  </TabPane>
                </Tabs>
              </TabPane>;
            })
            }
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect(({ systemSetting }) => ({ systemSetting }))(EmailTemplate);
