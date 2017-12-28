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
      option = '';
    } else if (type === 'migrateHistory') {
      option = '';
    } else if (type === 'migrateCompare') {
      option = showMigrateCompare(data);
    }
    const myChart = myEChart.init(document.getElementById(type));
    myChart.setOption(option);
  }
};

const showMigrateCompare = (data) => {

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
          console.log(`${year},${pPlace},${pCity},${pCountry},${cPlace},${cCity},${cCountry}\n`);
        }
      }
      trajInfo += '\n\n\n\n';
      info += pInfo + trajInfo;
    }
  }
  return info;
};

module.exports = {
  downloadData, showBulkTraj, showMigrateCompare,
};
