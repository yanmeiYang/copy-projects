import React from 'react';
import { connect } from 'dva';
import { loadScript } from 'utils/requirejs';
import { Button, Modal, Tabs, Table } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import styles from './ExpertTrajectory.less';
import { showChart, load } from './utils/echarts-utils';

let address = [];
let addValue = {};
let addInfo = [];
let myChart; // used for loadScript
let trainterval;
const { TabPane } = Tabs;

@connect(({ expertTrajectory, loading }) => ({ expertTrajectory, loading }))
class ExpertTrajectory extends React.Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
  }

  state = {
    query: '',
  };

  componentDidMount() {
    this.initChart(this.props.person);
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
      this.calculateData(nextProps.expertTrajectory.trajData); // 用新的来代替
    }
    if (nextProps.person !== this.props.person) {
      this.initChart(nextProps.person);
      return true;
    }
    if (this.props.themeKey !== nextProps.themeKey) {
      showChart(myChart, 'bmap', nextProps.themeKey);
      this.showTrajectory(this.props.expertTrajectory.trajData);
    }
    return false;
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  initChart = (person) => {
    const divId = 'chart';
    load((echarts) => {
      myChart = echarts.init(document.getElementById(divId));
      let skinType = this.props.themeKey;
      if (typeof (skinType) === 'undefined') {
        skinType = '2'; //假设默认为dark
      }
      showChart(myChart, 'bmap', skinType);
      this.findPersonTraj(person);
    });
  };

  findPersonTraj = (person) => {
    if (person === '') {
      console.log('Try to click one person!');
    } else { //为以后将ExpertTrajectory做组件使用
      const personId = person.id;
      const start = 0;
      const end = 2017;
      this.props.dispatch({
        type: 'expertTrajectory/findTrajById',
        payload: { personId, start, end },
      });
    }
  };

  showTrajectory = (data) => {
    if (!data || !data.data) {
      return false;
    }
    const points = [];
    const trajData = [];
    for (const key in data.data.trajectories) {
      if (data.data.trajectories) {
        let previous = '';
        for (const d of data.data.trajectories[key]) {
          if (previous !== d[1] && previous !== '') {
            trajData.push({
              coords: [[address[previous].geo.lng, address[previous].geo.lat],
                [address[d[1]].geo.lng, address[d[1]].geo.lat]],
            });
          }
          [, previous] = d;
        }
      }
    }
    let dup = '';
    for (let i = 0; i < addInfo.length; i += 1) {
      if (address) {
        const key = addInfo[i];
        const latlng = [address[key].geo.lng, address[key].geo.lat].join(',');
        if (dup.indexOf(latlng) === -1) {
          dup = [dup, latlng].join('+');
          points.push({
            name: address[key].name + addValue[key][0], //可加入城市信息
            value: [address[key].geo.lng, address[key].geo.lat],
            symbolSize: (addValue[key][1] / 2) + 3,
          });
        } else {
          points.push({
            name: address[key].name + addValue[key][0], //可加入城市信息
          });
        }
      }
    }
    let lineData;
    let pointData;
    myChart.setOption({ title: { text: `学者${this.props.person.name_zh}迁徙图` } });
    const { centerZoom } = this.props;
    if (centerZoom) {
      myChart.setOption({ bmap: { center: points[0].value } });
    }

    let length = 0;
    if (trainterval) {
      clearInterval(trainterval);
    }
    trainterval = setInterval(() => {
      if (length < (trajData.length + 1)) {
        length += 1;
        lineData = trajData.slice(0, length);
        pointData = points.slice(0, length);
        myChart.setOption({ series: [{}, { data: pointData }, { data: lineData }] });
      } else {
        clearInterval(trainterval);
      }
    }, 500);
  };

  calculateData = (data) => {
    address = [];
    addValue = {};
    addInfo = [];
    for (const key in data.data.addresses) {
      if (data.data.addresses) {
        address[key] = data.data.addresses[key];
      }
    }
    for (const key in data.data.trajectories) {
      if (data.data.trajectories) {
        let startYear;
        let endYear;
        let start;
        let previous = '';
        for (const d of data.data.trajectories[key]) {
          if (previous !== d[1] && previous !== '') {
            addInfo.push(d[1]);
            endYear = parseInt(d[0], 10);
            addValue[previous][0] = `${addValue[previous][0]}${start}-${d[0]},`;
            addValue[previous][1] = ((addValue[previous][1] + endYear) - startYear) + 1;
            startYear = parseInt(d[0], 10);
            [start] = d;
            if (!addValue[d[1]]) {
              addValue[d[1]] = [];
              addValue[d[1]][0] = '';
              addValue[d[1]][1] = 0;
            }
          } else if (previous === d[1]) {
            endYear = parseInt(d[0], 10);
          }
          if (previous === '') {
            addValue[d[1]] = [];
            addValue[d[1]][0] = '';
            addValue[d[1]][1] = 0;
            [start] = d;
            startYear = parseInt(d[0], 10);
            addInfo.push(d[1]);
          }
          [, previous] = d;
        }
        if (addValue[previous] !== undefined) {
          addInfo.push(previous);
          addValue[previous][0] = `${addValue[previous][0]}${start}-now,`;
          addValue[previous][1] = ((addValue[previous][1] + 2017) - startYear) + 1;
        }
      }
    }
    this.showTrajectory(data);
  };

  render() {
    let wid = document.body.clientHeight - 210;
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

export default ExpertTrajectory;
