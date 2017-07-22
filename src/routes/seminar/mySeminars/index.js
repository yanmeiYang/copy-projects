/**
 * Created by yangyanmei on 17/7/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Spin, Tabs } from 'antd';
// import ActivityList from '../../../components/seminar/activityList';
import NewActivityList from '../../../components/seminar/newActivityList';
import { config } from '../../../utils';
import styles from './index.less';

const TabPane = Tabs.TabPane;
const PageMaxWidth = 1000;
class mySeminars extends React.Component {
  state = {
    currentOrganizer: '',
  };

  componentDidMount = () => {
    const { user, roles } = this.props.app;
    // 默认显示第一个organizer
    this.props.dispatch({
      type: 'seminar/getSeminar',
      payload: {
        offset: 0,
        size: this.props.seminar.sizePerPage,
        filter: { src: config.source, uid: user.id, organizer: roles.authority },
      },
    });
  };

  delSeminar = (id, index) => {
    this.props.dispatch({ type: 'seminar/deleteActivity', payload: { id, body: '' } });
    this.props.seminar.results.slice(index, 1);
  };

  getMoreSeminar = (user, offset, sizePerPage) => {
    const params = {
      offset,
      size: sizePerPage,
      filter: { src: config.source, uid: user.id, organizer: this.state.currentOrganizer },
    };
    this.props.dispatch({ type: 'seminar/getSeminar', payload: params });
  };

  onTabChange = (offset, sizePerPage, activeKey) => {
    const { user } = this.props.app;
    this.setState({ currentOrganizer: activeKey });
    this.props.dispatch({
      type: 'seminar/getSeminar',
      payload: {
        offset: 0,
        size: sizePerPage,
        filter: { src: config.source, uid: user.id, organizer: activeKey },
      },
    });
  };

  render() {
    // TODO 获取用户的所有organizer
    const tabData = [
      {
        label: '高性能计算专业委员会',
      },
      {
        label: '理论计算机科学专业委员会',
      },
    ];
    const { results, loading, offset, sizePerPage } = this.props.seminar;
    const { user } = this.props.app;
    return (
      <div className="content-inner">
        <Tabs
          defaultActiveKey={tabData[0].label}
          type="card"
          className={styles.tabs}
          onChange={this.onTabChange.bind(this, offset, sizePerPage)}
        >

          {tabData.map((item) => {
            return (
              <TabPane
                key={item.label}
                tab={item.label}
              >
                <Spin spinning={loading}>
                  <div className={styles.seminar}>
                    {
                      results.map((result, index) => {
                        return (
                          <div key={result.id + Math.random()} style={{ maxWidth: PageMaxWidth }}>
                            <Button type="danger" size="small"
                                    style={{ float: 'right', marginTop: 15, marginRight: 10, marginLeft: 10 }} onClick={this.delSeminar.bind(this, result.id, index)}>删除</Button>
                            <NewActivityList result={result} hidetExpertRating="false" style={{ marginTop: 20, maxWidth: PageMaxWidth }} />
                          </div>
                        );
                      })
                    }
                    {!loading && results.length > sizePerPage &&
                    <Button type="primary" className={styles.getMoreActivities} onClick={this.getMoreSeminar.bind(this, user, offset, sizePerPage)}>More</Button>}
                  </div>
                </Spin>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  }

}


export default connect(({ seminar, loading, app }) => ({ seminar, loading, app }))(mySeminars);
