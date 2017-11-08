

const setBMap = (myChart) => {
  console.log(myChart);
  const map = myChart.getModel().getComponent('bmap').getBMap();
  const navigationControl = new window.BMap.NavigationControl({ // 添加带有定位的导航控件
    anchor: 'BMAP_ANCHOR_TOP_LEFT', // 靠左上角位置
    type: 'BMAP_NAVIGATION_CONTROL_LARGE', // LARGE类型
    enableGeolocation: true, // 启用显示定位
  });
  map.addControl(navigationControl);
};

const showChart = (myChart, type) => { // 功能起始函数
  let color = '';
  if (type === 'geo') {
    color = '#abc1db';
  } else {
    color = '#404a59';
  }
  const option = {
    backgroundColor: color,
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
    geo: {
      zoom: 1,
      name: 'trajectory',
      type: 'map',
      map: 'world',
      roam: true,
      label: {
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          areaColor: '#f5f3f0',
          borderColor: '#91a0ae',
        },
        emphasis: {
          areaColor: '#bcbab8',
        },
      },
    },
    bmap: {
      center: [34.45, 31.3],
      zoom: 1,
      roam: true,
      mapStyle: {
        styleJson: [{
          featureType: 'water',
          elementType: 'all',
          stylers: {
            color: '#044161',
          },
        },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#004981',
            },
          },
          {
            featureType: 'boundary',
            elementType: 'geometry',
            stylers: {
              color: '#064f85',
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
              color: '#005b96',
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
              color: '#056197',
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
              color: '#029fd4',
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
      coordinateSystem: type,
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
      coordinateSystem: type,
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
  myChart.setOption(option);
  if (type === 'bmap') {
    setBMap(myChart);
  }
};

module.exports = {
  showChart,
  setBMap,
};
