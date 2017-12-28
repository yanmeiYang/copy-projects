import { loadECharts } from 'utils/requirejs';
import bridge from 'utils/next-bridge';
import { randomColor } from './func-utils';

let myEChart;

const showBulkTraj = (data, type) => {
  loadECharts((echarts) => {
    myEChart = echarts;
  });
  if (typeof (data.staData) === 'undefined') {
    document.getElementById(type).innerHTML = 'No Data!';
  } else {
    let option;
    if (type === 'timeDistribution') {
      option = showTimeDistribution(data);
    } else if (type === 'hotAreas') {
      option = showHotAreas(data);
    }
    const myChart = myEChart.init(document.getElementById(type));
    myChart.setOption(option);
  }
};

const showHotAreas = (data) => {
  const { cities } = data.staData;
  const fromTo = [];
  for (const p in data.staData.personTrajData) {
    if (p) {
      for (const u in data.staData.personTrajData[p]) {
        if (u) {
          const { pCityId, cCityId } = data.staData.personTrajData[p][u];
          let fromCountry = '';
          let toCountry = '';

          if (!(cCityId in cities) || !(pCityId in cities)) {
            continue;
          }

          let cNationId = cCityId;
          while (typeof (cities[cNationId].parent_id) !== 'undefined') {
            cNationId = cities[cNationId].parent_id;
          }
          toCountry = cities[cNationId].name;

          let pNationId = pCityId;
          while (typeof (cities[pNationId].parent_id) !== 'undefined') {
            pNationId = cities[pNationId].parent_id;
          }
          fromCountry = cities[pNationId].name;

          const p2p = `From ${fromCountry} to ${toCountry}`;
          if (!(p2p in fromTo)) {
            fromTo[p2p] = 0;
          }
          fromTo[p2p] += 1;
        }
      }
    }
  }
  const places = [];
  const numbers = [];
  let all = [];
  for (const p in fromTo) {
    if (p) {
      all.push({ value: fromTo[p], name: p });
    }
  }
  all.sort((a, b) => b.value - a.value);
  all = all.slice(0, 20);
  for (const a of all) {
    numbers.push(a);
    places.push(a.name);
  }

  const option = {
    title: {
      text: 'Top 20 Hot-Area Trajectories',
      subtext: 'From Aminer',
      sublink: 'https://www.aminer.cn/',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      padding: [80, 80, 0, 0],
      data: places,
    },
    series: [
      {
        name: 'Hot Areas',
        type: 'pie',
        radius: ['0', '60%'],
        center: ['65%', '35%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: numbers,
      },
    ],
  };
   return option;
};

const showTimeDistribution = (data) => {
  const [start, end] = data.startEnd;
  const years = [];
  const numbers = [];
  for (let y = start; y <= end; y += 1) {
    years.push(y);
    if (y in data.yearLineData) {
      numbers.push(data.yearLineData[y].length);
    } else {
      numbers.push(0);
    }
  }

  const option = {
    title: {
      text: 'Trajectory For Each Year',
      subtext: 'From Aminer',
      sublink: 'https://www.aminer.cn/',
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      x: '150px',
    },
    legend: {
      data: ['Number of people'],
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
        data: years,
      },
    ],
    series: [{
      name: 'Number of people',
      type: 'bar',
      data: numbers,
      itemStyle: {
        normal: {
          color: '#3e9bc9',
        },
      },
    },
    ],
  };
  return option;
};


const downloadData = (data) => {
  let info = '';
  const personInfo = data.personsInfo;
  const { cities, addresses } = data.staData;
  for (const p in data.staData.personTrajData) {
    if (p) {
      let pInfo = '';
      const persons = bridge.toNextPersons([personInfo[p]]);
      const person = persons[0];
      pInfo += 'Expert Trajectory Infomation:\n';
      pInfo += `name:,${person.name},\n affiliation:,${person.profile.affiliation},\n position:,${person.profile.position},\n link:,http://aminer.cn/profile/${person.id},\n`;
      pInfo += 'Expert Trajectory History:\n';
      let trajInfo = 'Year,From Place,From City,From Country,To Place,To City,To Country\n';
      for (const u in data.staData.personTrajData[p]) {
        if (u) {
          const { year, pCityId, cCityId, pPlaceId, cPlaceId } = data.staData.personTrajData[p][u];
          let pPlace = '';
          let pCity = '';
          let pCountry = '';
          let cPlace = '';
          let cCity = '';
          let cCountry = '';
          if (!(pCityId in cities) || !(cCityId in cities)) {
            continue;
          }
          if (!(pPlaceId in addresses) || !(cPlaceId in addresses)) {
            continue;
          }
          pPlace = addresses[pPlaceId].name.replace(new RegExp(/,/g), '，');
          cPlace = addresses[cPlaceId].name.replace(new RegExp(/,/g), '，');
          pCity = cities[pCityId].name.replace(new RegExp(/,/g), '，');
          cCity = cities[cCityId].name.replace(new RegExp(/,/g), '，');

          let cNationId = cCityId;
          while (typeof (cities[cNationId].parent_id) !== 'undefined') {
            cNationId = cities[cNationId].parent_id;
          }
          cCountry = cities[cNationId].name.replace(new RegExp(/,/g), '，');

          let pNationId = pCityId;
          while (typeof (cities[pNationId].parent_id) !== 'undefined') {
            pNationId = cities[pNationId].parent_id;
          }
          pCountry = cities[pNationId].name.replace(new RegExp(/,/g), '，');

          trajInfo += `${year},${pPlace},${pCity},${pCountry},${cPlace},${cCity},${cCountry}\n`;
        }
      }
      trajInfo += '\n\n\n\n';
      info += pInfo + trajInfo;
    }
  }
  return info;
};

module.exports = {
  downloadData, showBulkTraj,
};
