import { listPersonByIds } from 'services/person';
import * as profileUtils from 'utils/profile-utils';
import { sysconfig } from 'systems';
import {
  ifAllInCache,
  dataCache,
  imageCache,
  indexCache,
} from './cache-utils.js';



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
  let width = 180;
  const height = 180;
  const imgwidth = 45;
  if (ids.length === 2) {
    width = imgwidth;
  }

  let ostyle = '';
  //两者的偏移计算不同
  if (type === 'baidu') { //baidu map
    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition()); // 中心点的位置
    ostyle = `height:${height}px;width:${width}px;left: ${pixel.x - (width / 2)}px;top: ${pixel.y - (height / 2)}px;`;
  } else { //google map
    const imgWidth = parseInt(maindom.style.height,10);
    ostyle = `height:${height}px;width:${height}px;left: ${(e.x + imgWidth / 2) - (width / 2)}px;top: ${(e.y + imgWidth / 2) - (height / 2)}px;`;
  }

  // 可得中心点到图像中心点的半径为：height/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=height/2
  const oDiv = document.createElement('div');
  oDiv.setAttribute('id', 'panel');
  oDiv.setAttribute('style', ostyle);
  oDiv.setAttribute('class', 'roundImgContainer');
  insertAfter(oDiv, maindom);
  const thisNode = getById('panel');

  // 开始显示图片,按照hindex排序
  const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
  for (let i = 0; i < ids.length; i += 1) { //从12点方向开始
    const centerX = (Math.cos((fenshu * i) - (Math.PI / 2)) * ((height / 2) - (imgwidth / 2)))
      + (height / 2);
    const centerY = (Math.sin((fenshu * i) - (Math.PI / 2)) * ((height / 2) - (imgwidth / 2)))
      + (height / 2);
    const imgdiv = document.createElement('div');
    let cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
    if (ids.length === 2) {
      cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:0px;top:${centerY - (imgwidth / 2)}px;`;
    }
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
  const top = (height / 2) - (wh / 2);
  const imgdiv = document.createElement('div');
  const cstyle = `opacity:0;height:${wh}px;width:${wh}px;left:${left}px;top:${top}px;`;
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
    thisNode.addEventListener('mouseleave', () => {
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
  let flag = false;
  if (personInfo) {
    if ((sysconfig.Locale === 'zh') && personInfo.name_zh) {
      let str = personInfo.name_zh.replace(/(^\s*)|(\s*$)/g, '');
      flag = true;
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
    if (name.length <= 5 && !flag) {
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
    if (!flag) {
      name = `&nbsp;&nbsp;${name}`;
    }
    style = 'background-color:transparent;font-family:monospace;text-align: center;line-height:10px;word-break:break-all;white-space:pre-wrap;word-wrap:break-word;font-size:10px;';
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
};

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


module.exports = {
  getById, insertAfter, resetRightInfoToGlobal,
  onResetPersonCard, detachCluster,
  showTopImageDiv, toggleRightInfo, showTopImages,
  addImageListener, syncInfoWindow, waitforBMap, waitforBMapLib,
  MapFilterRanges, MapFilterHindexRange,
  findMapFilterRangesByKey, findMapFilterHindexRangesByKey,
};

