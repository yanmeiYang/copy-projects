import continentscountries from 'public/lab/expert-map/continentscountries.json';

const findPosition = (type, results) => {
  let place = [null, null];
  if (type === '0') {
    place = [results.location.lat, results.location.lng];
  } else if (type === '1') {
    const continent = findcontinent(results.country.name);
    if (continent === 'Asia') { // 以巴基斯坦返回,先经度，后纬度
      place = [33, 73];
    } else if (continent === 'Europe') { // 以德国返回
      place = [48.7468939, 9.0805141];
    } else if (continent === 'Africa') { // 以中非返回
      place = [6.611110999999999, 20.939444];
    } else if (continent === 'North American') { // 以加拿大返回
      place = [60.09024, -105.712891];
    } else if (continent === 'South American') { // 以巴西返回
      place = [4.570868, -74.297333];
    } else if (continent === 'Oceania') { // 以澳大利亚返回
      place = [-25.274398, 133.775136];
    }
    const res = findhuaweidistrict(results, place); // 按照华为的进行分区，此处的代码若非华为产品则可以删掉，其他的均可保持不变
    place = res.place1;
  } else if (type === '2') {
    place = findcountries(results.country.name);
  } else if (type === '3') {
    place = findcountries(results.country.name);
    place = findarea(results, place);// 按照国hua内的省份，或者美国的按照州
  } else if (type === '4') {
    place = findCities(results.city);
  } else if (type === '5') {
    place = [results.location.lat, results.location.lng];
  }
  return place;
};


const findarea = (results, place) => {
  let place1 = place;
  const [country, area] = [results.country.name, results.location.area];
  if (country === 'China') {
    switch (area) {
      case 'Beijing':
      case 'Tianjin':
      case 'Hebei':
      case 'Shanxi':
      case 'Mongolia':
        place1 = [39.90419989999999, 116.4073963];// 以北京返回
        break;
      case 'Liaoning':
      case 'Jilin':
      case 'Heilongjiang':
        place1 = [41.672126, 123.333494];// 以沈阳返回
        break;
      case 'Shanghai':
      case 'Jiangsu':
      case 'Zhejiang':
      case 'Anhui':
      case 'Fujian':
      case 'Jiangxi':
      case 'Shandong':
        place1 = [31.2303904, 121.4737021];// 以上海返回
        break;
      case 'Guangdong':
      case 'Guangxi':
      case 'Hainan':
        place1 = [23.12911, 113.264385];// 以广州返回
        break;
      case 'Henan':
      case 'Hubei':
      case 'Hunan':
        place1 = [30.592849, 114.305539];// 以武汉返回
        break;
      case 'Chongqing':
      case 'Sichuan':
      case 'Guizhou':
      case 'Yunan':
      case 'Tibet':
        place1 = [30.572815, 104.066801];// 以成都返回
        break;
      case 'Shaanxi':
      case 'Qinghai':
      case 'Ningxia':
      case 'Xinjiang':
      case '':
        place1 = [36.061089, 103.834303];// 以兰州返回
        break;
      case 'Hong Kong':
      case 'Macao':
      case 'Taiwan':
        place1 = [25.0329694, 121.5654177];// 以台北
        break;// 返回
      default:
    }
  } else if (country === 'United States') {
    switch (area) {
      case 'Michigan':
      case 'Indiana':
      case 'Ohio':
      case 'Kentucky':
      case 'Georgia':
      case 'New York':
      case 'Pennsylvania':
      case 'West Virginia':
      case 'Virginia':
      case 'North Carolina':
      case 'South Carolina':
      case 'Florida':
      case 'Washington':
      case 'New Jersey':
      case 'Connecticut':
      case 'Rhode island':
      case 'Massachusetts':
      case 'New Hampshire':
      case 'Vermont':
      case 'Maine':
      case 'Maryland':
      case 'Delaware':
        place1 = [38.9071923, -77.0368707];// 以华盛顿特区返回
        break;
      case 'North Dakota':
      case 'South Dakota':
      case 'Nebraska':
      case 'Kansas':
      case 'Oklahoma':
      case 'Texas':
      case 'Minnesota':
      case 'Iowa':
      case 'Missouri':
      case 'Arkansas':
      case 'Louisiana':
      case 'Wisconsin':
      case 'Illinois':
      case 'Tennessee':
      case 'Mississippi':
      case 'Alabama':
        place1 = [39.8027644, -105.0874842];// 以Jefferson返回
        break;
      case 'Montana':
      case 'Wyoming':
      case 'Idaho':
      case 'Utah':
      case 'Colorado':
      case 'Arizona':
      case 'New Mexico':
      case 'Oregon':
      case 'Nevada':
      case 'California':
        place1 = [38.4087993, -121.3716178];// 以Sacramento返回
        break;
      case 'Hawaii':
        place1 = [21.2910781, -157.8200175];// 以Honolulu返回
        break;
      case 'Alaska':
        place1 = [61.2180556, -149.9002778];// 以Anchorage返回
        break;
      default:
    }
  }
  return place1;
};

