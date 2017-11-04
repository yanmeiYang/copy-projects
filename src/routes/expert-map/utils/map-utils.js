import continentscountries from 'public/lab/expert-map/continentscountries.json';
import {
  ifAllInCache,
  dataCache,
  imageCache
} from './cache-utils.js';

const findPosition = (type, results) => {
  let place = [null, null];
  if (type === '0') {
    place = [results.location.lat, results.location.lng];
  } else if (type === '1') {
    const continent = findcontinent(results.country.name);
    if (continent === 'Asia') { // 以中国（成都）返回,先经度，后纬度
      place = [31.0051649, 103.6075308];
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
    place = findhuaweidistrict(results, place); // 按照华为的进行分区，此处的代码若非华为产品则可以删掉，其他的均可保持不变
  } else if (type === '2') {
    place = findcountries(results.country.name);
  } else if (type === '3') {
    place = findcountries(results.country.name);
    place = findarea(results, place);// 按照国内的省份，或者美国的按照州
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
  if (add.indexOf('Michigan') > -1 || add.indexOf('Indiana') > -1 || add.indexOf('Ohio') > -1 || add.indexOf('Kentucky') > -1 || add.indexOf('Georgia') > -1 || add.indexOf('New York') > -1 || add.indexOf('Pennsylvania') > -1 || add.indexOf('West Virginia') > -1 || add.indexOf('Virginia') > -1 || add.indexOf('North Carolina') > -1 || add.indexOf('South Carolina') > -1 || add.indexOf('Florida') > -1 || add.indexOf('Washington') > -1 || add.indexOf('New Jersey') > -1 || add.indexOf('Connecticut') > -1 || add.indexOf('Rhode island') > -1 || add.indexOf('Massachusetts') > -1 || add.indexOf('New Hampshire') > -1 || add.indexOf('Vermont') > -1 || add.indexOf('Maine') > -1 || add.indexOf('Maryland') > -1 || add.indexOf('Delaware') > -1) {
    place1 = [38.9071923, -77.0368707];// 以华盛顿特区返回
  }
  if (add.indexOf('North Dakota') > -1 || add.indexOf('South Dakota') > -1 || add.indexOf('Nebraska') > -1 || add.indexOf('Kansas') > -1 || add.indexOf('Oklahoma') > -1 || add.indexOf('Texas') > -1 || add.indexOf('Minnesota') > -1 || add.indexOf('Iowa') > -1 || add.indexOf('Missouri') > -1 || add.indexOf('Arkansas') > -1 || add.indexOf('Louisiana') > -1 || add.indexOf('Wisconsin') > -1 || add.indexOf('Illinois') > -1 || add.indexOf('Tennessee') > -1 || add.indexOf('Mississippi') > -1 || add.indexOf('Alabama') > -1) {
    place1 = [39.8027644, -105.0874842];// 以Jefferson返回
  }
  if (add.indexOf('Montana') > -1 || add.indexOf('Wyoming') > -1 || add.indexOf('Idaho') > -1 || add.indexOf('Utah') > -1 || add.indexOf('Colorado') > -1 || add.indexOf('Arizona') > -1 || add.indexOf('New Mexico') > -1 || add.indexOf('Washington') > -1 || add.indexOf('Oregon') > -1 || add.indexOf('Nevada') > -1 || add.indexOf('California') > -1) {
    place1 = [38.4087993, -121.3716178];// 以Sacramento返回
  }
  if (add.indexOf('Hawaii') > -1) {
    place1 = [21.2910781, -157.8200175];// 以Honolulu返回
  }
  if (add.indexOf('Alaska') > -1) {
    place1 = [61.2180556, -149.9002778];// 以Anchorage返回
  }
  return place1;
};

// TODO change to use switch.
const findhuaweidistrict = (results, place) => {
  let place1 = place;
  if (results.country.name === 'Kazakhstan' || results.country.name === 'Kyrgyzstan' || results.country.name === 'Uzbekistan' || results.country.name === 'Tajikistan' || results.country.name === 'Turkmenistan') { // 中亚
    place1 = [48.019573, 66.923684];// 以哈萨克斯坦返回
  } else if (results.country.name === 'Vietnam' || results.country.name === 'Laos' || results.country.name === 'Cambodia' || results.country.name === 'Thailand' || results.country.name === 'Malaysia' || results.country.name === 'Myanmar' || results.country.name === 'Indonesia' || results.country.name === 'Brunei' || results.country.name === 'Philippines' || results.country.name === 'Timor-Leste') { // 东南亚
    place1 = [12.879721, 121.774017];// 以印度尼西亚返回
  } else if (results.country.name === 'India') { // 印度
    place1 = [20.593684, 78.96288];// 以印度返回
  } else if (results.country.name === 'Singapore') { // 新加坡
    place1 = [1.352083, 103.819836];// 以新加坡返回
  } else if (results.country.name === 'Japan') { // 日本
    place1 = [36.204824, 138.252924];// 以日本返回
  } else if (results.country.name === 'South Korea') { // 韩国
    place1 = [35.907757, 127.766922];// 以韩国返回
  } else if (results.country.name === 'China' && results.location.area === 'Hong Kong') { // 香港
    place1 = [22.396428, 114.109497];// 以香港返回
  } else if (results.country.name === 'China' && results.location.area === 'Taiwan') { // 台湾
    place1 = [25.0329694, 121.5654177];// 以台北返回
  } else if (results.country.name === 'China' && results.location.area !== 'Taiwan' && results.location.area !== 'Hong Kong') { // 中国
    place1 = [39.90419989999999, 116.4073963];// 以北京返回
  } else if (results.country.name === 'Estonia' || results.country.name === 'Latvia' || results.country.name === 'Lithuania' || results.country.name === 'Belarus' || results.country.name === 'Ukraine' || results.country.name === 'Moldova' || results.country.name === 'Serbia' || results.country.name === 'Croatia' || results.country.name === 'Slovenia' || results.country.name === 'Bosnia and Herzegovina' || results.country.name === 'Montenegro' || results.country.name === 'Macedonia' || results.country.name === 'Albania') { // 东欧
    place1 = [48.379433, 31.16558];// 以乌克兰返回
  } else if (results.country.name === '') { // 西欧
    // 西欧部分按照原来的德国去分
  } else if (results.country.name === 'Iceland' || results.country.name === 'Denmark' || results.country.name === 'Finland' || results.country.name === 'Norway' || results.country.name === 'Sweden') { // 北欧
    place1 = [60.12816100000001, 18.643501];// 以瑞典返回
  } else if (results.country.name === 'United Kingdom') { // 英国
    place1 = [55.378051, -3.435973];// 以英国返回
  } else if (results.country.name === 'Russia') { // 俄国
    place1 = [61.52401, 105.318756];// 以俄罗斯返回
  } else if (results.country.name === 'Israel') { // 以色列
    place1 = [31.046051, 34.851612];// 以以色列返回
  } else if (results.country.name === 'United States') { // 美国
    place1 = finduspart(results.longaddress);
  }
  return place1;
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
  if (flag) {
    // console.log(country+"**********");
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
        success(window.BMap);
      }
    }
  }, interval);
}

