/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import { sysconfig } from 'systems';
import styles from './expert-googlemap.less';

import { Spinner } from 'components';
import { compare } from 'utils';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile-utils';
import GetGoogleMapLib from './utils/googleMapGai.js';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZoneAll from './RightInfoZoneAll';
import {
  findPosition,
  getById,
  insertAfter,
  waitforBMap,
  waitforBMapLib,
  findMapFilterRangesByKey,
  findMapFilterHindexRangesByKey,
  bigAreaConfig,
} from './utils/map-utils';

let map1;
const dataMap = {};
const blankAvatar = '/images/blank_avatar.jpg';

/**
 * -------------------------------------------------------------------
 */
@connect(({ expertMap, loading }) => ({ expertMap, loading }))
export default class ExpertGoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.cache = {};
    this.cacheData = {};//缓存作者数据
    this.cacheImg = {};//缓存作者图像
    this.showOverLay = GetGoogleMapLib(this.showTop);
  }

  state = {
    loadingFlag: false,
    cperson: '', //当前显示的作者的id
  };

  componentDidMount() {
    const pro = this.props;
    this.showgooglemap(pro.expertMap.geoData, pro.type, pro.range, pro.hindexRange);
  }

  componentWillReceiveProps(np) {
    if (np.expertMap.geoData !== this.props.expertMap.geoData) {
      this.showgooglemap(np.expertMap.geoData, np.type, np.range, np.hindexRange);
    }
    if (compare(np, this.props, 'range', 'hindexRange', 'type')) {
      this.showgooglemap(np.expertMap.geoData, np.type, np.range, np.hindexRange);
    }
    return true;
  }

  componentDidUpdate() {
    this.syncInfoWindow();
  }

  onSetPersonCard = (personInfo) => {
    this.props.dispatch({
      type: 'expertMap/getPersonInfoSuccess',
      payload: { data: { data: personInfo } },
    });
  };

  onLoadPersonCard = (personId) => {
    this.props.dispatch({ type: 'expertMap/getPersonInfo', payload: { personId } });
  };

  onResetPersonCard = () => {
    this.props.dispatch({ type: 'expertMap/resetPersonInfo' });
  };

  getRightInfoBox = () => {
    let riz = getById('flowInfo');
    if (!riz) {
      riz = document.createElement('div');
      riz.setAttribute('id', 'flowInfo');
      riz.setAttribute('class', 'rightInfoZone');
      getById('map').appendChild(riz);
      riz.onmouseenter = () => this.map.disableScrollWheelZoom();
      riz.onmouseleave = () => this.map.enableScrollWheelZoom();
    }
    return riz;
  };

  getTipInfoBox = () => {
    let riz1 = getById('rank');
    if (!riz1) {
      riz1 = document.createElement('div');
      getById('map').appendChild(riz1);
      riz1.setAttribute('id', 'flowinfo1');
      riz1.setAttribute('class', 'imgWrapper1');
      return riz1;
    }
  };

  addMouseoverHandler = (map, marker, personId) => {
    const that = this;
    const infoWindow = new window.google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>",
    });
    window.google.maps.event.addListener(marker, 'mouseover', () => {
      if (that.currentPersonId !== personId) {
        that.onResetPersonCard();
        //that.onLoadPersonCard(personId);
        infoWindow.open(map, marker);
        //that.syncInfoWindow();
        this.setState({ cperson: personId }, this.syncInfoWindow());//回调函数里面改写
      } else {
        infoWindow.open(map, marker);
        that.syncInfoWindow();
      }
      //使用中等大小的图标，将图片拷贝过去，和cluster中的一样,一定注意其逻辑顺序啊！
      const id = `M${personId}`;
      const divId = `Mid${personId}`;
      let img = this.cacheImg[id];
      const image = new Image(); //进行深拷贝
      if (typeof (img) === 'undefined') {
        img = this.cacheImg[personId];
        img.width = 90;
      }
      image.src = img.src;
      image.name = img.name;
      image.width = img.width;

      document.getElementById(divId).appendChild(image);
      that.currentPersonId = personId;
    });

    window.google.maps.event.addListener(marker, 'mouseout', () => {
      infoWindow.close(map, marker);
    });

    window.google.maps.event.addListener(marker, 'click', () => {
      that.toggleRightInfo('person', personId);
    });
  };

  syncInfoWindow = () => {
    const ai = getById('author_info');
    const pi = getById('personInfo');
    if (ai && pi) {
      ai.innerHTML = pi.innerHTML;
    }
  };

  mapConfig = {
    0: { scale: 5, minscale: 1, maxscale: 16 },
    1: { scale: 4, minscale: 4, maxscale: 5 },
    2: { scale: 4, minscale: 4, maxscale: 5 },
    3: { scale: 4, minscale: 4, maxscale: 5 },
    4: { scale: 7, minscale: 5, maxscale: 7 },
    5: { scale: 7, minscale: 5, maxscale: 7 },
  };

  showgooglemap = (place, type, range, hindexRange) => {
    this.showLoading();
    let counter = 0;
    const that = this;
    const filterRange = range || 'all';
    const mapType = type || '0';

    that.showOverLay();
    const mapinterval = setInterval(() => {
      if (typeof (window.google) === 'undefined') {
        console.log('wait for Google');
        counter += 1;
        if (counter > 200) {
          clearInterval(mapinterval);
          that.hideLoading();
          document.getElementById('allmap').innerHTML = 'Cannot connect to Google Map! Please check the network state!';
        }
      } else {
        clearInterval(mapinterval);



        // let mapCenter = {
        //   lat: sysconfig.CentralPosition.lat,
        //   lng: sysconfig.CentralPosition.lng,
        // };
        // let scale = 3;
        // let minscale = 1;
        // let maxscale = 19;
        // let newtype;
        // if (localStorage.getItem('lastgoogletype') !== '0' && localStorage.getItem('isgoogleClick') === '0') {
        //   newtype = localStorage.getItem('lastgoogletype');
        // } else {
        //   newtype = type;
        // }
        // if (newtype === '0') {
        //   scale = 3;
        //   minscale = 3;
        // } else if (newtype === '1' || newtype === '2' || newtype === '3') {
        //   scale = 3;
        //   minscale = 3;
        //   maxscale = 4;
        // } else if (newtype === '4' || newtype === '5') {
        //   scale = 6;
        //   minscale = 6;
        //   maxscale = 7;
        // }
        // if (map1) {
        //   mapCenter = map1.getCenter();
        // }
        // localStorage.setItem('lastgoogletype', newtype);
        // const map = new window.google.maps.Map(document.getElementById('allmap'), {
        //   center: mapCenter,
        //   zoom: scale,
        //   gestureHandling: 'greedy',
        //   minZoom: minscale,
        //   maxZoom: maxscale,
        // });
        //
        // this.map = map; // set to global;
        // map1 = this.map;
        // const locations = [];
        // const newTypeString = String(newtype);
        // let newPlaceResults = [];
        // const range = '0';
        // console.log(place);
        // if (range === '0') {
        //   newPlaceResults = place.results;
        // } else if (range === '1') {
        //   place.results.map((placeResult) => {
        //     if (placeResult.fellows[0] && placeResult.fellows[0] === 'acm') {
        //       newPlaceResults.push(placeResult);
        //     }
        //     return true;
        //   });
        // } else if (range === '2') {
        //   place.results.map((placeResult) => {
        //     if (placeResult.fellows[0] === 'ieee' || placeResult.fellows[1] === 'ieee') {
        //       newPlaceResults.push(placeResult);
        //     }
        //     return true;
        //   });
        // } else if (range === '3') {
        //   place.results.map((placeResult) => {
        //     if (placeResult.is_ch) {
        //       newPlaceResults.push(placeResult);
        //     }
        //     return true;
        //   });
        // }

        if (!map1) {
          map1 = new window.google.maps.Map(document.getElementById('allmap'), {
            center: { lat: sysconfig.CentralPosition.lat, lng: sysconfig.CentralPosition.lng },
          });
        }
        const mapCenter = {
          lat: map1 ? map1.getCenter().lat() : sysconfig.CentralPosition.lat,
          lng: map1 ? map1.getCenter().lng() : sysconfig.CentralPosition.lng,
        };
        const conf = this.mapConfig[mapType] || this.mapConfig[0]; //根据地图的类型选择地图的尺寸
        const map = new window.google.maps.Map(document.getElementById('allmap'), {
          center: mapCenter,
          zoom: conf.scale,
          gestureHandling: 'greedy',
          minZoom: conf.minscale,
          maxZoom: conf.maxscale,
        });
        this.map = map; // set to global,以便全局取用
        map1 = this.map; // 地图刷新前，用于存储上次浏览的地点
        place.results.sort((a, b) => b.hindex - a.hindex);
        const locations = [];

        let j = 0;
        const ids = [];
        for (const pr of place.results) {
          ids.push(pr.id);
          dataMap[pr.id] = pr;
          const newplace = findPosition(mapType, pr);
          const onepoint = { lat: newplace[0], lng: newplace[1] };

          if (newplace && newplace[1] && (newplace[1] !== 0 && newplace[1] !== 0)) {
            let include = false;
            switch (filterRange) {
              case 'all':
                include = true;
                break;
              case 'acm':
              case 'ieee':
                include = pr.fellows.indexOf(range) >= 0;
                break;
              case 'chinese':
                include = pr.is_ch;
                break;
              default:
            }
            if (include) { //只有是选定的时候才加入
              locations[j] = onepoint;
              j += 1;
            }
          }
        }
        let markers = locations.map((location, i) => {
          return new window.google.maps.Marker({
            position: location,
            label: {
              text: place.results[i].name,
              color: '#000000',
              fontSize: '12px',
              backgroundColor: 'transparent',
              fontWeight: 'bold',
              fontStyle: 'italic',
            },
            icon: {
              url: '/images/map/marker_blue_sprite.png',
              size: new window.google.maps.Size(20, 70),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(0, 25),
            },
            title: place.results[i].id,
          });
        });

        const number = hindexRange;
        if (number === 'top200') {
          markers = markers.slice(0, 200);
        } else if (number === 'top50') {
          markers = markers.slice(0, 50);
        } else if (number === 'top100') {
          markers = markers.slice(0, 100);
        } else if (number === 'top500') {
          markers = markers.slice(0, 500);
        }
        // const beaches = [
        //   ['东部', 38.9071923, -77.0368707],
        //   ['美国中部', 39.8027644, -105.0874842],
        //   ['西部', 38.4087993, -121.3716178],
        //   ['加拿大', 62, -105.712891],
        //   ['拉丁美洲', 4.570868, -74.297333],
        //   ['大洋洲', -25.274398, 133.775136],
        //   ['以色列', 31.046051, 34.851612],
        //   ['俄罗斯', 63, 105.318756],
        //   ['英国', 57.378051, -3.435973],
        //   ['北欧', 62, 18.643501],
        //   ['中国', 39.90419989999999, 116.4073963],
        //   ['台湾', 25.0329694, 121.5654177],
        //   ['韩国', 35.907757, 127.766922],
        //   ['日本', 36.204824, 138.252924],
        //   ['香港', 22.396428, 114.109497],
        //   ['新加坡', 1.352083, 103.819836],
        //   ['东南亚', 12.879721, 121.774017],
        //   ['中亚', 48.019573, 66.923684],
        //   ['印度', 20.593684, 78.96288],
        //   ['东欧', 48.379433, 31.16558],
        //   ['西欧', 48.7468939, 9.0805141],
        // ];
        // if (localStorage.getItem('googletype') === '1') {
        //   beaches.map((beach) => {
        //     return new window.google.maps.Marker({
        //       position: { lat: beach[1] - 6, lng: beach[2] },
        //       label: {
        //         text: beach[0],
        //         fontSize: '12px',
        //         fontStyle: 'italic',
        //         fontWeight: 'bold'
        //       },
        //       icon: { url: '/images/map/blank.png' },
        //       map,
        //     });
        //   });
        // }

        if (mapType === '1') {
          bigAreaConfig.map((ac) => {
            return new window.google.maps.Marker({
              position: { lat: ac[1] - 6, lng: ac[2] },
              label: {
                text: ac[0],
                fontSize: '12px',
                fontStyle: 'italic',
                fontWeight: 'bold'
              },
              icon: { url: '/images/map/blank.png' },
              map,
            });
          });
        }


        const markerClusterer = new window.googleMap.MarkerClusterer(map, {});
        markerClusterer.addMarkers(markers);
        console.log(markers);
        for (let m = 0; m < markers.length; m += 1) {
          that.addMouseoverHandler(map, markers[m], place.results[m].id);
        }
        //cache imges
        that.cacheInfo(ids);
        that.cacheBiGImage(ids, 90);
        that.cacheBiGImage(ids, 160);
        console.log('cached in!!!yes!');
      }
    }, 100);
  };

  cacheInfo = (ids) => { //缓存基本信息
    const resultPromise = [];
    let count = 0;
    let count1 = 0;
    for (let i = 0; i < ids.length; i += 100) { //可控制cache的数目
      const cids = ids.slice(i, i + 100);
      resultPromise[count] = listPersonByIds(cids);
      count += 1;
    }
    resultPromise.map((r) => {
      r.then((data) => {
        for (const p of data.data.persons) {
          this.cacheData[p.id] = p;
          const url = profileUtils.getAvatar(p.avatar, p.id, 50);
          const img = new Image();
          img.src = url;
          img.name = p.id;//不能使用id,否则重复
          img.onerror = () => {
            img.src = blankAvatar;
          };
          this.cacheImg[p.id] = img;
        }
        count1 += 1;
        if (count === count1) {
          this.setState({ loadingFlag: false });
        }
      });
      return true;
    });
  };

  cacheBiGImage = (ids, width) => {
    let head = ''; //图片名称
    if (width === 90) { //中等大小的图片
      head = 'M';
    } else if (width === 160) { //特别大的图片
      head = 'L';
    }
    for (let i = 0; i < ids.length; i += 100) { //可控制cache的数目
      const cids = ids.slice(i, i + 100);
      const resultPromise = listPersonByIds(cids);
      resultPromise.then(
        (data) => {
          for (const p of data.data.persons) {
            let name = head;
            const url = profileUtils.getAvatar(p.avatar, p.id, width);
            const img = new Image();
            img.src = url;
            img.name = p.id;//不能使用id,否则重复
            name += p.id;
            this.cacheImg[name] = img;
          }
        },
        () => {
          console.log('failed');
        },
      ).catch((error) => {
        console.error(error);
      });
    }
  };

  showLoading = () => {
    this.setState({ loadingFlag: true });
  };

  hideLoading = () => {
    this.setState({ loadingFlag: false });
  };

  configGoogleMap = (map) => {
    map.enableScrollWheelZoom();
    map.addControl(new window.BMap.NavigationControl());
    map.addControl(new window.BMap.ScaleControl());
    map.addControl(new window.BMap.OverviewMapControl());
  };

  detachCluster = (clusterPanel) => {
    if (clusterPanel != null && clusterPanel.parentNode != null) {
      const imgdivs = document.getElementsByName('scholarimg');
      for (let i = 0; i < imgdivs.length;) {
        imgdivs[i].parentNode.removeChild(imgdivs[i]);
      }
      clusterPanel.parentNode.removeChild(clusterPanel);
    }
  };

  showTop = (usersIds, e, map, maindom, inputids, onLeave, projection) => {
    const that = this;
    const ishere = getById('panel');
    if (ishere != null) {
      that.detachCluster(ishere);
    }
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;

    const oDiv = document.createElement('div');
    const ostyle = `height:${width}px;width:${width}px;left: ${(e.x + 27) - (width / 2)}px;top: ${(e.y + 27) - (width / 2)}px;`;
    oDiv.setAttribute('id', 'panel');
    oDiv.setAttribute('style', ostyle);
    oDiv.setAttribute('class', 'roundImgContainer');

    insertAfter(oDiv, maindom);
    const thisNode = getById('panel');
    // 开始显示图片,按照hindex排序
    const usersInfo = [];
    for (const u of usersIds) {
      usersInfo.push(dataMap[u]);
    }
    usersInfo.sort((a, b) => b.hindex - a.hindex);
    const ids = [];
    for (const u of usersInfo.slice(0, 8)) {
      ids.push(u.id);
    }

    const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
    for (let i = 0; i < ids.length; i += 1) {
      const centerX = (Math.cos((fenshu * i) - (Math.PI / 2)) * ((width / 2) - (imgwidth / 2)))
        + (width / 2);
      const centerY = (Math.sin((fenshu * i) - (Math.PI / 2)) * ((width / 2) - (imgwidth / 2)))
        + (width / 2);
      const imgdiv = document.createElement('div');
      const cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
      imgdiv.setAttribute('name', 'scholarimg');
      imgdiv.setAttribute('style', cstyle);
      imgdiv.setAttribute('class', 'imgWrapper');
      //imgdiv.innerHTML = `<img width='${imgwidth}' src='${blankAvatar}' alt='0'>`;
      imgdiv.innerHTML = '';
      insertAfter(imgdiv, thisNode);
      thisNode.appendChild(imgdiv);
      imgdiv.addEventListener('click', () => that.toggleRightInfo('person', ids[i]), false);
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
    window.google.maps.event.addDomListener(imgdiv, 'click', () => { // 集体的一个显示
      that.toggleRightInfo('cluster', inputids);
    });

    if (thisNode != null) { // 准备绑定事件
      const pthisNode = thisNode.parentNode;
      pthisNode.addEventListener('mouseleave', () => {
        if (onLeave) {
          onLeave();
        }
        this.detachCluster(thisNode);
      });
    }

    const infowindow = new window.google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>",
    });
    this.listPersonDone(map, ids, this.cacheData, infowindow, projection);

    /*const resultPromise = listPersonByIds(ids);

    resultPromise.then(
      (data) => {
        const imgdivs = document.getElementsByName('scholarimg');
        if (imgdivs != null && imgdivs.length !== 0) {
          for (let i = 0; i < ids.length; i += 1) {
            const cimg = imgdivs[i];
            const personInfo = data.data.persons[i];
            let url;
            const style = 'line-height:45px;text-align:center;display: block;margin:auto;';
            if (personInfo.avatar != null && personInfo.avatar !== '') {
              url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 41);
            }
            let name;
            if (personInfo.name_zh) {
              const str = personInfo.name_zh.substr(1, 2);
              name = str;
            } else {
              let tmp = personInfo.name.match(/\b(\w)/g);
              if (tmp.length > 3) {
                tmp = tmp[0].concat(tmp[1], tmp[2]);
                name = tmp;
              } else {
                name = tmp.join('');
              }
            }
            cimg.innerHTML = `<img style='${style}' data='@@@@@@@${i}@@@@@@@' width='${imgwidth}' src='${url}' alt='${name}'>`;
          }
          for (let j = 0; j < imgdivs.length; j += 1) {
            const cimg = imgdivs[j];
            window.google.maps.event.addDomListener(cimg, 'mouseenter', (event) => {
              const apos = getById('allmap').getBoundingClientRect();
              const cpos = event.target.getBoundingClientRect();
              const newPixel = new window.google.maps.Point((cpos.left - apos.left) + imgwidth,
                (cpos.top - apos.top - imgwidth)); // 这里是地图里面的相对位置
              const currentLatLng = projection.fromDivPixelToLatLng(newPixel);

              const chtml = event.target.innerHTML;
              let num = 0;
              if (chtml.split('@@@@@@@').length > 1) {
                num = chtml.split('@@@@@@@')[1];
              }
              const personInfo = data.data.persons[num];
              infowindow.setPosition(currentLatLng);
              that.onSetPersonCard(personInfo);
              infowindow.open(map);
              that.syncInfoWindow();
            });
            cimg.addEventListener('mouseleave', () => {
              infowindow.close();
            });
          }
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });*/
  };

  handleScriptLoad() {
    console.log(this);
  }

  toggleRightInfo = (type, id) => {
    // TODO cache it.
    console.log(id);
    console.log(type);
    if (this.props.expertMap.infoZoneIds !== id) { // don't change
      if (id.indexOf(',') >= 0) { // is cluster
        const clusterIdList = id.split(',');
        this.props.dispatch({
          type: 'expertMap/listPersonByIds',
          payload: { ids: clusterIdList },
        });
      }
      this.props.dispatch({
        type: 'expertMap/setRightInfo',
        payload: { idString: id, rightInfoType: type },
      });
    }
  };

  callSearchMap(query) {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

  goto = () => {
    const href = window.location.href;
    window.location.href = href.replace('expert-googlemap', 'expert-map');
  };

  reload = () => {
    const href = window.location.href;
    window.location.href = href;
  };

  listPersonDone = (map, ids, data, infowindow, projection) => {
    const imgwidth = 45;

    const imgdivs = document.getElementsByName('scholarimg');
    if (imgdivs !== null && imgdivs.length !== 0) {
      for (let i = 0; i < ids.length; i += 1) {
        const cimg = imgdivs[i];
        const personInfo = data[ids[i]];
        let name;
        if (typeof (personInfo.name_zh) !== 'undefined') {
          if (personInfo.name_zh) {
            const str = personInfo.name_zh.substr(1, 2);
            name = str;
          } else {
            const tmp = personInfo.name.split(' ', 5);
            name = tmp[tmp.length - 1];
            if (name === '') {
              name = personInfo.name;
            }
          }
        } else {
          const tmp = personInfo.name.split(' ', 5);
          name = tmp[tmp.length - 1];
          if (name === '') {
            name = personInfo.name;
          }
        }

        let style;
        if (name.length <= 8) {
          style = 'background-color:transparent;font-family:monospace;text-align: center;line-height:45px;font-size:20%;';
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
          style = 'background-color:transparent;font-family:monospace;text-align: center;line-height:10px;word-wrap:break-word;font-size:20%;';
        }
        const img = this.cacheImg[ids[i]];//浅拷贝和深拷贝
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

      for (let j = 0; j < imgdivs.length; j += 1) {
        const cimg = imgdivs[j];
        //cimg.addEventListener('mouseenter', (event) => {
        window.google.maps.event.addDomListener(cimg, 'mouseenter', (event) => {
          // get current point.
          const apos = getById('allmap').getBoundingClientRect();
          const cpos = event.target.getBoundingClientRect();
          const newPixel = new window.google.maps.Point((cpos.left - apos.left) + imgwidth,
            (cpos.top - apos.top)); // 这里是地图里面的相对位置
          const currentLatLng = projection.fromContainerPixelToLatLng(newPixel);
          const chtml = event.target.innerHTML;
          let num = 0;
          let personInfo;
          if (chtml.split('@@@@@@@').length > 1) { //当时想到这种办法也挺不容易的，保留着吧，注意一个是id一个是序号
            num = chtml.split('@@@@@@@')[1];
            personInfo = data[ids[num]];
          } else {
            if (event.target.tagName.toUpperCase() === 'DIV') {
              num = event.target.firstChild.name;
            } else if (event.target.tagName.toUpperCase() === 'IMG') {
              num = event.target.name;
            }
            personInfo = data[num];
          }
          //const infoWindow = getInfoWindow(); //信息窗口
          infowindow.setPosition(currentLatLng);
          //map.openInfoWindow(infoWindow, currentPoint); //打开窗口
          infowindow.open(map);
          this.setState({ cperson: personInfo.id }, this.syncInfoWindow());
          //使用中等大小的图标
          const id = `M${personInfo.id}`;
          const divId = `Mid${personInfo.id}`;
          let img = this.cacheImg[id];
          const image = new Image(); //进行深拷贝
          if (typeof (img) === 'undefined') {
            img = this.cacheImg[personInfo.id];
            img.width = 90;
          }
          image.src = img.src;
          image.name = img.name;
          image.width = img.width;

          document.getElementById(divId).appendChild(image);
          this.currentPersonId = personInfo.id;
        });
        cimg.addEventListener('mouseleave', () => {
          infowindow.close();
        });
      }
    }
  };


  render() {
    console.log("@@@@@@@@@@@@@@@@@@");
    const model = this.props && this.props.expertMap;
    const persons = model.geoData.results;
    let checkState = 0;
    let count = 0;
    let isACMFellowNumber = 0;
    let isIeeeFellowNumber = 0;
    let isChNumber = 0;
    let hIndexSum = 0;
    if (persons) {
      persons.map((person1) => {
        hIndexSum += person1.hindex;
        count += 1;
        if (person1.fellows[0] === 'acm') {
          isACMFellowNumber += 1;
        }
        if (person1.fellows[0] === 'ieee' || person1.fellows[1] === 'ieee') {
          isIeeeFellowNumber += 1;
        }
        if (person1.is_ch) {
          isChNumber += 1;
        }
        return hIndexSum;
      });
    }
    const avg = (hIndexSum / count).toFixed(0);
    let personPopupJsx;
    //const person = model.personInfo;
    const person = this.cacheData[this.state.cperson];
    if (person) {
      // const url = profileUtils.getAvatar(person.avatar, person.id, 90);
      // const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      // const pos = profileUtils.displayPosition(person.pos);
      // const aff = profileUtils.displayAff(person);
      // const hindex = person && person.indices && person.indices.h_index;
      const divId = `Mid${person.id}`;
      const name = person.name;
      const pos = person && person.pos && person.pos[0] && person.pos[0].n;
      const aff = person && person.aff && person.aff.desc;
      const hindex = person && person.indices && person.indices.h_index;

      personPopupJsx = (
        <div className="personInfo">
          <div id={divId} />
          <div className="info">
            <div className="nameLine">
              <div className="right">H-index:<b> {hindex}</b>
              </div>
              <div className="name">{name}</div>
            </div>
            {pos && <span><i className="fa fa-briefcase fa-fw" />{pos}</span>}
            {aff && <span><i className="fa fa-institution fa-fw" />{aff}</span>}
          </div>
        </div>
      );
    }

    const rightInfos = {
      global: () => (
        <RightInfoZoneAll count={count} avg={avg} persons={persons}
                          isACMFellowNumber={isACMFellowNumber}
                          isIeeeFellowNumber={isIeeeFellowNumber} isChNumber={isChNumber} />
      ),
      person: () => (<RightInfoZonePerson person={person} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };

    return (
      <div className={styles.expertMap} id="currentMain">
        <div className={styles.map}>
          {/*<Spinner loading={this.state.loadingFlag} />*/}
          <div id="allmap" />
          <div className={styles.right}>
            <div className={styles.legend}>
              <div className={styles.title}>
                <span alt="" className={classnames('icon', styles.titleIcon)} />
                图例
              </div>
              <div className={styles.t}>
                <div className={styles.div}>专家：</div>
                <span alt="" className={classnames('icon', styles.expertIcon1)} />
                <div className={styles.tExperts}>一组专家：</div>
                <span alt="" className={classnames('icon', styles.expertIcon2)} />
              </div>
              <div className={styles.container}>
                <div className={styles.label}>人数：</div>
                <div className={styles.item1}>少</div>
                <div className={styles.item2}> 2</div>
                <div className={styles.item3}> 3</div>
                <div className={styles.item4}> 4</div>
                <div className={styles.item5}>多</div>
              </div>
            </div>

            <div className={styles.scrollable}>
              <div className={styles.border}>
                {rightInfos[model.rightInfoType]()}
              </div>
            </div>
          </div>

        </div>

        <div id="personInfo" style={{ display: 'none' }}>
          {personPopupJsx && personPopupJsx}
        </div>

        <input id="currentId" type="hidden" />
        <input id="currentIds" type="hidden" />
        <input id="statistic" type="hidden" value="0" />
        <input id="flowstate" type="hidden" value="0" />
      </div>
    );
  }
}

