/**
 *
 */
// TODO remove these files.
import continentscountries from '../../../../external-docs/expert-map/continentscountries.json';
import cities from '../../../../external-docs/expert-map/cities.json';

const findPosition = (type, results) => {
  let place = [null, null];
  if (type == 0) {
    place = [results.location.lat, results.location.lng];
  } else if (type == 1) {
    const continent = findcontinent(results.location.country);
    if (continent == 'Asia') { // 以中国（成都）返回,先经度，后纬度
      place = [31.0051649, 103.6075308];
    } else if (continent == 'Europe') { // 以德国返回
      place = [48.7468939, 9.0805141];
    } else if (continent == 'Africa') { // 以中非返回
      place = [6.611110999999999, 20.939444];
    } else if (continent == 'North American') { // 以美国返回
      place = [37.09024, -95.712891];
    } else if (continent == 'South American') { // 以巴西返回
      place = [4.570868, -74.297333];
    } else if (continent == 'Oceania') { // 以澳大利亚返回
      place = [-25.274398, 133.775136];
    }
    place = findhuaweidistrict(results, place); // 按照华为的进行分区，此处的代码若非华为产品则可以删掉，其他的均可保持不变
  } else if (type == 2) {
    place = findcountries(results.location.country);
  } else if (type == 3) {
    place = findcountries(results.location.country);
    place = findarea(results, place);// 按照国内的省份，或者美国的按照州
  } else if (type == 4) {
    place = findCities(results.location.city);
  } else if (type == 5) {
    place = [results.location.lat, results.location.lng];
  }
  return place;
}

const findarea = (results, place) => {
  const country = results.location.country;
  if (country == 'China') {
    if (results.location.area == 'Beijing' || results.location.area == 'Tianjin' || results.location.area == 'Hebei' || results.location.area == 'Shanxi' || results.location.area == 'Mongolia') {
      place = [39.90419989999999, 116.4073963];// 以北京返回
    }
    if (results.location.area == 'Liaoning' || results.location.area == 'Jilin' || results.location.area == 'Heilongjiang') {
      place = [41.672126, 123.333494];// 以沈阳返回
    }
    if (results.location.area == 'Shanghai' || results.location.area == 'Jiangsu' || results.location.area == 'Zhejiang' || results.location.area == 'Anhui' || results.location.area == 'Fujian' || results.location.area == 'Jiangxi' || results.location.area == 'Shandong') {
      place = [31.2303904, 121.4737021];// 以上海返回
    }
    if (results.location.area == 'Guangdong' || results.location.area == 'Guangxi' || results.location.area == 'Hainan') {
      place = [23.12911, 113.264385];// 以广州返回
    }
    if (results.location.area == 'Henan' || results.location.area == 'Hubei' || results.location.area == 'Hunan') {
      place = [30.592849, 114.305539];// 以武汉返回
    }
    if (results.location.area == 'Chongqing' || results.location.area == 'Sichuan' || results.location.area == 'Guizhou' || results.location.area == 'Yunan' || results.location.area == 'Tibet') {
      place = [30.572815, 104.066801];// 以成都返回
    }
    if (results.location.area == 'Shaanxi' || results.location.area == 'Qinghai' || results.location.area == 'Ningxia' || results.location.area == 'Xinjiang' || results.location.area == '') {
      place = [36.061089, 103.834303];// 以兰州返回
    }
    if (results.location.area == 'Hong Kong' || results.location.area == 'Macao' || results.location.area == 'Taiwan') {
      place = [25.0329694, 121.5654177];// 以台北返回
    }
  }
  if (country == 'United States') {
    if (results.location.area == 'Michigan' || results.location.area == 'Indiana' || results.location.area == 'Ohio' || results.location.area == 'Kentucky' || results.location.area == 'Georgia' || results.location.area == 'New York' || results.location.area == 'Pennsylvania' || results.location.area == 'West Virginia' || results.location.area == 'Virginia' || results.location.area == 'North Carolina' || results.location.area == 'South Carolina' || results.location.area == 'Florida' || results.location.area == 'Washington' || results.location.area == 'New Jersey' || results.location.area == 'Connecticut' || results.location.area == 'Rhode island' || results.location.area == 'Massachusetts' || results.location.area == 'New Hampshire' || results.location.area == 'Vermont' || results.location.area == 'Maine' || results.location.area == 'Maryland' || results.location.area == 'Delaware') {
      place = [38.9071923, -77.0368707];// 以华盛顿特区返回
    }
    if (results.location.area == 'North Dakota' || results.location.area == 'South Dakota' || results.location.area == 'Nebraska' || results.location.area == 'Kansas' || results.location.area == 'Oklahoma' || results.location.area == 'Texas' || results.location.area == 'Minnesota' || results.location.area == 'Iowa' || results.location.area == 'Missouri' || results.location.area == 'Arkansas' || results.location.area == 'Louisiana' || results.location.area == 'Wisconsin' || results.location.area == 'Illinois' || results.location.area == 'Tennessee' || results.location.area == 'Mississippi' || results.location.area == 'Alabama') {
      place = [39.8027644, -105.0874842];// 以Jefferson返回
    }
    if (results.location.area == 'Montana' || results.location.area == 'Wyoming' || results.location.area == 'Idaho' || results.location.area == 'Utah' || results.location.area == 'Colorado' || results.location.area == 'Arizona' || results.location.area == 'New Mexico' || results.location.area == 'Washington' || results.location.area == 'Oregon' || results.location.area == 'Nevada' || results.location.area == 'California') {
      place = [38.4087993, -121.3716178];// 以Sacramento返回
    }
    if (results.location.area == 'Hawaii') {
      place = [21.2910781, -157.8200175];// 以Honolulu返回
    }
    if (results.location.area == 'Alaska') {
      place = [61.2180556, -149.9002778];// 以Anchorage返回
    }
  }
  return place;
}

