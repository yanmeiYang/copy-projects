/**
 *  Created by ???? on 2017-06-07;
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import loadScript from 'load-script';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { listPersonByIds } from 'services/person';
import * as profileUtils from 'utils/profile-utils';
import GetBMapLib from './utils/BMapLibGai.js';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneAll from './RightInfoZoneAll';
import styles from './expert-map.less';
import {
  findPosition,
  getById,
  waitforBMap,
  waitforBMapLib,
  findMapFilterRangesByKey,
  findMapFilterHindexRangesByKey,
  bigAreaConfig,
} from './utils/map-utils';

let map1; // what?
const dataMap = {}; // 数据的索引，建议可以放到reducers.
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
 * -------------------------------------------------------------------
 */
@connect(({ expertMap, loading }) => ({ expertMap, loading }))
export default class ExpertMap extends PureComponent {
  /** 构造函数： 这里执行初始化 */
  constructor(props) {
    super(props);
    this.cache = {};
    this.cacheData = {}; // 缓存作者数据
    this.cacheImg = {}; // 缓存作者图像
    this.showOverLay = GetBMapLib(this.showTop);
    this.currentPersonId = 0;
  }

  state = {
    typeIndex: '0',
    // rangeChecks: [true, false, false, false],
    // numberChecks: [true, false, false, false, false],
    loadingFlag: false,
    cperson: '', //当前显示的作者的id
    lastType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.resetRightInfoToGlobal(dispatch);
    this.showMap(this.props.expertMap.geoData, this.state.typeIndex);// Show an empty map.
    // TODO what this for?
    // window.onresize = () => {
    //   this.showMap(this.props.expertMap.geoData, this.state.typeIndex);
    // };
  }

  componentWillReceiveProps(np) {
    // if (np.query && np.query !== this.props.query) {
    // this.callSearchMap(nextProps.query);
    // }
    // monitor data.
    if (np.expertMap.geoData !== this.props.expertMap.geoData) {
      this.showMap(np.expertMap.geoData, '0', np.range, np.hindexRange);
    }
    const { lastType } = this.state;
    if (np.range !== this.props.range) {
      console.log('>>>>> change map to :', np.range, np.hindexRange);
      this.showMap(this.props.expertMap.geoData, lastType, np.range, np.hindexRange);
    }
    if (np.hindexRange !== this.props.hindexRange) {
      console.log('>>>>> change map to :', np.range, np.hindexRange);
      this.showMap(this.props.expertMap.geoData, lastType, np.range, np.hindexRange);
    }
  }

  componentDidUpdate() {
    this.syncInfoWindow();
  }

  // EVENTS ---------------------------------------------------------------

  // TODO Change this. to main block.
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

  // TOOLS ---------------------------------------------------------------

