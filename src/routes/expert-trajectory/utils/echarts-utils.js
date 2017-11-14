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

const showChart = (myChart, type, skinType) => { // 功能起始函数
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
      mapStyle: mapStyle[skinType], // mapStyle[skinType]
    },
    visualMap: {
      show: true,
      min: 0,
      max: 10,
      orient: 'horizontal',
      right: 'right',
      bottom: 'bottom',
      seriesIndex: 0,
      calculable: true,
      inRange: {
        color: ['#d2eafb', '#7ec2f3', '#49a9ee', '#108ee9', '#0c60aa', '#0c60aa'].reverse(),
      },
      textStyle: {
        color: '#fff',
      },
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'bmap',
      data: [],
      pointSize: 5,
      blurSize: 6,
      blendMode: 'hard-light',
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
          color: '#f77a2b',
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
        // color: '#3d7ef7',
        color: '#f78e3d',
        symbol: 'arrow',
        symbolSize: 5,
        animation: true,
      },
      lineStyle: {
        normal: {
          color: '#f78e3d',
          width: 0.8,
          opacity: 1,
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
    featureType: 'land',
    elementType: 'geometry',
    stylers: {
      color: '#323c48',
    },
  },
    {
      featureType: 'building',
      elementType: 'geometry',
      stylers: {
        color: '#2b2b2b',
      },
    },
    {
      featureType: 'highway',
      elementType: 'all',
      stylers: {
        lightness: -42,
        saturation: -91,
      },
    },
    {
      featureType: 'arterial',
      elementType: 'geometry',
      stylers: {
        lightness: -77,
        saturation: -94,
      },
    },
    {
      featureType: 'green',
      elementType: 'geometry',
      stylers: {
        color: '#1b1b1b',
      },
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: {
        color: '#404a59',
      },
    },
    {
      featureType: 'subway',
      elementType: 'geometry.stroke',
      stylers: {
        color: '#181818',
      },
    },
    {
      featureType: 'railway',
      elementType: 'geometry',
      stylers: {
        lightness: -52,
      },
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: {
        color: '#313131',
      },
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: {
        color: '#8b8787',
      },
    },
    {
      featureType: 'manmade',
      elementType: 'geometry',
      stylers: {
        color: '#1b1b1b',
      },
    },
    {
      featureType: 'local',
      elementType: 'geometry',
      stylers: {
        lightness: -75,
        saturation: -91,
      },
    },
    {
      featureType: 'subway',
      elementType: 'geometry',
      stylers: {
        lightness: -65,
      },
    },
    {
      featureType: 'railway',
      elementType: 'all',
      stylers: {
        lightness: -40,
      },
    },
    {
      featureType: 'boundary',
      elementType: 'geometry',
      stylers: {
        color: '#8b8787',
        weight: '1',
        lightness: -29,
      },
    },
  ],
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