function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

function waitforBMapLib(tryTimes, interval, success, failed) {
  let n = 0;
  const mapLibInterval = setInterval(() => {
    if (typeof (BMapLib) === 'undefined') {
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
        success(window.BMapLib);
      }
    }
  }, interval);
}

function showTopImageDiv(e, map, maindom, inputids, onLeave, type, ids, dispatch, infoIds) {
  const ishere = getById('panel');
  if (ishere != null) {
    detachCluster(ishere);
  }
  const width = 180;
  let ostyle = '';
  if (type === 'baidu') { //baidu map
    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition()); // 中心点的位置
    ostyle = `height:${width}px;width:${width}px;left: ${pixel.x - (width / 2)}px;top: ${pixel.y - (width / 2)}px;`;
  } else { //google map
    ostyle = `height:${width}px;width:${width}px;left: ${(e.x + 27) - (width / 2)}px;top: ${(e.y + 27) - (width / 2)}px;`;
  }
  // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
  const imgwidth = 45;
  const oDiv = document.createElement('div');
  oDiv.setAttribute('id', 'panel');
  oDiv.setAttribute('style', ostyle);
  oDiv.setAttribute('class', 'roundImgContainer');
  insertAfter(oDiv, maindom);
  const thisNode = getById('panel');
  // 开始显示图片,按照hindex排序


  const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
  for (let i = 0; i < ids.length; i += 1) { //从12点方向开始
    const centerX = (Math.cos((fenshu * i) - (Math.PI / 2)) * ((width / 2) - (imgwidth / 2)))
      + (width / 2);
    const centerY = (Math.sin((fenshu * i) - (Math.PI / 2)) * ((width / 2) - (imgwidth / 2)))
      + (width / 2);
    const imgdiv = document.createElement('div');
    const cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
    imgdiv.setAttribute('name', 'scholarimg');
    imgdiv.setAttribute('style', cstyle);
    imgdiv.setAttribute('class', 'imgWrapper');
    imgdiv.innerHTML = '';
    //imgdiv.innerHTML = `<img width='${imgwidth}' src='${blankAvatar}' alt='0'>`;
    insertAfter(imgdiv, thisNode);
    thisNode.appendChild(imgdiv);
    imgdiv.addEventListener('click', () => toggleRightInfo('person', ids[i], dispatch, infoIds), false);
  }
  // 再在其中间添加一个图像
  const wh = imgwidth + 40;
  const left = (width / 2) - (wh / 2);
  const imgdiv = document.createElement('div');
  const cstyle = `opacity:0;height:${wh}px;width:${wh}px;left:${left}px;top:${left}px;`;
  imgdiv.setAttribute('name', 'center');// 中心的一个图片
  imgdiv.setAttribute('style', cstyle);
  imgdiv.setAttribute('class', 'imgWrapper');
  thisNode.appendChild(imgdiv);
  imgdiv.addEventListener('click', (event) => { // 集体的一个显示
    toggleRightInfo('cluster', inputids, dispatch, infoIds);
    event.stopPropagation();
  });

  if (thisNode != null) { // 准备绑定事件
    const pthisNode = thisNode.parentNode;
    pthisNode.addEventListener('mouseleave', () => {
      if (onLeave) {
        onLeave();
      }
      detachCluster(thisNode);
    });
  }
}

