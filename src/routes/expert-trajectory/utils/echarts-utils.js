import { loadECharts, loadBMap, loadBMapForECharts } from 'utils/requirejs';

const setBMap = (myChart) => {
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
      mapStyle: mapStyle[0],
    },
    visualMap: {
      show: false,
      top: 'top',
      min: 0,
      max: 5,
      seriesIndex: 0,
      calculable: true,
      inRange: {
        color: ['blue', 'blue', 'green', 'yellow', 'red'],
      },
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'bmap',
      data: [],
      pointSize: 5,
      blurSize: 6,
    }, {
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

const mapStyle = [{}, {
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
}, {
    styleJson: [{
      featureType: 'water',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'land',
      elementType: 'all',
      stylers: {
        color: '#f3f3f3',
      },
    }, {
      featureType: 'railway',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'highway',
      elementType: 'all',
      stylers: {
        color: '#fdfdfd',
      },
    }, {
      featureType: 'highway',
      elementType: 'labels',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'arterial',
      elementType: 'geometry',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'arterial',
      elementType: 'geometry.fill',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'poi',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'green',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'subway',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'manmade',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'local',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'arterial',
      elementType: 'labels',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'boundary',
      elementType: 'all',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'building',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'label',
      elementType: 'labels.text.fill',
      stylers: {
        color: '#999999',
      },
    }],
}, {
    styleJson: [{
      featureType: 'water',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'land',
      elementType: 'all',
      stylers: {
        color: '#f3f3f3',
      },
    }, {
      featureType: 'railway',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'highway',
      elementType: 'all',
      stylers: {
        color: '#fdfdfd',
      },
    }, {
      featureType: 'highway',
      elementType: 'labels',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'arterial',
      elementType: 'geometry',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'arterial',
      elementType: 'geometry.fill',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'poi',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'green',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'subway',
      elementType: 'all',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'manmade',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'local',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'arterial',
      elementType: 'labels',
      stylers: {
        visibility: 'off',
      },
    }, {
      featureType: 'boundary',
      elementType: 'all',
      stylers: {
        color: '#fefefe',
      },
    }, {
      featureType: 'building',
      elementType: 'all',
      stylers: {
        color: '#d1d1d1',
      },
    }, {
      featureType: 'label',
      elementType: 'labels.text.fill',
      stylers: {
        color: '#999999',
      },
    }],
}];

const load = (cb) => {
  loadBMap(() => {
    loadECharts((echarts) => {
      loadBMapForECharts(() => {
        if (cb) {
          cb(echarts);
        }
      });
    });
  });
};

module.exports = {
  showChart,
  setBMap,
  load,
};
