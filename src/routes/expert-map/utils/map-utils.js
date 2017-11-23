import continentscountries from 'public/lab/expert-map/continentscountries.json';
import { listPersonByIds } from 'services/person';
import * as profileUtils from 'utils/profile-utils';
import {
  ifAllInCache,
  dataCache,
  imageCache,
  indexCache,
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

function getById(id) {
  return document.getElementById(id);
}

function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

const showTopImageDiv = (e, map, maindom, inputids, onLeave, type, ids, dispatch, infoIds, callback) => {
  const ishere = getById('panel');
  if (ishere != null) {
    detachCluster(ishere); //先删除已经存在的
  }
  const width = 180;
  let ostyle = '';
  //两者的偏移计算不同
  if (type === 'baidu') { //baidu map
    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition()); // 中心点的位置
    ostyle = `height:${width}px;width:${width}px;left: ${pixel.x - (width / 2)}px;top: ${pixel.y - (width / 2)}px;`;
  } else { //google map
    const imgWidth = parseInt(maindom.style.height,10);
    ostyle = `height:${width}px;width:${width}px;left: ${(e.x + imgWidth / 2) - (width / 2)}px;top: ${(e.y + imgWidth / 2) - (width / 2)}px;`;
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
    imgdiv.setAttribute('data-id', ids[i]);
    imgdiv.innerHTML = '';
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
      detachCluster(thisNode); //删除创建的node
    });
  }
  if (typeof (callback) === 'function') {
    callback();
  }
};

const ifNotImgShowName = (personInfo) => { //当作者的头像是空的时候，显示名字
  let name;
  if (personInfo) {
    // if (personInfo.name_zh) {
    //   const str = personInfo.name_zh.substr(1, 2);
    //   name = str;
    // } else {
      const tmp = personInfo.name.split(' ', 5);
      name = (tmp[tmp.length - 1] === '') ? personInfo.name : tmp[tmp.length - 1];
    // }
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
  return { name, style };
};

const showImagesInDiv = (ids, imgwidth, blankAvatar, imgdivs) => {
  for (let i = 0; i < ids.length; i += 1) {
    const cimg = imgdivs[i];
    const personInfo = dataCache[ids[i]]; //确保数据都是缓存了的
    const showinfo = ifNotImgShowName(personInfo);
    //需要缓存的地方,判断是否存在
    const image = new Image(); //进行深拷贝
    if (typeof (imageCache[ids[i]]) === 'undefined') { //如果没有就先写入缓存
      const url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 90);
      const image2 = new Image();
      image2.src = url;
      image2.name = personInfo.id;//不能使用id,否则重复
      image2.width = 90;
      image2.onerror = () => {
        image2.src = blankAvatar;
      };
      imageCache[personInfo.id] = image2;
    }
    const img = imageCache[ids[i]];//浅拷贝和深拷贝
    image.src = img.src;
    image.name = img.name;
    image.alt = showinfo.name;
    image.width = imgwidth;
    image.style = showinfo.style;

    if (cimg !== 'undefined' && typeof (cimg) !== 'undefined') {
      if (img.src.includes('default.jpg') || img.src.includes('blank_avatar.jpg')) {
        cimg.innerHTML = `<img id='${personInfo.id}' style='${showinfo.style}' data='@@@@@@@${i}@@@@@@@' width='${imgwidth}' src='' alt='${showinfo.name}'>`;
      } else {
        cimg.innerHTML = '';
        cimg.appendChild(image);
      }
    }
  }
};

function showTopImages(ids, imgwidth, blankAvatar, imgdivs) {
  const topEight = ifAllInCache(ids);
  if (topEight.length === 0) { //有没有缓存的
    const resultPromise = listPersonByIds(ids);
    resultPromise.then(
      (data) => {
        //加入到缓存中
        for (let i = 0; i < ids.length; i += 1) {
          indexCache.push(ids[i]);
        }
        for (const p of data.data.persons) {
          dataCache[p.id] = p;
        }
        showImagesInDiv(ids, imgwidth, blankAvatar, imgdivs);
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });
  } else { //全部都缓存了
    showImagesInDiv(ids, imgwidth, blankAvatar, imgdivs);
  }
}

const addImageListener = (map, ids, getInfoWindow, event, imgwidth, type, projection, infowindow, callback) => {
  // get current point.
  const apos = getById('allmap').getBoundingClientRect();
  const cpos = event.target.getBoundingClientRect();
  if (type === 'baidu') {
    const newPixel = new window.BMap.Pixel(
      ((cpos.left - apos.left) + imgwidth),
      (cpos.top - apos.top),
    );
    const currentPoint = map.pixelToPoint(newPixel);
    const infoWindow = getInfoWindow(); //信息窗口
    map.openInfoWindow(infoWindow, currentPoint); //打开窗口
  } else {
    const newPixel = new window.google.maps.Point(
      ((cpos.left - apos.left) + imgwidth),
      (cpos.top - apos.top),
    ); // 这里是地图里面的相对位置
    const currentLatLng = projection.fromContainerPixelToLatLng(newPixel);
    infowindow.setPosition(currentLatLng);
    infowindow.open(map);
  }
  const chtml = event.target.innerHTML;
  let num = 0;
  let personInfo;
  if (chtml.split('@@@@@@@').length > 1) { //当时想到这种办法也挺不容易的，保留着吧，注意一个是id一个是序号
    personInfo = dataCache[ids[chtml.split('@@@@@@@')[1]]];
  } else {
    if (event.target.tagName.toUpperCase() === 'DIV') {
      if (event.target.firstChild) { //图片还没有加载出来的时候
        num = event.target.firstChild.name;
      } else {
        num = event.target.getAttribute('data-id');
      }
    } else if (event.target.tagName.toUpperCase() === 'IMG') {
      num = event.target.name;
    }
    personInfo = dataCache[num];
  }
  if (typeof (personInfo) === 'undefined' || personInfo === 'undefined') {
    const resultPromise = listPersonByIds(ids);
    resultPromise.then(
      (data) => { //加入到缓存中
        for (let i = 0; i < ids.length; i += 1) {
          indexCache.push(ids[i]);
        }
        for (const p of data.data.persons) {
          dataCache[p.id] = p;
        }
        personInfo = dataCache[num];
        if (typeof (callback) === 'function' && personInfo) {
          callback(personInfo);
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });
  } else if (typeof (callback) === 'function') {
      callback(personInfo);
  }
};

function toggleRightInfo(type, id, dispatch, infoIds) { // update one person's info.
  if (infoIds !== id) { // don't change
    if (id.indexOf(',') >= 0) { // is cluster
      const clusterIdList = id.split(',');
      const clusterInfo = ifAllInCache(clusterIdList);
      if (clusterInfo.length !== 0) { //如果全部缓存了的话就从缓存里面取数据，然后存到model里面
        dispatch({
          type: 'expertMap/setClusterInfo',
          payload: { data: clusterInfo },
        });
      } else {
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
  findPosition, getById,
  insertAfter, resetRightInfoToGlobal,
  onResetPersonCard, detachCluster,
  showTopImageDiv, toggleRightInfo, showTopImages,
  addImageListener, syncInfoWindow, findhuaweidistrict,
  bigAreaConfig,
  MapFilterRanges, MapFilterHindexRange,
  findMapFilterRangesByKey, findMapFilterHindexRangesByKey,
};