function showTopImages(ids, i, imgwidth, blankAvatar, imgdivs) {
  const cimg = imgdivs[i];
  let personInfo = dataCache[ids[i]];  //需要缓存的地方
  //personInfo = personInfo && model.personInfo;// 没有缓存的时候
  let name;
  //console.log(personInfo);
  if (personInfo) {
    if (personInfo.name_zh) {
      const str = personInfo.name_zh.substr(1, 2);
      name = str;
    } else {
      const tmp = personInfo.name.split(' ', 5);
      name = (tmp[tmp.length - 1] === '') ? personInfo.name : tmp[tmp.length - 1];
    }
  } else {
    const tmp = personInfo.name.split(' ', 5);
    name = (tmp[tmp.length - 1] === '') ? personInfo.name : tmp[tmp.length - 1];
  }

  let style;
  if (name.length <= 8) {
    style = 'background-color:transparent;font-family:monospace;text-align: center;line-height:45px;font-size:10px;';
    if (name.length === 6) {
      name = ' '.concat(name);
    }
    if (name.length <= 5) {
      name = '&nbsp;'.concat(name);
    }
  } else {
    const nameArr = name.split('', 20);
    let u = 7;
    const arr = [];
    nameArr.map((name1) => {
      if (u !== 7) {
        if (u < 13) {
          arr[u + 1] = name1;
        } else if (u === 13) {
          arr[u + 1] = ' ';
          arr[u + 2] = name1;
        } else {
          arr[u + 2] = name1;
        }
      } else {
        arr[u] = ' ';
        arr[u + 1] = name1;
      }
      u += 1;
      return true;
    });
    name = arr.join('');
    name = `&nbsp;&nbsp;${name}`;
    style = 'background-color:transparent;font-family:monospace;text-align: center;line-height:10px;word-wrap:break-word;font-size:10px;';
  }
  //需要缓存的地方,判断是否存在
  const img = imageCache[ids[i]];//浅拷贝和深拷贝
  const image = new Image(); //进行深拷贝
  if (typeof (img) === 'undefined') {
    image.src = blankAvatar;
    image.alt = name;
    image.width = imgwidth;
  } else {
    image.src = img.src;
    image.name = img.name;
    image.alt = name;
    image.width = imgwidth;
    image.style = style;
  }
  if (img.src.includes('default.jpg') || img.src.includes('blank_avatar.jpg')) {
    cimg.innerHTML = `<img id='${personInfo.id}' style='${style}' data='@@@@@@@${i}@@@@@@@' width='${imgwidth}' src='' alt='${name}'>`;
  } else {
    cimg.appendChild(image);
  }
}