const findhuaweidistrict = (results, place) => {
  if (results.location.country == 'Kazakhstan' || results.location.country == 'Kyrgyzstan' || results.location.country == 'Uzbekistan' || results.location.country == 'Tajikistan' || results.location.country == 'Turkmenistan') { // 中亚
    place = [48.019573, 66.923684];// 以哈萨克斯坦返回
  } else if (results.location.country == 'Vietnam' || results.location.country == 'Laos' || results.location.country == 'Cambodia' || results.location.country == 'Thailand' || results.location.country == 'Malaysia' || results.location.country == 'Myanmar' || results.location.country == 'Indonesia' || results.location.country == 'Brunei' || results.location.country == 'Philippines' || results.location.country == 'Timor-Leste') { // 东南亚
    place = [12.879721, 121.774017];// 以印度尼西亚返回
  } else if (results.location.country == 'India') { // 印度
    place = [20.593684, 78.96288];// 以印度返回
  } else if (results.location.country == 'Singapore') { // 新加坡
    place = [1.352083, 103.819836];// 以新加坡返回
  } else if (results.location.country == 'Japan') { // 日本
    place = [36.204824, 138.252924];// 以日本返回
  } else if (results.location.country == 'South Korea') { // 韩国
    place = [35.907757, 127.766922];// 以韩国返回
  } else if (results.location.country == 'China' && results.location.area == 'Hong Kong') { // 香港
    place = [22.396428, 114.109497];// 以香港返回
  } else if (results.location.country == 'China' && results.location.area == 'Taiwan') { // 台湾
    place = [25.0329694, 121.5654177];// 以台北返回
  } else if (results.location.country == 'China' && results.location.area != 'Taiwan' && results.location.area != 'Hong Kong') { // 中国
    place = [39.90419989999999, 116.4073963];// 以北京返回
  } else if (results.location.country == 'Estonia' || results.location.country == 'Latvia' || results.location.country == 'Lithuania' || results.location.country == 'Belarus' || results.location.country == 'Ukraine' || results.location.country == 'Moldova' || results.location.country == 'Serbia' || results.location.country == 'Croatia' || results.location.country == 'Slovenia' || results.location.country == 'Bosnia and Herzegovina' || results.location.country == 'Montenegro' || results.location.country == 'Macedonia' || results.location.country == 'Albania') { // 东欧
    place = [48.379433, 31.16558];// 以乌克兰返回
  } else if (results.location.country == '') { // 西欧
    // 西欧部分按照原来的德国去分
  } else if (results.location.country == 'Iceland' || results.location.country == 'Denmark' || results.location.country == 'Finland' || results.location.country == 'Norway' || results.location.country == 'Sweden') { // 北欧
    place = [60.12816100000001, 18.643501];// 以瑞典返回
  } else if (results.location.country == 'United Kingdom') { // 英国
    place = [55.378051, -3.435973];// 以英国返回
  } else if (results.location.country == 'Russia') { // 俄国
    place = [61.52401, 105.318756];// 以俄罗斯返回
  }
  return place;
}

const findcontinent = (country) => {
  let flag = true;
  let continent = 'North American';
  for (const o in continentscountries.results) {
    if (continentscountries.results[o].country.indexOf(country) == 0) {
      // console.log(place.results[o].country+"####"+country+"&&&&"+place.results[o].continent);
      flag = false;
      continent = continentscountries.results[o].continent;
      break;
    } else if (continentscountries.results[o].country.indexOf(country) > 0) {
      flag = false;
      continent = continentscountries.results[o].continent;
      break;
    }
  }
  if (flag) {
    // console.log(country+"**********");
  }
  return continent;
};

const findcountries = (country) => {
  let flag = true;
  let location = [];
  for (const o in continentscountries.results) {
    if (continentscountries.results[o].country.indexOf(country) == 0) {
      flag = false;
      location = [continentscountries.results[o].lat, continentscountries.results[o].lng];
      break;
    } else if (continentscountries.results[o].country.indexOf(country) > 0) {
      flag = false;
      location = [continentscountries.results[o].lat, continentscountries.results[o].lng];
      break;
    }
  }
  if (flag) {
    // /
  }
  return location;
};

const findCities = (city) => {
  let location = [];
  const thisplace = cities.results[city].geometry.location;
  location = [thisplace.lat, thisplace.lng];
  return location;
}

function getById(id) {
  return document.getElementById(id);
}

function waitforBMap(tryTimes, interval, success, failed) {
  let n = 0;
  const mapInterval = setInterval(() => {
    if (typeof (BMap) === 'undefined') {
      // console.log('wait for BMap');
      n += 1;
      if (n >= tryTimes) {
        clearInterval(mapInterval);
        if (failed) {
          failed();
        }
      }
    } else {
      clearInterval(mapInterval);
      if (success) {
        success(BMap);
      }
    }
  }, interval);
}

function waitforBMapLib(tryTimes, interval, success, failed) {
  let n = 0;
  const mapLibInterval = setInterval(() => {
    if (typeof (BMapLib) === 'undefined') {
      // console.log('wait for BMapLib');
      n += 1;
      if (n >= tryTimes) {
        clearInterval(mapLibInterval);
        if (failed) {
          failed();
        }
      }
    } else {
      clearInterval(mapLibInterval);
      if (success) {
        success(BMapLib);
      }
    }
  }, interval);
}

module.exports = {
  findPosition, getById, waitforBMap, waitforBMapLib,
}

