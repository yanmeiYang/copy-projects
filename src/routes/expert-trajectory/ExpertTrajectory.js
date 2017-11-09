import React from 'react';
import { connect } from 'dva';
import { loadScript } from 'utils/requirejs';
import styles from './ExpertTrajectory.less';
import { showChart, load } from './utils/echarts-utils';

let address = [];
let addValue = {};
let myChart; // used for loadScript

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
    this.initChart();
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    if (nextProps.expertTrajectory.trajData !== this.props.expertTrajectory.trajData) {
      load((echarts) => {
        this.calculateData(nextProps.expertTrajectory.trajData); // 用新的来代替
      });
    }
    return true;
  }

  initChart = () => {
    const divId = 'chart';
    load((echarts) => {
      myChart = echarts.init(document.getElementById(divId));
      showChart(myChart, 'bmap');
      if (this.props.person === '') {
        console.log('Try to click one person!');
      } else { //为以后将ExpertTrajectory做组件使用
        const personId = this.props.person.id;
        const start = 0;
        const end = 2017;
        this.props.dispatch({
          type: 'expertTrajectory/findTrajById',
          payload: { personId, start, end },
        });
      }
    });
  };

  initChartBackupxxxxxxxxxxxxxx = () => {
    let counter = 0;
    const divId = 'chart';
    const echartsInterval = setInterval(() => {
      if (typeof (window.BMap) === 'undefined') {
        counter += 1;
        if (counter > 20) {
          clearInterval(echartsInterval);
          loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
            loadScript('/lib/echarts-map/world.js', () => {
              myChart = window.echarts.init(document.getElementById(divId));
              showChart(myChart, 'geo');
              if (this.props.person === '') {
                console.log('Try to clcik one person!');
              } else { //为以后将ExpertTrajectory做组件使用
                const personId = this.props.person.id;
                const start = 0;
                const end = 2017;
                this.props.dispatch({
                  type: 'expertTrajectory/findTrajById',
                  payload: { personId, start, end },
                });
              }
            });
          });
        }
      } else {
        loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
          loadScript('/lib/echarts-trajectory/bmap.min.js', () => {
            clearInterval(echartsInterval);
            myChart = window.echarts.init(document.getElementById(divId));
            showChart(myChart, 'bmap');
            if (this.props.person === '') {
              console.log('Try to clcik one person!');
            } else { //为以后将ExpertTrajectory做组件使用
              const personId = this.props.person.id;
              const start = 0;
              const end = 2017;
              this.props.dispatch({
                type: 'expertTrajectory/findTrajById',
                payload: { personId, start, end },
              });
            }
          });
        });
      }
    }, 100);
  };

  showTrajectory = (data) => {
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

    for (const key in address) {
      if (address) {
        points.push({
          name: address[key].name + addValue[key][0], //可加入城市信息
          value: [address[key].geo.lng, address[key].geo.lat],
          symbolSize: (addValue[key][1] / 2) + 3,
          itemStyle: {
            normal: {
              color: '#f56a00',
              borderColor: '#d75000',
            },
          },
        });
      }
    }
    const option = myChart.getOption();
    option.series[0].data = points;
    option.series[1].data = trajData;
    myChart.setOption(option);
  };

  calculateData = (data) => {
    address = [];
    addValue = {};
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
          }
          [, previous] = d;
        }
        addValue[previous][0] = `${addValue[previous][0]}${start}-now,`;
        addValue[previous][1] = ((addValue[previous][1] + 2017) - startYear) + 1;
      }
    }
    this.showTrajectory(data);
  };

  render() {
    return (
      <div>
        <div className={styles.wor} id="chart" />
      </div>
    );
  }
}

export default ExpertTrajectory;
