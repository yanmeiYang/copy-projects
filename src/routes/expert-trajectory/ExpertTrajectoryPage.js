/*
 * created by Xinyi Xu on 2017-8-16.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import { applyTheme } from 'themes';
import { Layout } from 'antd';
import { Layout as Page } from 'routes';
import styles from './ExpertTrajectoryPage.less';
import { PersonListLittle } from '../../components/person';
import ExpertTrajectory from './ExpertTrajectory';

const { Content, Sider } = Layout;
const tc = applyTheme(styles);

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '', //查询窗口中的默认值
    cperson: '', //当前选择的人
  };

  componentWillMount() {
    const { query } = this.state;
    const q = query || '唐杰'; //设置一个默认值
    this.setState({
      query: q,
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

  onPersonClick = (start, end, person) => {
    //这里的参数的名字要和model里面的一致
    const personId = person.id;
    this.props.dispatch({ type: 'expertTrajectory/findTrajById', payload: { personId, start, end } });
    this.setState({ cperson: person });
  };

  callSearchMap = (query) => {
    const offset = 0;
    const size = 20;
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query, offset, size } });
  };

  render() {
    const persons = this.props.expertTrajectory.results;
    const { query } = this.state;
    return (
      <Page contentClass={tc(['ExpertTrajectoryPage'])} onSearch={this.onSearch}
            query={query}>
        <div className={classnames('content-inner', styles.page)}>
          <Layout className={styles.experts}>
            <Sider className={styles.left}>
              <PersonListLittle persons={persons}
                                onClick={this.onPersonClick.bind(this, 1900, 2017)} />
            </Sider>
            <Layout className={styles.right}>
              <Content className={styles.content}>
                <ExpertTrajectory person={this.state.cperson} />
              </Content>
            </Layout>
          </Layout>
        </div>
      </Page>
    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);

