/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Tag, TreeSelect } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { listPersonByIds } from 'services/person';
import * as profileUtils from 'utils/profile-utils';
import { findPosition, getById, waitforBMap, waitforBMapLib } from './utils/map-utils';
import GetBMapLib from './utils/BMapLibGai.js';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneAll from './RightInfoZoneAll';
import styles from './expert-map.less';

const { CheckableTag } = Tag;

let map1;
let number = '0';
let range = '0';
let domainIds = [];
let domainChecks = [];
const dataMap = {};
const ButtonGroup = Button.Group;
const blankAvatar = '/images/blank_avatar.jpg';

function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

/*
 * Popup window.
 */
const showLoadErrorMessage = () => {
  getById('allmap').innerHTML = 'Cannot connect to Baidu Map! Please check the network state!';
};

let globalInfoWindow;
const getInfoWindow = () => {
  if (!globalInfoWindow) {
    const sContent = "<div id='author_info' class='popup'></div>";
    globalInfoWindow = new window.BMap.InfoWindow(sContent);
    globalInfoWindow.disableAutoPan();
  }
  return globalInfoWindow;
};

/**
 * Component
 * @param id
 */
class ExpertMap extends React.PureComponent {
  /** 构造函数： 这里执行初始化 */
  constructor(props) {
    super(props);
    this.cache = {};
    this.cacheData = {};//缓存作者数据
    this.cacheImg = {};//缓存作者图像
    this.showOverLay = GetBMapLib(this.showTop);
    this.currentPersonId = 0;
    localStorage.setItem('lasttype', '0');
  }

  state = {
    typeIndex: '0',
    rangeChecks: [true, false, false, false],
    numberChecks: [true, false, false, false, false],
    loadingFlag: true,
    cperson: '', //当前显示的作者的id
  };

  componentDidMount() {
    const { query, dispatch } = this.props;
    this.callSearchMap(query);
    localStorage.setItem('lasttype', '0');
    localStorage.setItem('domain', '0');
    dispatch({
      type: 'expertMap/setRightInfo',
      payload: { idString: '', rightInfoType: 'global' },
    });
    window.onresize = () => {
      this.showMap(this.props.expertMap.geoData, this.state.typeIndex);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.callSearchMap(nextProps.query);
      domainChecks = [];
      domainIds = [];
    }
    if (nextProps.expertMap.geoData !== this.props.expertMap.geoData) {
      const typeId = '0';
      this.showMap(nextProps.expertMap.geoData, typeId, '0', '0');
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    this.syncInfoWindow();
  }

  onChangeGoogleMap = () => {
    localStorage.setItem('maptype', 'google');
    const href = window.location.href;
    window.location.href = href.replace('expert-map', 'expert-googlemap');
  };

  onChangeBaiduMap = () => {
    const href = window.location.href;
    window.location.href = href;
  };

  onLoadPersonCard = (personId) => {
    this.props.dispatch({ type: 'expertMap/getPersonInfo', payload: { personId } });
  };

  onResetPersonCard = () => {
    this.props.dispatch({ type: 'expertMap/resetPersonInfo' });
  };

  onSetPersonCard = (personInfo) => {
    this.props.dispatch({
      type: 'expertMap/getPersonInfoSuccess',
      payload: { data: { data: personInfo } },
    });
  };

  onExpertBaseChange = (id, name) => {
    const { filters } = this.props.search;
    // delete all other filters.
    Object.keys(filters).forEach((f) => {
      delete filters[f];
    });
    this.onFilterChange('eb', { id, name }, true);// Special Filter;
  };

  showTop = (usersIds, e, map, maindom, inputids, onLeave) => {
    const ishere = getById('panel');
    if (ishere != null) {
      this.detachCluster(ishere);
    }

    const pixel = map.pointToOverlayPixel(e.currentTarget.getPosition());// 中心点的位置
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;

    const oDiv = document.createElement('div');
    const ostyle = `height:${width}px;width:${width}px;left: ${pixel.x - (width / 2)}px;top: ${pixel.y - (width / 2)}px;`;
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
      imgdiv.addEventListener('click', () => this.toggleRightInfo('person', ids[i]), false);
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
      this.toggleRightInfo('cluster', inputids);
      event.stopPropagation();
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

    this.listPersonDone(map, ids, this.cacheData);
    /*// cached.
    const cached = this.cache[ids];
    if (cached) {
      this.listPersonDone(map, ids, cached);
    } else {
      console.log(ids);
      const resultPromise = listPersonByIds(ids);
      resultPromise.then(
        (data) => {
          console.log(data);
          this.cache[ids] = data;
          this.listPersonDone(map, ids, data);
        },
        () => {
          console.log('failed');
        },
      ).catch((error) => {
        console.error(error);
      });
      console.log('second!');
    }*/
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

  listPersonDone = (map, ids, data) => {
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
        cimg.addEventListener('mouseenter', (event) => {
          // get current point.
          const apos = getById('allmap').getBoundingClientRect();
          const cpos = event.target.getBoundingClientRect();
          const newPixel = new window.BMap.Pixel(cpos.left - apos.left + imgwidth, cpos.top - apos.top); // eslint-disable-line
          const currentPoint = map.pixelToPoint(newPixel);
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
          const infoWindow = getInfoWindow(); //信息窗口
          //this.onSetPersonCard(personInfo); //查询数据，不需要了
          map.openInfoWindow(infoWindow, currentPoint); //打开窗口
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
          map.closeInfoWindow();
        });
      }
    }
  };

