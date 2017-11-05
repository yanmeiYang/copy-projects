import {
  findhuaweidistrict,
} from './map-utils.js';


const showSta = (echarts, divId, data, type) => {
  let title = '';
  let result = [];
  if (type === 'country') {
    title = '按国家进行统计';
    result = sortByCountries(data);
  } else if (type === 'bigArea') {
    title = '按大区进行统计';
    result = sortByBigArea(data);
  }
  const names = [];
  const values = [];
  for (const key in result.countries) {
    if (true) {
      names.push(key);
      values.push(result.countries[key]);
    }
  }
  const myChart = echarts.init(divId);

  // 绘制图表
  const option = {
    title: {
      text: title,
      subtext: '主要学者情况',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      x: '150px',
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
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: names,
      },
    ],
    series: [{
        name: '总人数',
        type: 'bar',
        data: values,
      },
    ],
  };
  myChart.setOption(option);
};

const sortByBigArea = (data) => {
  const areas = [];
  const place = [];
  for (const p of data.results) {
    const res = findhuaweidistrict(p, [p.location.lat, p.location.lng]);
    if (res.name === 'undefined' || typeof (res.name) === 'undefined') {
      place.push('Others');
    } else {
      place.push(res.name);
    }
  }

  for (const p of place) {
    if (typeof (areas[p]) !== 'undefined') {
      areas[p] += 1;
    } else {
      areas[p] = 1;
    }
  }
  return { countries: areas };
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
