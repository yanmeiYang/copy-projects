import { loadECharts, loadBMap } from 'utils/requirejs';
import { setBMap } from './func-utils';


const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
const showChart = (myChart, type, skinType, showType) => { // 功能起始函数
  let [showLabel, dotType, showEffect] = [true, 'effectScatter', true]; //是否显示place名字，点的类型，是否显示特效
  if (typeof (showType) !== 'undefined') {
    if (showType === 'heatmap') {
      [showLabel, dotType, showEffect] = [false, 'scatter', true];
    } else if (showType === 'trajectory') {
      [showLabel, dotType, showEffect] = [true, 'effectScatter', false];
    }
  }
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
        fontWeight: 200,
        fontSize: 24,
      },
      subTextColor: {
        color: detailedStyle.subTextColor[skin],
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
      center: [4.45, 31.3],
      zoom: 1,
      roam: true,
      mapStyle, // mapStyle[skinType]
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
      name: 'place',
      type: dotType, //effectScatter
      coordinateSystem: type,
      hoverAnimation: true,
      //zlevel: 5,
      rippleEffect: {
        period: 4,
        scale: 2,
        brushType: 'stroke',
      },
      label: {
        normal: {
          show: showLabel,
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
          opacity: 0.8,
          shadowColor: 'rgba(198, 198, 198, 0.3)',
          shadowBlur: 10,
        },
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      data: [],
      blendMode: detailedStyle.blendItemStlye[skin],
    }, {
      type: 'lines',
      //animation: false,
      zlevel: 10000,
      coordinateSystem: type,
      //symbol:'arrow',
      effect: {
        show: showEffect,
        period: 3,
        trailLength: 0,
        color: detailedStyle.lineNormalStyle[skin],
        symbol: planePath,
        symbolSize: 12,
        animation: showEffect,
      },
      lineStyle: {
        normal: {
          color: detailedStyle.lineNormalStyle[skin],
          width: 1, //线的宽度0.8
          opacity: 1,
          curveness: 0.2,
        },
        emphasis: {
          color: detailedStyle.lineEmphasisStyle[skin],
          //shadowColor: 'rgba(0, 0, 0, 0.5)',
          //shadowBlur: 7,
        },
      },
      data: [],
      blendMode: detailedStyle.blendLineStlye[skin],
    }],
  };
  myChart.setOption(option);
  if (type === 'bmap') {
    setBMap(myChart);
  }
};

const visual = ['green', 'yellow', 'yellow', 'red'];
const detailedStyle = {
  textColor: ['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#272727'],
  textShadowColor: ['', '', '', '', '#ffab40', '', '#6a6a6a'],
  subTextShadowColor: ['', '', '', '', 'white', '', ''],
  subTextColor: ['', '', '', 'black', '#ff5f00', '#fff', ''],
  waterStyle: ['', '#042e4c', '#495463', '#80cbc4', '#b28759', '#4e6c8d', '#d1d1d1'],
  landStyle: ['', '#004981', '#323c48', '#009688', '#a0522f', '#aedaf5', '#f3f3f3'],
  boundaryStyle: ['', '#064f85', '#3F5991', '#2a846f', '#e97b00', '#ab485c', '#9e9e9e'],
  highwayStyle: ['', '#004981', '', '#004d40', '#fb8c00', '#ab485c', '#fdfdfd'],
  highwaylightness: ['', '1', '-42', '', '', '', ''],
  highwayStyle2: ['', '#005b96', '', '#004d40', '#fb8c00', '#ab485c', '#fdfdfd'],
  arterialStyle: ['', '#004981', '', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  arterialStyle2: ['', '#00508b', '', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  greenStyle: ['', '#056197', '#1b1b1b', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  boundaryStyle2: ['', '#029fd4', '#3F5991', '#004d40', '#fb8c00', '#ab485c', '#fefefe'],
  buildingStyle: ['', '#1a5787', '#2b2b2b', '#004d40', '#fb8c00', '#ab485c', '#d1d1d1'],
  lineNormalStyle: ['#f78e3d', '#2159b7', '#5D8CF7', '#00eec7', '#d7b088', '#daedf5', '#ed9c8e'],
  lineEmphasisStyle: ['#f74300', '#3d7ef7', '#F67E63', '#00eec7', '#d7b088', '#F67E63', '#ed401f'],
  itemNormalStyle: ['#f77a2b', '#5c95f7', '#5c95f7', '#68e4df', '#c4936e', '#2164f4', '#ed9c8e'],
  itemNormalBorderStyle: ['gold', '#3d7ef7', '#3d7ef7', '#68e4df', '', '#468ff4', '#ed9c8e'],
  itemEmphasisStyle: ['#f77325', '#3d7ef7', '#3d7ef7', '#68e4df', '#c4936e', '#2164f4', '#ed9c8e'],
  blendLineStlye: ['', 'screen', 'screen', 'screen', 'screen', 'screen', ''],
  blendItemStlye: ['', 'lighter', 'lighter', 'lighter', 'lighter', '', ''],
  blendHeatStlye: ['', 'hard-light', '', '', '', '', ''],
  visualStyle: [['green', 'yellow', 'yellow', 'red'],
    ['#d2eafb', '#7ec2f3', '#49a9ee', '#108ee9', '#0c60aa', '#0c60aa'].reverse(),
    ['#d2eafb', '#7ec2f3', '#49a9ee', '#108ee9', '#0c60aa', '#0c60aa'].reverse(),
    ['#004d3c', '#006d5c', '#009885', '#00cfb7', '#00f0d8', '#00ffe7'].reverse(), visual, visual, visual],
};

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

module.exports = {
  showChart,
};