  resetRightInfoToGlobal = (dispatch) => {
    dispatch({
      type: 'expertMap/setRightInfo',
      payload: { idString: '', rightInfoType: 'global' },
    });
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

    console.log('======================++++++++++++++++++++++++++++', this.cacheData);
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

  showType = (e) => {
    const { range, hindexRange } = this.props;
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    this.setState({ typeIndex: typeid });
    // refactor:: to this line.
    this.showMap(this.props.expertMap.geoData, typeid, range, hindexRange, true);
  };

  showLoading = () => {
    this.setState({ loadingFlag: true });
  };

  hideLoading = () => {
    this.setState({ loadingFlag: false });
  };

  mapConfig = {
    '0': { scale: 5, minscale: 1, maxscale: 16 },
    '1': { scale: 4, minscale: 4, maxscale: 5 },
    '2': { scale: 4, minscale: 4, maxscale: 5 },
    '3': { scale: 4, minscale: 4, maxscale: 5 },
    '4': { scale: 7, minscale: 5, maxscale: 7 },
    '5': { scale: 7, minscale: 5, maxscale: 7 },
  };

  showMap = (place, type, range, hindexRange, noLoading) => {
    // loadScript('/lib/echarts.js', () => {
    //   echarts = window.echarts; // eslint-disable-line prefer-destructuring
    //   loadScript('/lib/echarts-map/world.js', () => {
    //     this.myChart = echarts.init(document.getElementById('world'));
    //     this.showTrajectory();
    //   });
    // });
    // return false; // -------------------------------------------

    if (!noLoading) { // Loading mask.
      this.showLoading();
    }

    const that = this; // TODO This is not used.
    const mapType = type || '0';
    const filterRange = range || 'all';

    waitforBMap(200, 100, () => {
        if (!place || !place.results) {
          this.hideLoading();
          return;
        }

        this.showOverLay();

        // init map instance.
        const conf = this.mapConfig[mapType] || this.mapConfig['0'];
        const map = new window.BMap.Map('allmap', {
          minZoom: conf.minscale,
          maxZoom: conf.maxscale,
        });
        this.map = map; // set to global;
        map.centerAndZoom(new window.BMap.Point(
          map1 ? map1.getCenter().lng : sysconfig.CentralPosition.lng,
          map1 ? map1.getCenter().lat : sysconfig.CentralPosition.lat,
        ), conf.scale);

        this.configBaiduMap(map);
        map1 = this.map; // TODO What's map1 这个鬼

        // create markers;

        if (mapType === '1') {
          bigAreaConfig.map((ac) => {
            map.addOverlay(new window.BMap.Label(ac.label, {
              position: new window.BMap.Point(ac.x, ac.y),
            }));
            return false;
          });
        }

        // Loop results.

        // 确定 hindex Ranges 的Filter.
        const hindexRangeConfig = findMapFilterHindexRangesByKey(hindexRange);
        const maxHindex = hindexRangeConfig ? hindexRangeConfig.boundary : 200;

        const markers = [];
        const pId = [];
        let counts = 0;

        // better sort when first get results, in reducers.
        place.results.sort((a, b) => b.hindex - a.hindex);

        const ids = [];
        // Loop all results.
        for (const pr of place.results) {
          if (counts > maxHindex) {
            break;
          }

          ids.push(pr.id);
          dataMap[pr.id] = pr;
          const newplace = findPosition(mapType, pr);
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
          // if ((newplace[1] != null && newplace[1] != null) && (newplace[1] !== 0 && newplace[1] !== 0)) {
          if (newplace && newplace[1]) {
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

            if (include) {
              const marker = new window.BMap.Marker(
                new window.BMap.Point(newplace[1], newplace[0]), // 这里经度和纬度是反着的
              );
              marker.setLabel(label);
              marker.setTop();
              marker.setIcon(
                new window.BMap.Icon(
                  '/images/map/marker_blue_sprite1.png',
                  new window.BMap.Size(19, 50), {
                    offset: new window.BMap.Size(0, 0), // 指定定位位置
                    imageOffset: new window.BMap.Size(0, 0), // 设置图片偏移
                  }
                ),
              );
              pId[counts] = pr.id;
              markers.push(marker);
              counts += 1;
            }
          }
        }

        // this.hideLoading();

        // Add Markers
        waitforBMapLib(200, 100,
          () => {
            const markerClusterer = new window.BMapLib.MarkerClusterer(map, {});
            markerClusterer.addMarkers(markers);
            for (let m = 0; m < markers.length; m += 1) {
              this.addMouseoverHandler(markers[m], pId[m]);
            }
          }, showLoadErrorMessage,
        );

        // cache images
        if (sysconfig.Map_Preload) {
          that.cacheInfo(ids);
          that.cacheBiGImage(ids, 90);
          that.cacheBiGImage(ids, 160);
          console.log('cached in!!!yes!');
        }
      }, showLoadErrorMessage,
    );
  };

  cacheInfo = (ids) => { // 缓存基本信息
    const resultPromise = [];
    let count = 0;
    let count1 = 0;
    for (let i = 0; i < ids.length; i += 100) { // 可控制cache的数目
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
          this.hideLoading();
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

  configBaiduMap = (map) => {
    map.enableScrollWheelZoom();
    map.addControl(new window.BMap.NavigationControl());
    map.addControl(new window.BMap.ScaleControl());
    map.addControl(new window.BMap.OverviewMapControl());
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

  render() {
    const model = this.props && this.props.expertMap;
    const { results } = model.geoData;
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
      global: () => (<RightInfoZoneAll persons={results} />),
      person: () => (<RightInfoZonePerson person={person} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };

    return (
      <div className={styles.expertMap} id="currentMain">

        <div className={styles.headerLine}>
          <div className={styles.left}>

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


