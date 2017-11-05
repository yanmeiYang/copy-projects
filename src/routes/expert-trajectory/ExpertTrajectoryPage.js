/*
 * created by Xinyi Xu on 2017-8-16.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
import { applyTheme, theme } from 'themes';
import { Layout } from 'antd';
import { Layout as Page } from 'routes';
import styles from './ExpertTrajectoryPage.less';
import { PersonListLittle } from '../../components/person';
import ExpertTrajectory from './ExpertTrajectory';

const { Content, Sider } = Layout;
const tc = applyTheme(styles);

class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
    view: {},
  };

  componentWillMount() {
    const { query, type } = queryString.parse(location.search);
    if (query) {
      this.setState({ query });
    }
    if (type) {
      this.setState({ mapType: type || 'google' });
    }
    this.dispatch({
      type: 'app/layout',
      payload: {
        headerSearchBox: { query, onSearch: this.onSearch },
        showFooter: false,
      },
    });
  }

  componentDidMount() {
    this.callSearchMap(this.state.query);
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    return true;
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      this.props.dispatch({
        type: 'app/setQueryInHeaderIfExist',
        payload: { query: data.query },
      });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
  };

  onPersonClick = (personId, start, end) => {
    this.props.dispatch({ type: 'expertTrajectory/dataFind', payload: { personId, start, end } });
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query } });
  };

  render() {
    const persons = this.props.expertTrajectory.results;
    const { query } = this.state;
    return (
      <Page contentClass={tc(['ExpertTrajectoryPage'])} onSearch={this.onSearch}
            query={query}>
        <div className={classnames('content-inner', styles.page)}>
          <Layout>
            <Sider className={styles.left} width={250}>
              <PersonListLittle persons={persons} onClick={this.onPersonClick} />
            </Sider>
            <Layout className={styles.right}>
              <Content className={styles.content}>
                <ExpertTrajectory />
              </Content>
            </Layout>
          </Layout>
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);

