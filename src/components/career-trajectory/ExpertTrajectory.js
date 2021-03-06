import React from 'react';
import { connect } from 'engine';
// import { withRouter } from 'dva/router';
import queryString from 'query-string';
import styles from './ExpertTrajectory.less';
import { showChart } from './utils/echarts-utils';
import { loadEchartsWithBMap, showCurrentLine, addMarkers } from './utils/func-utils';

let myChart; // used for loadScript
let trainterval;

// Models([require('models/expert-trajectory')]);

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
// @withRouter
export default class ExpertTrajectory extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    query: '',
  };

  componentDidMount() {
    this.initChart(this.props.person);
    // TODO bad design. Here must be a delay.
    window.onresize = () => {
      this.initChart(this.props.person);
    };
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
      return true;
    }
    if (nextProps.expertTrajectory.trajData !== this.props.expertTrajectory.trajData) {
      this.showTrajectory(nextProps.expertTrajectory.trajData);
    }
    if (nextProps.person !== this.props.person) {
      this.initChart(nextProps.person);
      return true;
    }
    if (nextProps.play !== this.props.play) {
      this.showTrajectory(this.props.expertTrajectory.trajData);
      return true;
    }
    if (this.props.themeKey !== nextProps.themeKey) {
      showChart(myChart, 'bmap', nextProps.themeKey, 'trajectory');
      this.showTrajectory(this.props.expertTrajectory.trajData);
      return true;
    }
    return false;
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  initChart = (person) => {
    const divId = 'chart';
    loadEchartsWithBMap((echarts) => {
      if (myChart !== null && myChart !== '' && myChart !== undefined) {
        myChart.dispose();
      }
      myChart = echarts.init(document.getElementById(divId));
      let skinType = this.props.themeKey;
      if (typeof (skinType) === 'undefined') {
        skinType = '1'; //假设默认为bussiness
      }
      showChart(myChart, 'bmap', skinType, 'trajectory');
      this.findPersonTraj(person);
    });
  };

  findPersonTraj = (person) => {
    if (person === '') {
      console.log('Try to click one person!');
    } else { //为以后将ExpertTrajectory做组件使用
      const personId = person.id;
      const start = 0;
      const date = new Date();
      const end = date.getFullYear();
      this.props.dispatch({
        type: 'expertTrajectory/findTrajById',
        payload: { personId, start, end },
      });
    }
  };

  showTrajectory = (data) => {
    if (!data || !data.lineData || !data.pointData) {
      return false;
    }
    let length = 0;
    if (trainterval) {
      clearInterval(trainterval);
    }
    trainterval = setInterval(() => {
      if (length < data.step.length) {
        myChart.setOption({ title: { text: `Trajectory of Scholar ${this.props.person.name}` } });
        const currentline = showCurrentLine(myChart.getOption().series[2]);
        currentline.data = data.lineData.slice(length, (length + 1));
        myChart.setOption({
          series: [{}, { data: data.pointData.slice(0, data.step[length]) },
            { data: data.lineData.slice(0, length) }, currentline]
        });
        length += 1;
        addMarkers(myChart, data, length);
      } else {
        //length = 0;
        clearInterval(trainterval);
      }
    }, 3000);
  };

  render() {
    const { location } = this.props;
    const { flag } = queryString.parse(location.search);
    let wid = flag ? document.body.clientHeight - 80 : document.body.clientHeight;
    const { centerZoom } = this.props;
    if (centerZoom) {
      wid = 500;
    }
    return (
      <div>
        <div className={styles.map} id="chart" style={{ height: wid }} />
      </div>
    );
  }
}
