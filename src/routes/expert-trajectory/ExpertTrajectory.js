import React from 'react';
import { connect } from 'dva';
import loadScript from 'load-script';
import { Button } from 'antd';
import styles from './ExpertTrajectory.less';

let option = {};
let echarts; // used for loadScript

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
    const echartsInterval = setInterval(() => {
      console.log(window.BMap);
      if (typeof (window.BMap) === 'undefined') {
        console.log('wait!!@@@@@@@@@@@@@@@@@@@@@@@@@@');
      } else {
        loadScript('/lib/echarts-trajectory/echarts.min.js', () => {
          loadScript('/lib/echarts-trajectory/bmap.min.js', () => {
            echarts = window.echarts; // eslint-disable-line prefer-destructuring
            clearInterval(echartsInterval);
            this.myChart = window.echarts.init(document.getElementById('chart'));
            this.showChart();
          });
        });
      }
    }, 100);
  }

  shouldComponentUpdate(nextProps, nextState) { // 状态改变时判断要不要刷新
    if (nextState.query && nextState.query !== this.state.query) {
      this.callSearchMap(nextState.query);
    }
    if (nextProps.expertTrajectory.trajData !== this.props.expertTrajectory.trajData) {
      this.showTrajectory(nextProps.expertTrajectory.trajData); //用新的来代替
    }
    return true;
  }

  showTrajectory = (data) => {
    const points = [];
    const lines = [];
    const address = [];
    for (const key in data.data.addresses) {
      if (data.data.addresses) {
        address[key] = data.data.addresses[key];
        points.push({
          name: address[key].name, //可加入城市信息
          value: [address[key].geo.lng, address[key].geo.lat],
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#f56a00',
              borderColor: '#d75000',
            },
          },
        });
      }
    }
    const trajData = [];
    for (const key in data.data.trajectories) {
      if (data.data.trajectories) {
        let startYear;
        let previous = '';
        for (const d of data.data.trajectories[key]) {
          if (previous !== d[1] && previous !== '') {
            trajData.push({
              coords: [[address[previous].geo.lng, address[previous].geo.lat],
                [address[d[1]].geo.lng, address[d[1]].geo.lat]],
            });
          }
          if (previous === '') {
            [previous, startYear] = [d[1], parseInt(d[0], 10)];
          }
        }
      }
    }
    option.series[0].data = points;
    option.series[1].data = trajData;
    this.myChart.setOption(option);
  };

  showChart = () => { // 功能起始函数
    option = {
      backgroundColor: '#404a59',
      title: {
        text: '学者迁移图',
        subtext: 'data from aminer',
        sublink: 'http://aminer.org/',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      bmap: {
        center: [-169,30],
        zoom: 1,
        roam: true,
        mapStyle: {
          styleJson: [{
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#404a59',
            },
          },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#323c48',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry',
              stylers: {
                color: '#565656',
              },
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'highway',
              elementType: 'geometry.fill',
              stylers: {
                color: '#565656',
                lightness: 1,
              },
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#004981',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#00508b',
              },
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                color: '#8a8060',
                visibility: 'off',
              },
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'geometry.fill',
              stylers: {
                color: '#fff',
              },
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#1a5787',
              },
            },
            {
              featureType: 'label',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
          ],
        },
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'bmap',
        zlevel: 5,
        rippleEffect: {
          period: 4,
          scale: 2,
          brushType: 'stroke',
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: '{b}',
          },
          emphasis: {
            show: true,
          },
        },
        symbolSize: 5,
        itemStyle: {
          normal: {
            color: '#fff',
            borderColor: 'gold',
          },
        },
        data: [],
      }, {
          type: 'lines',
          zlevel: 2,
          coordinateSystem: 'bmap',
          effect: {
            show: true,
            period: 6,
            trailLength: 0.1,
            color: '#f78e3d',
            symbol: 'arrow',
            symbolSize: 5,
            animation: true,
          },
          lineStyle: {
            normal: {
              color: '#f78e3d',
              width: 1.5,
              opacity: 0.4,
              curveness: 0.2,
            },
          },
          data: [],
        }],
    };
    this.myChart.setOption(option);
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
