import { loadECharts } from 'utils/requirejs';

const showPersonStatistic = (echarts, divId, data, type) => {
  if (typeof (data.staData) === 'undefined') {
    document.getElementById(type).innerHTML = 'No Data!';
  } else {
    let option;
    if (type === 'timeDistribution') {
      option = timeDistributionSta(data);
    } else {
      option = migrateHistorySta(data);
    }
    const myChart = echarts.init(document.getElementById(type));
    myChart.setOption(option);
  }
};

const timeDistributionSta = (data) => {
  const allPlacesData = []; //所有的地区，包括国家和地区字符串数组
  const nationData = []; //每一个对象为：{value:335, name:'直达', selected:true},
  const cityData = []; //每一个对象为：{value:335, name:'直达'},
  const cityNationYear = [];
  for (const key in data.cityIn) { //这里的key就是cityId
    if (key) {
      const cityName = data.staData.cities[key].name;
      cityData.push({ value: data.cityIn[key].symbolSize, name: cityName });
      let nationId = key;
      while (typeof (data.staData.cities[nationId].parent_id) !== 'undefined') {
        nationId = data.staData.cities[nationId].parent_id;
      }
      if (data.staData.cities[nationId].id in cityNationYear) {
        const d = cityNationYear[data.staData.cities[nationId].id];
        d.value += data.cityIn[key].symbolSize;
      } else {
        cityNationYear[data.staData.cities[nationId].id] = {
          value: data.cityIn[key].symbolSize,
          name: data.staData.cities[nationId].name,
        };
      }
    }
  }
  for (const key in cityNationYear) {
    if (key) {
      nationData.push(cityNationYear[key]);
      allPlacesData.push(cityNationYear[key].name);
    }
  }
  for (const c of cityData) {
    allPlacesData.push(c.name);
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: allPlacesData,
    },
    series: [
      {
        name: '所在地址',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          normal: {
            position: 'inner',
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: nationData,
      },
      {
        name: '所在地址',
        type: 'pie',
        radius: ['40%', '55%'],
        label: {
          normal: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            // shadowBlur:3,
            // shadowOffsetX: 2,
            // shadowOffsetY: 2,
            // shadowColor: '#999',
            // padding: [0, 7],
            rich: {
              a: {
                color: '#999',
                lineHeight: 22,
                align: 'center',
              },
              // abg: {
              //     backgroundColor: '#333',
              //     width: '100%',
              //     align: 'right',
              //     height: 22,
              //     borderRadius: [4, 4, 0, 0]
              // },
              hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0,
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
              },
              per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2,
              },
            },
          },
        },
        data: cityData,
      },
    ],
  };
  return option;
};

const migrateHistorySta = (data) => {
  const startYears = [];
  const stayYears = [];
  const names = [];
  let begin = 3000;
  let finish = 0;

  for (const t of data.staData.timeToTime) {
    if (t.start < begin) {
      begin = t.start;
    }
    if (t.end > finish) {
      finish = t.end;
    }
    names.push(t.name);
    startYears.push(t.start);
    const year = (t.end - t.start) === 0 ? 1 : (t.end - t.start);
    stayYears.push(year);
  }
  const option = {
    title: {
      text: '学者迁徙历史',
      subtext: 'From Aminer',
      sublink: 'https://www.aminer.cn/',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: (params) => {
        const tar = params[1];
        return `${tar.name}<br/>${tar.seriesName}： ${tar.value}年`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      splitLine: { show: true },
      data: names,
    },
    yAxis: {
      type: 'value',
      min: begin,
      max: finish,
    },
    series: [
      {
        name: '辅助',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
        },
        data: startYears, //开始的值
      },
      {
        name: '所呆总时间',
        type: 'bar',
        stack: '总量',
        itemStyle: {
          normal: {
            color: '#3e9bc9',
          },
        },
        label: {
          normal: {
            show: true,
            position: 'inside',
          },
        },
        data: stayYears, //总值
      },
    ],
  };
  return option;
};

const showBulkTraj = (divId, data1, type) => {
  loadECharts((echarts) => {
    if (myChart !== null && myChart !== '' && myChart !== undefined) {
      myChart.dispose();
    }
    const myChart = echarts.init(document.getElementById(type));
    const data = [];
    const dataCount = 10;
    //const startTime = +new Date();
    const startYear = 2000;
    const categories = ['categoryA', 'categoryB', 'categoryC']; //
    var getRandomColor = function(){ //随机生成颜色
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
    echarts.util.each(categories, (category, index) => {
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

    function renderItem(params, api) {
      //console.log(params);
      //console.log(api);
      const categoryIndex = api.value(0);
      const start = api.coord([api.value(1), categoryIndex]);
      const end = api.coord([api.value(2), categoryIndex]);
      const height = api.size([0, 1])[1] * 0.6;

      return {
        type: 'rect',
        shape: echarts.graphic.clipRectByRect({ //输入一组点，和一个矩形，返回被矩形截取过的点
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
    }


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
        min: startYear,
        scale: true,
        axisLabel: {
          formatter: (val) => {
            return `${Math.max(0, val)} 年`;
          },
        },
      },
      yAxis: {
        data: categories,
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
        data,
      }],
    };
    myChart.setOption(option);
  });
};

const downloadData = (data) => {
  let all;
  const title = 'time, city name, nation\n';
  all = title;
  console.log(data);
  for (const t of data.staData.timeToTime) {
    const { cityId } = t;
    console.log(cityId);
    let nationId = cityId;
    while (typeof (data.staData.cities[nationId].parent_id) !== 'undefined') {
      nationId = data.staData.cities[nationId].parent_id;
    }
    const country = data.staData.cities[nationId].name;
    all += `${t.start},${t.name},${country}\n`;
  }
  console.log(all);
  return all;
};

module.exports = {
  showPersonStatistic, downloadData, showBulkTraj,
};
