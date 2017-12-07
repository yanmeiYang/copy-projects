
const showPersonStatistic = (echarts, divId, data, type) => {
  console.log(data);
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

module.exports = {
  showPersonStatistic,
};
