/*
 * created by ???? on 2017-??-??.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './ExpertHeatmapPage.less';
import LeftInfoZoneCluster from './LeftInfoZoneCluster';
import LeftLineInfoCluster from './LeftLineInfoCluster';
import ExpertHeatmap from './ExpertHeatmap';
import { Layout } from 'antd';
import { Spinner } from '../../components';

const { Content, Sider } = Layout;
class ExpertHeatmapPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: 'data mining',
    mapType: 'google', // [baidu|google]
    from: '',
    to: '',
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
      // TODO change this, 不能用
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
  };

  toggleRightInfo = (type) => {
      this.props.dispatch({
        type: 'expertTrajectory/setRightInfo',
        payload: { rightInfoType: type },
      });
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query } });
  }

  callClusterPerson =(clusterIdList, from1, to1, type) => {
    console.log('id', clusterIdList);
    this.props.dispatch({ type: 'expertTrajectory/listPersonByIds', payload: { ids: clusterIdList } });
    this.props.dispatch({ type: 'expertTrajectory/setRightInfo', payload: { rightInfoType: type } });
    if(from1 && to1){
      this.setState({ from: from1, to: to1});
    }
  }

  render() {
    const load = this.props.loading.models.expertTrajectory;
    const rightType = this.props.expertTrajectory.infoZoneIds;
    const ifPlay = this.state.ifPlay;
    const from = this.state.from;
    const to = this.state.to;
    const clusterPersons = this.props.expertTrajectory.clusterPersons;
    const rightInfos = {
       scatter: () => (<LeftInfoZoneCluster persons={clusterPersons} />),
       // lines: () => (<LeftLineInfoCluster persons={clusterPersons} />),
       lines: () => (<LeftLineInfoCluster persons={clusterPersons} from={from} to={to}/>),
    };
    return (
      <div className={classnames('content-inner', styles.page)}>

        <Layout >
          <Sider className={styles.left} width={250} style={{ backgroundColor: '#fff' }}>
            <Spinner className={styles.load} loading={load} style={{ padding: '20px' }} />
            {rightInfos[rightType] && rightInfos[rightType]()}
          </Sider>

          <Layout className={styles.right} >
            <Content className={styles.content}>
              <ExpertHeatmap onPageClick={this.callClusterPerson} />
            </Content>
          </Layout>
        </Layout>


      </div>
    );
  }
}

export default connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))(ExpertHeatmapPage);
