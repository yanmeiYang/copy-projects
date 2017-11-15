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
  const skin = parseInt(skinType, 10);
  let color = '';
  if (type === 'geo') {
    color = '#abc1db';
  } else {
    color = '#404a59';
  }
  mapStyle.styleJson[0].stylers.color = detailedStyle.waterStyle[skin];
  mapStyle.styleJson[1].stylers.color = detailedStyle.landStyle[skin];
  mapStyle.styleJson[2].stylers.color = detailedStyle.boundaryStyle[skin];
  mapStyle.styleJson[3].stylers.color = detailedStyle.waterStyle[skin];
  mapStyle.styleJson[5].stylers.color = detailedStyle.highwayStyle[skin];
  mapStyle.styleJson[6].stylers.color = detailedStyle.highwayStyle2[skin];
  mapStyle.styleJson[6].stylers.lightness = detailedStyle.highwaylightness[skin];
  mapStyle.styleJson[7].stylers.color = detailedStyle.arterialStyle[skin];
  mapStyle.styleJson[8].stylers.color = detailedStyle.arterialStyle2[skin];
  mapStyle.styleJson[10].stylers.color = detailedStyle.greenStyle[skin];
  mapStyle.styleJson[15].stylers.color = detailedStyle.boundaryStyle2[skin];
  mapStyle.styleJson[16].stylers.color = detailedStyle.buildingStyle[skin];
  const option = {
    backgroundColor: color,
    title: {
      text: '学者迁移图',
      subtext: 'data from aminer',
      sublink: 'http://aminer.org/',
      left: 'center',
      textStyle: {
        color: detailedStyle.textColor[skin],
      },
      subTextColor: {
        color: detailedStyle.subTextColor[skin],
      }
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
      mapStyle: mapStyle, // mapStyle[skinType]
    },
    visualMap: {
      show: true,
      // top: 'top',
      min: 0,
      max: 10,
      orient: 'horizontal',
      right: 'right',
      bottom: 'bottom',
      seriesIndex: 0,
      calculable: true,
      inRange: {
        color: detailedStyle.visualStyle[skin],
        // color: ['green','red','yellow'],
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
      blendMode: detailedStyle.blendHeatStlye[skin],
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
          color: detailedStyle.itemNormalStyle[skin],
          borderColor: detailedStyle.itemEmphasisStyle[skin],
        },
      },
      data: [],
      blendMode: detailedStyle.blendItemStlye[skin],
    }, {
      type: 'lines',
      zlevel: 2,
      coordinateSystem: type,
      effect: {
        show: true,
        period: 6,
        trailLength: 0.1,
        color: detailedStyle.lineNormalStyle[skin],
        // color: '#f78e3d',
        symbol: 'arrow',
        symbolSize: 5,
        animation: true,
      },
      lineStyle: {
        normal: {
          color: detailedStyle.lineNormalStyle[skin],
          // color: '#f78e3d',
          width: 0.8,
          opacity: 1,
          curveness: 0.2,
        },
        emphasis: {
          color: detailedStyle.lineEmphasisStyle[skin],
        },
      },
      data: [],
      blendMode: detailedStyle.blendLineStlye[skin],
    }],
  };
  console.log("iii", skin, option.bmap.mapStyle)
  myChart.setOption(option);
  if (type === 'bmap') {
    setBMap(myChart);
  }
};
const visual = ['green', 'yellow', 'yellow', 'red'];
const detailedStyle = {
  textColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff'],
  textShadowColor: ['', '', '', '', '#ffab40', ''],
  subTextShadowColor: ['', '', '', '', 'white', ''],
  subTextColor: ['', '', '', 'black', '#ff5f00', '#fff'],
  waterStyle: ['', '#044161', '#404a59', '#80cbc4', '#e3f2fd', '#4e6c8d', '#d1d1d1'],
  landStyle: ['', '#004981', '#323c48', '#009688', '#ffab40', '#aedaf5', '#f3f3f3'],
  boundaryStyle: ['', '#064f85', '#8b8787', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  highwayStyle: ['', '#004981', '', '#004d40', '#fb8c00', '#ab485c', '#fdfdfd' ],
  highwaylightness: ['', '1', '-42', '', '', '', ''],
  highwayStyle2: ['', '#005b96', '', '#004d40', '#fb8c00', '#ab485c', '#fdfdfd'],
  arterialStyle: ['', '#004981', '', '#004d40', '#fb8c00', '#ab485c', '#fefefe' ],
  arterialStyle2: ['', '#00508b', '', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  greenStyle: ['', '#056197', '#1b1b1b', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  boundaryStyle2: ['', '#029fd4', '#8b8787', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  buildingStyle: ['', '#1a5787', '#2b2b2b', '#004d40', '#fb8c00', '#ab485c', '#d1d1d1'],
  lineNormalStyle: ['#f78e3d', '#3d7ef7', '#f78e3d', '#00846d', '#346bff', '#aedaf5', '#aedaf5'],
  lineEmphasisStyle: ['#f77325', '3d7ef7', '#f77325', '#00846d', '#346bff', '#aedaf5', '#aedaf5'],
  itemNormalStyle: ['#f77a2b', '#5c95f7', '#f77a2b', '#fff', '#fff', '#fff', '#fff'],
  itemNormalBorderStyle: ['gold', '#3d7ef7', 'gold', 'gold', 'gold', 'gold', 'gold'],
  itemEmphasisStyle: ['#f77325', '#3d7ef7', '#f77325', 'blue', 'blue', 'blue', 'blue'],
  blendLineStlye: ['', 'screen', '', 'screen', 'screen', 'screen', 'screen'],
  blendItemStlye: ['', 'lighter', '', '', '', '', '' ],
  blendHeatStlye: ['', 'hard-light', '', '', '', '', '' ],
  visualStyle: [['green', 'yellow', 'yellow', 'red'], ['#d2eafb', '#7ec2f3', '#49a9ee', '#108ee9', '#0c60aa', '#0c60aa'].reverse(), visual, visual, visual, visual, visual],
}

const mapStyle = {
  styleJson: [{
    featureType: 'water',
    elementType: 'all',
    stylers: {
      color: '',
    },
  },
    {
      featureType: 'land',
      elementType: 'all',
      stylers: {
        color: '',
      },
    },
    {
      featureType: 'boundary',
      elementType: 'geometry',
      stylers: {
        color: '',
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
        color: '',
      },
    },
    {
      featureType: 'highway',
      elementType: 'geometry.fill',
      stylers: {
        color: '',
        lightness: '',
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
        color: '',
      },
    },
    {
      featureType: 'arterial',
      elementType: 'geometry.fill',
      stylers: {
        color: '',
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
        color: '',
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
        color: '',
      },
    },
    {
      featureType: 'building',
      elementType: 'all',
      stylers: {
        color: '',
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
};

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