const finduspart = (add) => {
  let place1 = [38.9071923, -77.0368707];
  let name;
  if (add.indexOf('Michigan') > -1 || add.indexOf('Indiana') > -1 || add.indexOf('Ohio') > -1 || add.indexOf('Kentucky') > -1 || add.indexOf('Georgia') > -1 || add.indexOf('New York') > -1 || add.indexOf('Pennsylvania') > -1 || add.indexOf('West Virginia') > -1 || add.indexOf('Virginia') > -1 || add.indexOf('North Carolina') > -1 || add.indexOf('South Carolina') > -1 || add.indexOf('Florida') > -1 || add.indexOf('Washington') > -1 || add.indexOf('New Jersey') > -1 || add.indexOf('Connecticut') > -1 || add.indexOf('Rhode island') > -1 || add.indexOf('Massachusetts') > -1 || add.indexOf('New Hampshire') > -1 || add.indexOf('Vermont') > -1 || add.indexOf('Maine') > -1 || add.indexOf('Maryland') > -1 || add.indexOf('Delaware') > -1) {
    place1 = [38.9071923, -77.0368707];// 以华盛顿特区返回
    name = 'Eastern United States';
  }
  if (add.indexOf('North Dakota') > -1 || add.indexOf('South Dakota') > -1 || add.indexOf('Nebraska') > -1 || add.indexOf('Kansas') > -1 || add.indexOf('Oklahoma') > -1 || add.indexOf('Texas') > -1 || add.indexOf('Minnesota') > -1 || add.indexOf('Iowa') > -1 || add.indexOf('Missouri') > -1 || add.indexOf('Arkansas') > -1 || add.indexOf('Louisiana') > -1 || add.indexOf('Wisconsin') > -1 || add.indexOf('Illinois') > -1 || add.indexOf('Tennessee') > -1 || add.indexOf('Mississippi') > -1 || add.indexOf('Alabama') > -1) {
    place1 = [39.8027644, -105.0874842];// 以Jefferson返回
    name = 'Central United States';
  }
  if (add.indexOf('Montana') > -1 || add.indexOf('Wyoming') > -1 || add.indexOf('Idaho') > -1 || add.indexOf('Utah') > -1 || add.indexOf('Colorado') > -1 || add.indexOf('Arizona') > -1 || add.indexOf('New Mexico') > -1 || add.indexOf('Washington') > -1 || add.indexOf('Oregon') > -1 || add.indexOf('Nevada') > -1 || add.indexOf('California') > -1) {
    place1 = [38.4087993, -121.3716178];// 以Sacramento返回
    name = 'Western United States';
  }
  if (add.indexOf('Hawaii') > -1) {
    place1 = [21.2910781, -157.8200175];// 以Honolulu返回
    name = 'Central United States';
  }
  if (add.indexOf('Alaska') > -1) {
    place1 = [61.2180556, -149.9002778];// 以Anchorage返回
    name = 'Central United States';
  }
  return { place1, name };
};