  showNumber = (numberTmp) => {
    const that = this;
    const arr = [false, false, false, false, false];
    arr[numberTmp] = true;
    that.setState({ numberChecks: arr });
    const lastType = localStorage.getItem('lasttype');
    if (numberTmp) {
      number = numberTmp;
      this.showMap(this.props.expertMap.geoData, lastType, range, number);
    }
  };

  showType = (e) => {
    localStorage.setItem('isClick', '1');
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    this.setState({ typeIndex: typeid });
    if (typeid === '0') {
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    } else if (typeid === '1') {
      // 简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    } else if (typeid === '2') {
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    } else if (typeid === '3') {
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    } else if (typeid === '4') {
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    } else if (typeid === '5') {
      this.showMap(this.props.expertMap.geoData, typeid, '0', '0');
    }
  };

  showMap = (place, type) => {
    const that = this;
    this.setState({ loadingFlag: true });
    waitforBMap(200, 100,
      () => {
        this.showOverLay();
        let centerx;
        let centery;
        let scale = 4;
        let minscale = 3;
        let maxscale = 18;
        let newtype;
        centerx = sysconfig.CentralPosition.lng;
        centery = sysconfig.CentralPosition.lat;
        if (localStorage.getItem('lasttype') !== '0' && localStorage.getItem('isClick') === '0') {
          newtype = localStorage.getItem('lasttype');
        } else {
          newtype = type;
        }
        if (newtype === '0') {
          scale = 4;
          minscale = 4;
        } else if (newtype === '1' || newtype === '2' || newtype === '3') {
          scale = 4;
          minscale = 4;
          maxscale = 5;
        } else if (newtype === '4' || newtype === '5') {
          scale = 7;
          minscale = 5;
          maxscale = 7;
        }
        if (map1) {
          centerx = map1.getCenter().lng;
          centery = map1.getCenter().lat;
        } else {
          centerx = sysconfig.CentralPosition.lng;
          centery = sysconfig.CentralPosition.lat;
        }
        localStorage.setItem('lasttype', newtype);
        const map = new window.BMap.Map('allmap', { minZoom: minscale, maxZoom: maxscale });
        this.map = map; // set to global;
        map1 = this.map;
        map.centerAndZoom(new window.BMap.Point(
          centerx, centery,
        ), scale);

        this.initializeBaiduMap(map);
        let markers = [];
        const pId = [];
        let counts = 0;
        if (newtype === '1') {
          const opts1 = {
            position: new window.BMap.Point(102, 38),
          };
          map.addOverlay(new window.BMap.Label('中国', opts1));
          const opts2 = {
            position: new window.BMap.Point(136, 32),
          };
          map.addOverlay(new window.BMap.Label('日本', opts2));
          const opts3 = {
            position: new window.BMap.Point(125, 33),
          };
          map.addOverlay(new window.BMap.Label('韩国', opts3));
          const opts4 = {
            position: new window.BMap.Point(76.5, 16),
          };
          map.addOverlay(new window.BMap.Label('印度', opts4));
          const opts5 = {
            position: new window.BMap.Point(114, 22),
          };
          map.addOverlay(new window.BMap.Label('香港', opts5));
          const opts6 = {
            position: new window.BMap.Point(100, -3),
          };
          map.addOverlay(new window.BMap.Label('新加坡', opts6));
          const opts7 = {
            position: new window.BMap.Point(121, 25),
          };
          map.addOverlay(new window.BMap.Label('台湾', opts7));
          const opts8 = {
            position: new window.BMap.Point(64, 48),
          };
          map.addOverlay(new window.BMap.Label('中亚', opts8));
          const opts9 = {
            position: new window.BMap.Point(118.5, 9),
          };
          map.addOverlay(new window.BMap.Label('东南亚', opts9));
          const opts10 = {
            position: new window.BMap.Point(29, 45),
          };
          map.addOverlay(new window.BMap.Label('东欧', opts10));
          const opts11 = {
            position: new window.BMap.Point(7, 44),
          };
          map.addOverlay(new window.BMap.Label('西欧', opts11));
          const opts12 = {
            position: new window.BMap.Point(16, 58),
          };
          map.addOverlay(new window.BMap.Label('北欧', opts12));
          const opts13 = {
            position: new window.BMap.Point(-6.1, 52),
          };
          map.addOverlay(new window.BMap.Label('英国', opts13));
          const opts14 = {
            position: new window.BMap.Point(101.5, 59.2),
          };
          map.addOverlay(new window.BMap.Label('俄罗斯', opts14));
          const opts15 = {
            position: new window.BMap.Point(31, 28),
          };
          map.addOverlay(new window.BMap.Label('以色列', opts15));
          const opts16 = {
            position: new window.BMap.Point(130, -31),
          };
          map.addOverlay(new window.BMap.Label('大洋洲', opts16));
          const opts17 = {
            position: new window.BMap.Point(-60, -10),
          };
          map.addOverlay(new window.BMap.Label('拉丁美洲', opts17));
          const opts18 = {
            position: new window.BMap.Point(-108.5, 56.5),
          };
          map.addOverlay(new window.BMap.Label('加拿大', opts18));
          const opts19 = {
            position: new window.BMap.Point(-126, 33.5),
          };
          map.addOverlay(new window.BMap.Label('美国西部', opts19));
          const opts20 = {
            position: new window.BMap.Point(-79.5, 34),
          };
          map.addOverlay(new window.BMap.Label('东部', opts20));
          const opts21 = {
            position: new window.BMap.Point(-107.5, 34.5),
          };
          map.addOverlay(new window.BMap.Label('中部', opts21));
        }
        place.results.sort((a, b) => b.hindex - a.hindex);
        const ids = [];
        for (const pr of place.results) {
          ids.push(pr.id);
          dataMap[pr.id] = pr;
          let pt = null;
          const newplace = findPosition(newtype, pr);
          const label = new window.BMap.Label(`<div>${pr.name}</div><div style='display: none;'>${pr.id}</div>`);
          label.setStyle({
            color: 'black',
            fontSize: '12px',
            border: 'none',
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '130px',
            textShadow: '1px 1px 2px white, -1px -1px 2px white',
            fontStyle: 'italic',
          });
          label.setOffset(new window.BMap.Size(-55.5, 25));

          // 只有经纬度不为空或者0的时候才显示，否则丢弃
          if ((newplace[1] != null && newplace[1] != null) &&
            (newplace[1] !== 0 && newplace[1] !== 0)) {
            pt = new window.BMap.Point(newplace[1], newplace[0]);// 这里经度和纬度是反着的
            const myIcon = new window.BMap.Icon('/images/map/marker_blue_sprite1.png', new window.BMap.Size(19, 50), {
              offset: new window.BMap.Size(0, 0), // 指定定位位置
              imageOffset: new window.BMap.Size(0, 0), // 设置图片偏移
            });
            //const marker = new window.BMap.Marker(pt, { icon: myIcon } );
            if (range === '0') {
              const marker = new window.BMap.Marker(pt);
              marker.setLabel(label);
              marker.setTop();
              marker.setIcon(myIcon);
              const personId = pr.id;
              pId[counts] = personId;
              markers.push(marker);
              counts += 1;
            } else if (range === '1') {
              if (pr.fellows[0] === 'acm') {
                const marker = new window.BMap.Marker(pt);
                marker.setLabel(label);
                marker.setTop();
                marker.setIcon(myIcon);
                const personId = pr.id;
                pId[counts] = personId;
                markers.push(marker);
                counts += 1;
              }
            } else if (range === '2') {
              if (pr.fellows[0] === 'ieee' || pr.fellows[1] === 'ieee') {
                const marker = new window.BMap.Marker(pt);
                marker.setLabel(label);
                marker.setTop();
                marker.setIcon(myIcon);
                const personId = pr.id;
                pId[counts] = personId;
                markers.push(marker);
                counts += 1;
              }
            } else if (range === '3') {
              if (pr.is_ch) {
                const marker = new window.BMap.Marker(pt);
                marker.setLabel(label);
                marker.setTop();
                marker.setIcon(myIcon);
                const personId = pr.id;
                pId[counts] = personId;
                markers.push(marker);
                counts += 1;
              }
            }
          }
        }
        if (number === '0') {
          markers = markers.slice(0, 200);
        } else if (number === '1') {
          markers = markers.slice(0, 50);
        } else if (number === '2') {
          markers = markers.slice(0, 100);
        } else if (number === '3') {
          markers = markers.slice(0, 500);
        }
        waitforBMapLib(200, 100,
          () => {
            const markerClusterer = new window.BMapLib.MarkerClusterer(map, {});
            markerClusterer.addMarkers(markers);
            for (let m = 0; m < markers.length; m += 1) {
              this.addMouseoverHandler(markers[m], pId[m]);
            }
          }, showLoadErrorMessage,
        );
        //cache imges
        that.cacheInfo(ids);
        that.cacheBiGImage(ids, 90);
        that.cacheBiGImage(ids, 160);
        console.log('cached in!!!yes!');
      }, showLoadErrorMessage,
    );
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
    // for (let i = 0; i < count; i += 1) { //先将信息数据缓存
    //   resultPromise[i].then(
    //     (data) => {
    //       for (const p of data.data.persons) {
    //         this.cacheData[p.id] = p;
    //         const url = profileUtils.getAvatar(p.avatar, p.id, 50);
    //         const img = new Image();
    //         img.src = url;
    //         img.name = p.id;//不能使用id,否则重复
    //         img.onerror = () => {
    //           img.src = blankAvatar;
    //         };
    //         this.cacheImg[p.id] = img;
    //       }
    //       count1 += 1;
    //       if (count === count1) {
    //         this.setState({ loadingFlag: false });
    //       }
    //     },
    //     () => {
    //       console.log('failed');
    //     },
    //   ).catch((error) => {
    //     console.error(error);
    //   });
    // }
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

  initializeBaiduMap = (map) => {
    map.enableScrollWheelZoom();
    map.addControl(new window.BMap.NavigationControl());
    map.addControl(new window.BMap.ScaleControl());
    map.addControl(new window.BMap.OverviewMapControl());
  };

  showRange = (rangeTmp) => {
    const lastType = localStorage.getItem('lasttype');
    const that = this;
    const arr = [false, false, false, false];
    arr[rangeTmp] = true;
    that.setState({ rangeChecks: arr });
    if (rangeTmp) {
      range = rangeTmp;
      this.showMap(this.props.expertMap.geoData, lastType, range, number);
    }
  };

  // 单点鼠标移上效果
  addMouseoverHandler = (marker, personId) => {
    const infoWindow = getInfoWindow();
    marker.addEventListener('mouseover', (e) => {
      if (this.currentPersonId !== personId) {
        this.onResetPersonCard(); // TODO Load default name,重置其信息
        //this.onLoadPersonCard(personId); //请求数据，现在不需要了
        e.target.openInfoWindow(infoWindow);
        //this.syncInfoWindow();
        this.setState({ cperson: personId }, this.syncInfoWindow());//回调函数里面改写
      } else {
        e.target.openInfoWindow(infoWindow);
        this.syncInfoWindow();
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
      this.currentPersonId = personId;
    });
    marker.addEventListener('mouseout', (e) => {
      e.target.closeInfoWindow(infoWindow);
    });
    marker.addEventListener('click', () => {
      this.toggleRightInfo('person', personId);
    });
  };

  // update one person's info.
  toggleRightInfo = (type, id) => {
    // TODO cache it.
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

  // 将内容同步到地图中的控件上。
  syncInfoWindow = () => {
    const ai = getById('author_info');
    const pi = getById('personInfo');
    if (ai && pi) {
      ai.innerHTML = pi.innerHTML;
    }
  };

  callSearchMap = (query) => {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  };

  domainChanged = (value) => {
    this.props.dispatch(routerRedux.push({ pathname: '/expert-map', search: `?query=${value.name}` }));
    let i = 0;
    domainIds.map((domain1) => {
      domainChecks[i] = value.id === domain1; //简化写法
      i += 1;
      return true;
    });
    if (value.id) {
      const { dispatch } = this.props;
      localStorage.setItem('isClick', '0');
      dispatch({ type: 'app/clearQueryInHeaderIfExist' });
      dispatch({ type: 'expertMap/searchExpertBaseMap', payload: { eb: value.id } });
      dispatch({
        type: 'expertMap/setRightInfo',
        payload: { idString: '', rightInfoType: 'global' },
      });
    }
  };

  render() {
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
    const person = this.cacheData[this.state.cperson];
    if (person) {
      //console.log(person);
      //const url = person.avatar;
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
    /*console.log(personPopupJsx);
    console.log(typeof (personPopupJsx));
    const person = model.personInfo;
    if (person) {
      const url = profileUtils.getAvatar(person.avatar, person.id, 90);
      const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      const pos = profileUtils.displayPosition(person.pos);
      const aff = profileUtils.displayAff(person);
      const hindex = person && person.indices && person.indices.h_index;
      const img = this.cacheImg[person.id];
      console.log('GGGGG');

      personPopupJsx = (
        <div className="personInfo">
          <div><img className="img" src={url} alt="IMG" /></div>
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
    console.log(personPopupJsx);
    console.log(typeof (personPopupJsx));*/

    const rightInfos = {
      global: () => (
        <RightInfoZoneAll count={count} avg={avg} persons={persons}
                          isACMFellowNumber={isACMFellowNumber}
                          isIeeeFellowNumber={isIeeeFellowNumber} isChNumber={isChNumber} />
      ),
      person: () => (<RightInfoZonePerson person={person} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };
    const that = this;
    const Domains = sysconfig.Map_HotDomains;
    let i = 0;
    const arr = [];
    Domains.map((domain1) => {
      domainIds[i] = domain1.id;
      if (domainIds.length === 0) {
        arr[i] = false;
      }
      i += 1;
      return true;
    });
    let m = 0;
    if (domainChecks) {
      Domains.map((domain1) => {
        domainChecks[m] = domain1.name === this.props.query; //简化写法返回true，false
        m += 1;
        return true;
      });
    }
    const TreeNode = TreeSelect.TreeNode;

    return (
      <div className={styles.expertMap} id="currentMain">
        <div className={styles.filterWrap}>
          <div className={styles.filter}>
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}><span>Hot words:</span></span>
              <ul>
                {Domains.map((domain) => {
                  checkState += 1;
                  return (
                    <CheckableTag className={styles.filterItem} key={domain.id}
                                  checked={domainChecks[checkState - 1]} value={domain.id}>
                      <span role="presentation" onClick={this.domainChanged.bind(that, domain)}>{domain.name}</span>
                    </CheckableTag>);
                })
                }
              </ul>
            </div>
          </div>
          <div className={styles.filter}>
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}><span>Range:</span></span>
              <ul>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[0]}>
                  <span role="presentation" onClick={this.showRange.bind(that, '0')} value="0" >ALL</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[1]}><span role="presentation" onClick={this.showRange.bind(that, '1')}>ACM Fellow</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[2]}><span role="presentation" onClick={this.showRange.bind(that, '2')}>IEEE Fellow</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[3]}><span role="presentation" onClick={this.showRange.bind(that, '3')}>华人</span></CheckableTag>
              </ul>
            </div>
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}><span>H-index:</span></span>
              <ul>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[4]}><span role="presentation" onClick={this.showNumber.bind(that, '4')}>ALL</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[3]}><span role="presentation" onClick={this.showNumber.bind(that, '3')}>TOP500</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[0]}><span role="presentation" onClick={this.showNumber.bind(that, '0')}>TOP200</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[2]}><span role="presentation" onClick={this.showNumber.bind(that, '2')}>TOP100</span></CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[1]}><span role="presentation" onClick={this.showNumber.bind(that, '1')}>TOP50</span></CheckableTag>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.headerLine}>
          <div className={styles.left}>
            {/*{this.props.title}*/}
            {/*<span>*/}
            {/*<FM defaultMessage="Domain"*/}
            {/*id="com.expertMap.headerLine.label.field" />*/}
            {/*</span>*/}
            {/*<Select defaultValue="" className={styles.domainSelector} style={{ width: 120 }}*/}
            {/*onChange={this.domainChanged}>*/}
            {/*<Select.Option key="none" value="">*/}
            {/*<FM defaultMessage="Domain"*/}
            {/*id="com.expertMap.headerLine.label.selectField" />*/}
            {/*</Select.Option>*/}
            {/*{Domains.map(domain =>*/}
            {/*(<Select.Option key={domain.id} value={domain.id}>{domain.name}</Select.Option>),*/}
            {/*)}*/}
            {/*</Select>*/}
            <TreeSelect
              className={styles.treeSelect}
              style={{ width: 280, display: 'none' }}
              value={this.state.value}
              dropdownStyle={{ maxHeight: 425, overflow: 'auto' }}
              placeholder={<b style={{ color: '#08c' }}>Domains</b>}
              treeDefaultExpandAll
            >
              <TreeNode value="parent 1-0" title="Theory" key="1-0">
                {Domains.map((domain) => {
                  if (domain.name === 'Theory' || domain.name === 'Multimedia' || domain.name === 'Security'
                    || domain.name === 'Software Engineering' || domain.name === 'Computer Graphics') {
                    return (
                      <TreeNode value={domain.id}
                                title={<span role="presentation" onClick={this.domainChanged.bind(that, domain)}>{domain.name}</span>}
                                key={domain.id} />
                    );
                  }
                  return true;
                })
                }
              </TreeNode>
              <TreeNode value="parent 1-1" title="System" key="1-1">
                {Domains.map((domain) => {
                  if (domain.name === 'Database' || domain.name === 'System' || domain.name === 'Computer Networking') {
                    return (
                      <TreeNode value={domain.id}
                                title={<span role="presentation" onClick={this.domainChanged.bind(that, domain)}>{domain.name}</span>}
                                key={domain.id} />
                    );
                  }
                  return true;
                })
                }
              </TreeNode>
              <TreeNode value="parent 1-2" title="Artificial Intelligence" key="1-2">
                {Domains.map((domain) => {
                  if (domain.name === 'Data Mining' || domain.name === 'Machine Learning' || domain.name === 'Artificial Intelligence'
                    || domain.name === 'Web and Information Retrieval' || domain.name === 'Computer Vision'
                    || domain.name === 'Human-Computer Interaction' || domain.name === 'Natural Language Processing') {
                    return (
                      <TreeNode value={domain.id}
                                title={<span role="presentation" onClick={this.domainChanged.bind(that, domain)}>{domain.name}</span>}
                                key={domain.id} />
                    );
                  }
                  return true;
                })
                }
              </TreeNode>
            </TreeSelect>
            <div className={styles.level}>
              <span>
                <FM defaultMessage="Baidu Map"
                    id="com.expertMap.headerLine.label.level" />
              </span>
              <ButtonGroup id="sType" className={styles.sType}>
                <Button onClick={this.showType} value="0">自动</Button>
                <Button onClick={this.showType} value="1">大区</Button>
                <Button onClick={this.showType} value="2">国家</Button>
                <Button onClick={this.showType} value="3" style={{ display: 'none' }}>国内区</Button>
                <Button onClick={this.showType} value="4">城市</Button>
                <Button onClick={this.showType} value="5">机构</Button>
              </ButtonGroup>
            </div>
          </div>

          <div className={styles.scopes}>
            <div className={styles.switch}>
              <ButtonGroup id="diffmaps">
                <Button type="primary" onClick={this.onChangeBaiduMap}>
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.baiduMap" />
                </Button>
                <Button onClick={this.onChangeGoogleMap}>
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.googleMap" />
                </Button>
              </ButtonGroup>
            </div>

          </div>
        </div>

        <div className={styles.map}>
          <Spinner loading={this.state.loadingFlag} />
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
                {/*<div className={styles.text}> 少</div>*/}
                <div className={styles.item1}>少</div>
                <div className={styles.item2}> 2</div>
                <div className={styles.item3}> 3</div>
                <div className={styles.item4}> 4</div>
                <div className={styles.item5}>多</div>
                {/*<div className={styles.text}> 多</div>*/}
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

        {/* TODO what's this for? */}
        <input id="currentId" type="hidden" />
        <input id="currentIds" type="hidden" />
        <input id="statistic" type="hidden" value="0" />
        <input id="flowstate" type="hidden" value="0" />

      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertMap);