function addImageListener(map, ids, getInfoWindow, event, imgwidth, type, projection, infowindow) {
  // get current point.
  const apos = getById('allmap').getBoundingClientRect();
  const cpos = event.target.getBoundingClientRect();
  if (type === 'baidu') {
    const newPixel = new window.BMap.Pixel(cpos.left - apos.left + imgwidth, cpos.top - apos.top);
    const currentPoint = map.pixelToPoint(newPixel);
    const infoWindow = getInfoWindow(); //信息窗口
    //this.onSetPersonCard(personInfo); //查询数据，不需要了
    map.openInfoWindow(infoWindow, currentPoint); //打开窗口
  } else {
    const newPixel = new window.google.maps.Point((cpos.left - apos.left) + imgwidth,
      (cpos.top - apos.top),
    ); // 这里是地图里面的相对位置
    const currentLatLng = projection.fromContainerPixelToLatLng(newPixel);
    infowindow.setPosition(currentLatLng);
    //map.openInfoWindow(infoWindow, currentPoint); //打开窗口
    infowindow.open(map);
  }
  const chtml = event.target.innerHTML;
  let num = 0;
  let personInfo;
  if (chtml.split('@@@@@@@').length > 1) { //当时想到这种办法也挺不容易的，保留着吧，注意一个是id一个是序号
    personInfo = dataCache[ids[chtml.split('@@@@@@@')[1]]];  //需要缓存的地方
  } else {
    if (event.target.tagName.toUpperCase() === 'DIV') {
      num = event.target.firstChild.name;
    } else if (event.target.tagName.toUpperCase() === 'IMG') {
      num = event.target.name;
    }
    personInfo = dataCache[num];  //需要缓存的地方
  }
  return personInfo.id;
}

function toggleRightInfo(type, id, dispatch, infoIds) { // update one person's info.
  if (infoIds !== id) { // don't change
    if (id.indexOf(',') >= 0) { // is cluster
      const clusterIdList = id.split(',');
      const clusterInfo = ifAllInCache(clusterIdList);
      console.log(clusterInfo);
      if (clusterInfo.length !== 0) { //如果全部缓存了的话就从缓存里面取数据，然后存到model里面
        console.log(clusterIdList);
        dispatch({
          type: 'expertMap/setClusterInfo',
          payload: { data: clusterInfo },
        });
      } else {
        console.log('@@@@@@!!!!!!!!!!');
        dispatch({
          type: 'expertMap/listPersonByIds',
          payload: { ids: clusterIdList },
        });
      }
    }
    dispatch({
      type: 'expertMap/setRightInfo',
      payload: { idString: id, rightInfoType: type },
    });
  }
}

function detachCluster(clusterPanel) {
  if (clusterPanel != null && clusterPanel.parentNode != null) {
    const imgdivs = document.getElementsByName('scholarimg');
    for (let i = 0; i < imgdivs.length;) {
      imgdivs[i].parentNode.removeChild(imgdivs[i]);
    }
    clusterPanel.parentNode.removeChild(clusterPanel);
  }
}

// 将内容同步到地图中的控件上。
const syncInfoWindow = () => {
  const ai = getById('author_info');
  const pi = getById('personInfo');
  if (ai && pi) {
    ai.innerHTML = pi.innerHTML;
  }
};

// -----------------------------------
const resetRightInfoToGlobal = (dispatch) => {
  dispatch({
    type: 'expertMap/setRightInfo',
    payload: { idString: '', rightInfoType: 'global' },
  });
};

const onResetPersonCard = (dispatch) => {
  dispatch({ type: 'expertMap/resetPersonInfo' });
};

const MapFilterRanges = [
  { key: 'all', label: 'ALL' },
  { key: 'acm', label: 'ACM Fellow' },
  { key: 'ieee', label: 'IEEE Fellow' },
  { key: 'chinese', label: 'Chinese' },
];

const MapFilterHindexRange = [
  { key: 'all', label: 'ALL', boundary: 200 },
  { key: 'top500', label: 'TOP500', boundary: 500 },
  { key: 'top200', label: 'TOP200', boundary: 200 },
  { key: 'top100', label: 'TOP100', boundary: 100 },
  { key: 'top50', label: 'TOP50', boundary: 50 },
];

const findMapFilterRangesByKey = (key) => {
  for (const config of MapFilterRanges) {
    if (config && config.key === key) {
      return config;
    }
  }
};

const findMapFilterHindexRangesByKey = (key) => {
  for (const config of MapFilterHindexRange) {
    if (config && config.key === key) {
      return config;
    }
  }
};

const bigAreaConfig = [
  { label: '中国', x: 102, y: 38 },
  { label: '日本', x: 136, y: 32 },
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
  { label: '东部', x: -79.5, y: 34 },
  { label: '中部', x: -107.5, y: 34.5 },
];


module.exports = {
  findPosition, getById, waitforBMap, waitforBMapLib,
  insertAfter, resetRightInfoToGlobal,
  onResetPersonCard, detachCluster,
  showTopImageDiv, toggleRightInfo, showTopImages,
  addImageListener, syncInfoWindow,
  bigAreaConfig,
  MapFilterRanges, MapFilterHindexRange,
  findMapFilterRangesByKey, findMapFilterHindexRangesByKey,
};