// TODO change to use switch.
const findhuaweidistrict = (results, place) => {
  let place1 = place;
  let name = 'Others';
  if (results.country.name === 'Kazakhstan' || results.country.name === 'Kyrgyzstan' || results.country.name === 'Uzbekistan' || results.country.name === 'Tajikistan' || results.country.name === 'Turkmenistan') { // 中亚
    place1 = [48.019573, 66.923684];// 以哈萨克斯坦返回
    name = 'Central Asia';
  } else if (results.country.name === 'Vietnam' || results.country.name === 'Laos' || results.country.name === 'Cambodia' || results.country.name === 'Thailand' || results.country.name === 'Malaysia' || results.country.name === 'Myanmar' || results.country.name === 'Indonesia' || results.country.name === 'Brunei' || results.country.name === 'Philippines' || results.country.name === 'Timor-Leste') { // 东南亚
    place1 = [12.879721, 121.774017];// 以印度尼西亚返回
    name = 'Southeast Asia';
  } else if (results.country.name === 'India') { // 印度
    place1 = [20.593684, 78.96288];// 以印度返回
    name = 'India';
  } else if (results.country.name === 'Singapore') { // 新加坡
    place1 = [1.352083, 103.819836];// 以新加坡返回
    name = 'Singapore';
  } else if (results.country.name === 'Japan') { // 日本
    place1 = [36.204824, 138.252924];// 以日本返回
    name = 'Japan';
  } else if (results.country.name === 'South Korea') { // 韩国
    place1 = [35.907757, 127.766922];// 以韩国返回
    name = 'The Republic of Korea';
  } else if (results.country.name === 'China' && results.location.area === 'Hong Kong') { // 香港
    place1 = [22.396428, 114.109497];// 以香港返回
    name = 'Hong Kong';
  } else if (results.country.name === 'China' && results.location.area === 'Taiwan') { // 台湾
    place1 = [25.0329694, 121.5654177];// 以台北返回
    name = 'Taiwan';
  } else if (results.country.name === 'China' && results.location.area !== 'Taiwan' && results.location.area !== 'Hong Kong') { // 中国
    place1 = [39.90419989999999, 116.4073963];// 以北京返回
    name = 'Chinese Mainland';
  } else if (results.country.name === 'Estonia' || results.country.name === 'Latvia' || results.country.name === 'Lithuania' || results.country.name === 'Belarus' || results.country.name === 'Ukraine' || results.country.name === 'Moldova' || results.country.name === 'Serbia' || results.country.name === 'Croatia' || results.country.name === 'Slovenia' || results.country.name === 'Bosnia and Herzegovina' || results.country.name === 'Montenegro' || results.country.name === 'Macedonia' || results.country.name === 'Albania') { // 东欧
    place1 = [48.379433, 31.16558];// 以乌克兰返回
    name = 'Eastern Europe';
  } else if (results.country.name === 'Andorra' || results.country.name === 'Armenia' || results.country.name === 'Austria' || results.country.name === 'Azerbaijan' || results.country.name === 'Belgium' || results.country.name === 'Bosnia and Herzegovina' || results.country.name === 'Bulgaria' || results.country.name === 'Cyprus' || results.country.name === 'Czechia' || results.country.name === 'Czech Republic' || results.country.name === 'France' || results.country.name === 'Germany' || results.country.name === 'Greece' || results.country.name === 'Hungary' || results.country.name === 'Ireland' || results.country.name === 'Italy' || results.country.name === 'Liechtenstein' || results.country.name === 'Luxembourg' || results.country.name === 'Macedonia (FYROM)' || results.country.name === 'Malta' || results.country.name === 'Monaco' || results.country.name === 'Netherlands' || results.country.name === 'Poland' || results.country.name === 'Portugal' || results.country.name === 'Romania' || results.country.name === 'San Marino' || results.country.name === 'Slovakia' || results.country.name === 'Spain' || results.country.name === 'Switzerland' || results.country.name === 'Turkey' || results.country.name === 'Vatican City (Holy See)') { // 西欧
    place1 = [51.165691, 10.451526];// 以德国返回
    name = 'Western Europe';
  } else if (results.country.name === 'Iceland' || results.country.name === 'Denmark' || results.country.name === 'Finland' || results.country.name === 'Norway' || results.country.name === 'Sweden') { // 北欧
    place1 = [60.12816100000001, 18.643501];// 以瑞典返回
    name = 'Northern Europe';
  } else if (results.country.name === 'United Kingdom') { // 英国
    place1 = [55.378051, -3.435973];// 以英国返回
    name = 'United Kingdom';
  } else if (results.country.name === 'Russia') { // 俄国
    place1 = [61.52401, 105.318756];// 以俄罗斯返回
    name = 'Russia';
  } else if (results.country.name === 'Israel') { // 以色列
    place1 = [31.046051, 34.851612];// 以色列返回
    name = 'Israel';
  } else if (results.country.name === 'United States') { // 美国
    const res = finduspart(results.longaddress);
    [place1, name] = [res.place1, res.name];
  } else {
    name = 'Others';
  }
  return { place1, name };
};

const findcontinent = (country) => {
  let flag = true;
  let continent = 'North American';
  for (const o in continentscountries.results) {
    if (continentscountries.results[o].country.indexOf(country) === 0) {
      [flag, continent] = [false, continentscountries.results[o].continent];
      break;
    } else if (continentscountries.results[o].country.indexOf(country) > 0) {
      [flag, continent] = [false, continentscountries.results[o].continent];
      break;
    }
  }
  return continent;
};

const findcountries = (country) => {
  let flag = true;
  let location = [];
  for (const o in continentscountries.results) {
    if (continentscountries.results[o].country.indexOf(country) === 0) {
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
  const thisplace = city.geo;
  location = [thisplace.lat, thisplace.lng];
  return location;
};

const bigAreaConfig = [
  { label: '中国', x: 114, y: 34 },
  { label: '日本', x: 136, y: 32 },
  { label: '亚洲其他', x: 71, y: 31 },
  { label: '韩国', x: 125, y: 33 },
  { label: '印度', x: 76.5, y: 16 },
  { label: '香港', x: 114, y: 22 },
  { label: '新加坡', x: 100, y: -3 },
  { label: '台湾', x: 121, y: 25 },
  { label: '中亚', x: 64, y: 48 },
  { label: '东南亚', x: 118.5, y: 9 },
  { label: '东欧', x: 29, y: 45 },
  { label: '西欧', x: 7, y: 44 },
  { label: '北欧', x: 16, y: 58 },
  { label: '英国', x: -6.1, y: 52 },
  { label: '俄罗斯', x: 101.5, y: 59.2 },
  { label: '以色列', x: 31, y: 28 },
  { label: '大洋洲', x: 130, y: -31 },
  { label: '拉丁美洲', x: -60, y: -10 },
  { label: '加拿大', x: -108.5, y: 56.5 },
  { label: '美国西部', x: -126, y: 33.5 },
  { label: '美国东部', x: -79.5, y: 34 },
  { label: '美国中部', x: -107.5, y: 34.5 },
];

export {
  findPosition, findhuaweidistrict, bigAreaConfig,
};
