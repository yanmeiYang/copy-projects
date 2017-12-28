import { loadECharts } from 'utils/requirejs';
import { randomColor } from './func-utils';

let myEChart;

const showBulkTraj = (data, type) => {
  loadECharts((echarts) => {
    myEChart = echarts;
  });
  console.log(data);
  if (typeof (data.staData) === 'undefined') {
    document.getElementById(type).innerHTML = 'No Data!';
  } else {
    let option;
    console.log(type);
    if (type === 'timeDistribution') {
      option = '';
    } else if (type === 'migrateHistory') {
      option = '';
    } else if (type === 'migrateCompare') {
      option = showMigrateCompare(data);
      console.log(option);
    }
    const myChart = myEChart.init(document.getElementById(type));
    myChart.setOption(option);
  }
};

const showMigrateCompare = (data) => {
  /*
  const colorSet = randomColor(5);
  const data = [];
  const dataCount = 10;
  //const startTime = +new Date();
  const startYear = 2000;
  const categories = ['categoryA', 'categoryB', 'categoryC']; //
  const getRandomColor = () => { //随机生成颜色
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  };
  console.log(getRandomColor());
  //做一个数组，  不够的再去自动生成
  var color = ['#ff0000','#eb4310','#f6941d','#fbb417','#ffff00','#cdd541','#99cc33','#3f9337','#219167','#239676','#24998d','#1f9baa','#0080ff','#3366cc','#333399','#003366','#800080','#a1488e','#c71585','#bd2158'];

  const types = [
    { name: 'JS Heap', color: '#7b9ce1' },
    { name: 'Documents', color: '#bd6d6c' },
    { name: 'Nodes', color: '#75d874' },
    { name: 'Listeners', color: '#e0bc78' },
    { name: 'GPU Memory', color: '#dc77dc' },
    { name: 'GPU', color: '#72b362' },
  ];
  const place = [];

  // Generate mock data
  myEChart.util.each(categories, (category, index) => {
    let baseTime = startYear;
    for (let i = 0; i < dataCount; i += 1) {
      const typeItem = types[Math.round(Math.random() * (types.length - 1))];
      const duration = Math.round(Math.random() * 10);
      data.push({
        name: typeItem.name,
        value: [
          index,
          baseTime,
          baseTime += duration,
          duration,
        ],
        itemStyle: {
          normal: {
            color: typeItem.color,
          },
        },
      });
      //baseTime += Math.round(Math.random() * 2000);
    }
    console.log(data);
  });

  console.log(data);
  console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
*/
  const option = {
    tooltip: {
      formatter: (params) => {
        return `${params.marker} ${params.name}:  ${params.value[3]} 年`;
      },
    },
    title: {
      text: 'Profile',
      left: 'center',
    },
    legend: {
      data: ['bar', 'error'],
    },
    dataZoom: [{
      type: 'slider',
      filterMode: 'weakFilter',
      showDataShadow: false,
      top: 400,
      height: 10,
      borderColor: 'transparent',
      backgroundColor: '#e2e2e2',
      handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
      handleSize: 20,
      handleStyle: {
        shadowBlur: 6,
        shadowOffsetX: 1,
        shadowOffsetY: 2,
        shadowColor: '#aaa',
      },
      labelFormatter: '',
    }, {
      type: 'inside',
      filterMode: 'weakFilter',
    }],
    grid: {
      height: 300,
    },
    xAxis: {
      min: data.startYear,
      scale: true,
      axisLabel: {
        formatter: (val) => {
          return `${Math.max(0, val)} 年`;
        },
      },
    },
    yAxis: {
      data: data.categories,
    },
    series: [{
      type: 'custom',
      renderItem,
      itemStyle: {
        normal: {
          opacity: 0.8,
        },
      },
      encode: {
        x: [1, 2],
        y: 0,
      },
      data: data.data,
    }],
  };
  return option;
};

const renderItem = (params, api) => {
  const categoryIndex = api.value(0);
  const start = api.coord([api.value(1), categoryIndex]);
  const end = api.coord([api.value(2), categoryIndex]);
  const height = api.size([0, 1])[1] * 0.6;

  return {
    type: 'rect',
    shape: myEChart.graphic.clipRectByRect({ //输入一组点，和一个矩形，返回被矩形截取过的点
      x: start[0],
      y: start[1] - (height / 2),
      width: end[0] - start[0],
      height,
    }, {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    }),
    style: api.style(),
  };
};

const downloadData = (data) => {
  return data;
};

export {
  downloadData, showBulkTraj, showMigrateCompare,
};
