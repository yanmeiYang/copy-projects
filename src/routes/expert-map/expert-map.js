/**
 *  Created by ???? on 2017-06-07;
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { listPersonByIds } from 'services/person';
import { compare } from 'utils';
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
  toggleRightInfo,
  onResetPersonCard,
  resetRightInfoToGlobal,
  showTopImageDiv,
  showTopImages,
  addImageListener,
  //findMapFilterRangesByKey,
  findMapFilterHindexRangesByKey,
  bigAreaConfig,
} from './utils/map-utils';
import {
  dataCache,
  imageCache,
  copyImage,
  cacheInfo,
} from './utils/cache-utils';

let map1; // 地图刷新前，用于存储上次浏览的地点
const dataMap = {}; // 数据的索引，建议可以放到reducers.
const blankAvatar = '/images/blank_avatar.jpg';

const showLoadErrorMessage = () => { //Popup window.
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
  constructor(props) {
    super(props);
    this.showOverLay = GetBMapLib(this.showTop);
    this.currentPersonId = 0;
  }

  state = {
    loadingFlag: false,
    cperson: '', //当前显示的作者的id
  };

  componentDidMount() {
    const { dispatch } = this.props;
    resetRightInfoToGlobal(dispatch);
    const pro = this.props;
    this.showMap(pro.expertMap.geoData, pro.type, pro.range, pro.hindexRange);
    window.onresize = () => { //改变窗口大小的时候重新加载地图，防止出现错位问题
      this.showMap(pro.expertMap.geoData, pro.type, pro.range, pro.hindexRange);
    };
  }

  componentWillReceiveProps(np) {
    if (np.expertMap.geoData !== this.props.expertMap.geoData) {
      this.showMap(np.expertMap.geoData, np.type, np.range, np.hindexRange);
    }
    if (compare(np, this.props, 'range', 'hindexRange', 'type')) {
      this.showMap(this.props.expertMap.geoData, np.type, np.range, np.hindexRange);
    }
  }

  componentDidUpdate() {
    this.syncInfoWindow();
  }

  // EVENTS ---------------------------------------------------------------

  // TOOLS ---------------------------------------------------------------

  showTop = (usersIds, e, map, maindom, inputids, onLeave) => {
    const { dispatch } = this.props;
    const type = 'baidu';
    const usersInfo = [];
    for (const u of usersIds) {
      usersInfo.push(dataMap[u]);
    }
    usersInfo.sort((a, b) => b.hindex - a.hindex);
    const ids = [];
    for (const u of usersInfo.slice(0, 8)) {
      ids.push(u.id);
    }
    showTopImageDiv(e, map, maindom, inputids, onLeave, type, ids, dispatch, this.props.expertMap.infoZoneIds);
    this.listPersonDone(map, ids);
  };

  listPersonDone = (map, ids) => {
    const imgwidth = 45;
    const type = 'baidu';

    const imgdivs = document.getElementsByName('scholarimg');
    if (imgdivs !== null && imgdivs.length !== 0) {
      for (let i = 0; i < ids.length; i += 1) {
        showTopImages(ids, dataCache, imageCache, i, imgwidth, blankAvatar, imgdivs);
      }
    }
    for (let j = 0; j < imgdivs.length; j += 1) {
      const cimg = imgdivs[j];
      cimg.addEventListener('mouseenter', (event) => {
        const pId = addImageListener(map, ids, dataCache, getInfoWindow, event, imgwidth, type);
        this.setState({ cperson: pId }, this.syncInfoWindow());
        const id = `${pId}`;
        const divId = `Mid${pId}`;
        copyImage(id, divId, 90);
        this.currentPersonId = pId;
      });
      cimg.addEventListener('mouseleave', () => {
        map.closeInfoWindow();
      });
    }
  };

  showLoading = () => {
    this.setState({ loadingFlag: true });
  };

  hideLoading = () => {
    this.setState({ loadingFlag: false });
  };

  mapConfig = {
    0: { scale: 5, minscale: 1, maxscale: 16 },
    1: { scale: 4, minscale: 4, maxscale: 5 },
    2: { scale: 4, minscale: 4, maxscale: 5 },
    3: { scale: 4, minscale: 4, maxscale: 5 },
    4: { scale: 7, minscale: 5, maxscale: 7 },
    5: { scale: 7, minscale: 5, maxscale: 7 },
  };

  showMap = (place, type, range, hindexRange) => {
    this.showLoading();
    const that = this;
    const mapType = type || '0';
    const filterRange = range || 'all';

    waitforBMap(200, 100, () => {
      if (!place || !place.results) {
        that.hideLoading();
        return;
      }
      this.showOverLay();

      const conf = this.mapConfig[mapType] || this.mapConfig[0];// init map instance.
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
      map1 = this.map; // 地图刷新前，用于存储上次浏览的地点

      if (mapType === '1') {
        bigAreaConfig.map((ac) => {
          map.addOverlay(new window.BMap.Label(ac.label, {
            position: new window.BMap.Point(ac.x, ac.y),
          }));
          return false;
        });
      }

      // 确定 hindex Ranges 的Filter.
      const hindexRangeConfig = findMapFilterHindexRangesByKey(hindexRange);
      const maxHindex = hindexRangeConfig ? hindexRangeConfig.boundary : 20000;

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

          if (include) {
            const marker = new window.BMap.Marker(
              new window.BMap.Point(newplace[1], newplace[0]), // 这里经度和纬度是反着的
            );
            marker.setLabel(label);
            marker.setTop();
            marker.setIcon(new window.BMap.Icon(
              '/images/map/marker_blue_sprite1.png',
              new window.BMap.Size(19, 50), {
                offset: new window.BMap.Size(0, 0), // 指定定位位置
                imageOffset: new window.BMap.Size(0, 0), // 设置图片偏移
              },
            ));
            pId[counts] = pr.id;
            markers.push(marker);
            counts += 1;
          }
        }
      }

      // this.hideLoading();

      // Add Markers
      waitforBMapLib(
        200, 100,
        () => {
          const markerClusterer = new window.BMapLib.MarkerClusterer(map, {});
          markerClusterer.addMarkers(markers);
          for (let m = 0; m < markers.length; m += 1) {
            this.addMouseoverHandler(markers[m], pId[m]);
          }
        }, showLoadErrorMessage,
      );

      that.hideLoading();
      // cache images
      if (sysconfig.Map_Preload) {
        cacheInfo(ids, listPersonByIds, profileUtils);
        console.log('cached in!!!yes!');
      }
    }, showLoadErrorMessage);
  };

  configBaiduMap = (map) => {
    map.enableScrollWheelZoom();
    map.addControl(new window.BMap.NavigationControl());
    map.addControl(new window.BMap.ScaleControl());
    map.addControl(new window.BMap.OverviewMapControl());
  };

  // 单点鼠标移上效果
  addMouseoverHandler = (marker, personId) => {
    const { dispatch } = this.props;
    const infoWindow = getInfoWindow();
    marker.addEventListener('mouseover', (e) => {
      if (this.currentPersonId !== personId) {
        onResetPersonCard(dispatch); // TODO Load default name,重置其信息
        //this.onLoadPersonCard(personId); //请求数据，现在不需要了
        e.target.openInfoWindow(infoWindow);
        //this.syncInfoWindow();
        this.setState({ cperson: personId }, this.syncInfoWindow());//回调函数里面改写
      } else {
        e.target.openInfoWindow(infoWindow);
        this.syncInfoWindow();
      }
      //使用中等大小的图标，将图片拷贝过去，和cluster中的一样,一定注意其逻辑顺序啊！
      const id = `${personId}`;
      const divId = `Mid${personId}`;
      copyImage(id, divId, 90);
      this.currentPersonId = personId;
    });
    marker.addEventListener('mouseout', (e) => {
      e.target.closeInfoWindow(infoWindow);
    });
    marker.addEventListener('click', () => {
      toggleRightInfo('person', personId, dispatch, this.props.expertMap.infoZoneIds);
    });
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
    const person = dataCache[this.state.cperson];
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

    const rightInfos = {
      global: () => (<RightInfoZoneAll persons={results} />),
      person: () => (<RightInfoZonePerson person={person} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };

    return (
      <div className={styles.expertMap} id="currentMain">

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

        {/* TODO what's this for? */}
        <input id="currentId" type="hidden" />
        <input id="currentIds" type="hidden" />
        <input id="statistic" type="hidden" value="0" />
        <input id="flowstate" type="hidden" value="0" />

      </div>
    );
  }
}

