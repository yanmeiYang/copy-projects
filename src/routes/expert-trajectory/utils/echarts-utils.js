

const showChart = (myChart) => { // 功能起始函数
  const option = {
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
      center: [104.114129, 37.550339],
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
  myChart.setOption(option);
};

module.exports = {
  showChart,
};
