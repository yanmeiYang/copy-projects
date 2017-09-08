/*
 * created by Xinyi Xu on 2017-8-16.
 */
import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import queryString from 'query-string';
// import { Slider, Switch, InputNumber, Row, Col, Icon, Button } from 'antd';
import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/map'; // 引入地图
import 'echarts/lib/chart/lines';
import 'echarts/lib/chart/effectScatter';
import 'echarts/map/js/china'; // 引入中国地图//
import 'echarts/map/js/world';
import styles from './ExpertTrajectoryPage.less';
import { Button, Layout } from 'antd';
import { PersonListLittle } from '../../components/person';
import ExpertTrajectory from './ExpertTrajectory';
import mapData from '../../../external-docs/expert-trajectory/testData.json';
// import world from 'echarts/map/js/world';
const { Content, Sider } = Layout;
const option = {};
const address2 = mapData.addresses;
const trajectory = mapData.trajectory;
const ifDraw = 0;

class ExpertTrajectoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
    mapType: 'google', // [baidu|google]
    view: {},
    // results: [],
  };

  componentWillMount(nextProps) {
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

  // componentWillReceiveProps(nextProps) { //用于当传进来一个1，让name = 1，在update前执行
  //   console.log('compare: ', nextProps.location.query, ' == ', this.props.location.query)
  //   if (nextProps.location.query && nextProps.location.query !== this.props.location.query) {
  //     this.callSearchMap(nextProps.location.query);
  //   }
  //   this.state.results = this.props.expertTrajectory.results;
  //   console.log("11111",this.state.results)
  //   console.log("yiyiyi",this.props.expertTrajectory.results)
  //   return true;
  // }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    return true;
  }

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertTrajectory/searchPerson', payload: { query } });
  }

  onSearch = (data) => {
    if (data.query) {
      this.setState({ query: data.query });
      // TODO change this, 涓嶈兘鐢?
      this.props.dispatch({
        type: 'app/setQueryInHeaderIfExist',
        payload: { query: data.query }
      });
      this.props.dispatch(routerRedux.push({
        pathname: '/expert-trajectory',
        query: { query: data.query },
      }));
    }
  };


  onPersonClick = (personId) => {
    alert(personId);
    this.props.dispatch({ type: 'expertTrajectory/dataFind', payload: { personId } });
  }

  render() {
    // // const model = this.props && this.props.expertTrajectory;
    const persons = this.props.expertTrajectory.results;
    console.log('person', persons);

    return (
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

    );
  }
}

export default connect(({ expertTrajectory }) => ({ expertTrajectory }))(ExpertTrajectoryPage);

