
const showSta = (echarts, divId, data) => {
  const result = sortByCountries(data);
  const countries = [];
  const value = [];
  for (const key in result.countries) {
    countries.push(key);
    value.push(result.countries[key]);
  }
  console.log(result);
  console.log(countries);
  console.log(value);
  const myChart = echarts.init(divId);

  // 绘制图表
  const option = {
    title: {
      text: '按国家进行统计',
      subtext: '主要学者情况',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['总人数'],
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, 0.01],
        width: '20px',
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: countries,
      },
    ],
    series: [{
        name: '总人数',
        type: 'bar',
        data: value,
      },
    ],
  };
  myChart.setOption(option);
};

const sortByCountries = (data) => {
  const countries = [];
  for (const p of data.results) {
    if (typeof (countries[p.country.name]) !== 'undefined') {
      countries[p.country.name] += 1;
    } else {
      countries[p.country.name] = 1;
    }
  }
  return { countries };
};

module.exports = {
  showSta,
};
