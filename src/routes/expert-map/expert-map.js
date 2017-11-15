import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { listPersonByIds } from 'services/person';
import { compare, loadScript } from 'utils';
import * as profileUtils from 'utils/profile-utils';
import GetBMapLib from './utils/BMapLibGai.js';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneAll from './RightInfoZoneAll';
import styles from './expert-map.less';
import {
  findPosition,
  getById,
  toggleRightInfo,
  onResetPersonCard,
  resetRightInfoToGlobal,
  showTopImageDiv,
  showTopImages,
  addImageListener,
  syncInfoWindow,
  //findMapFilterRangesByKey,
  findMapFilterHindexRangesByKey,
  bigAreaConfig,
} from './utils/map-utils';
import {
  dataCache,
  copyImage,
  checkCacheLevel,
  requestDataNow,
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
    const { dispatch, expertMap } = this.props;
    resetRightInfoToGlobal(dispatch);
    const pro = this.props;
    this.showMap(expertMap.geoData, pro.type, pro.range, pro.hindexRange);
    window.onresize = () => { // 改变窗口大小的时候重新加载地图，防止出现错位问题
      this.showMap(
        this.props.expertMap.geoData,
        this.props.type,
        this.props.range,
        this.props.hindexRange,
      );
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
    syncInfoWindow();
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
    showTopImageDiv(e, map, maindom, inputids, onLeave, type, ids, dispatch, this.props.expertMap.infoZoneIds, () => {
      this.listPersonDone(map, ids);
    });
  };

  listPersonDone = (map, ids) => {
    const imgwidth = 45;
    const type = 'baidu';

    const imgdivs = document.getElementsByName('scholarimg');
    if (imgdivs !== null && imgdivs.length !== 0) {
      showTopImages(ids, imgwidth, blankAvatar, imgdivs);
    }
    for (let j = 0; j < imgdivs.length; j += 1) {
      const cimg = imgdivs[j];
      cimg.addEventListener('mouseenter', (event) => {
        addImageListener(map, ids, getInfoWindow, event, imgwidth, type, '', '', (data) => {
          const pId = data.id;
          const idx = [];
          idx.push(pId);
          requestDataNow(idx, () => {
            this.setState({ cperson: pId }, syncInfoWindow());
            copyImage(`${pId}`, `Mid${pId}`, 90);
            this.currentPersonId = pId;
          });
        });
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

    // TODO load script for baidumap.


    loadScript('BMap', { check: 'BMap' }, (BMap) => {
      this.showOverLay();

      const conf = this.mapConfig[mapType] || this.mapConfig[0];// init map instance.
      const map = new BMap.Map('allmap', {
        minZoom: conf.minscale,
        maxZoom: conf.maxscale,
      });
      this.map = map; // set to global;
      map.centerAndZoom(new BMap.Point(
        map1 ? map1.getCenter().lng : sysconfig.CentralPosition.lng,
        map1 ? map1.getCenter().lat : sysconfig.CentralPosition.lat,
      ), conf.scale);

      this.configBaiduMap(map);
      map1 = this.map; // 地图刷新前，用于存储上次浏览的地点

      if (!place || !place.results) { //为空的时候不显示地图
        if (this.props.query === '' || this.props.query === '-' || this.props.query === 'undefined'
          || typeof (this.props.query) === 'undefined') {
          that.hideLoading();
        }
        return;
      }

      if (mapType === '1') {
        bigAreaConfig.map((ac) => {
          map.addOverlay(new BMap.Label(ac.label, {
            position: new BMap.Point(ac.x, ac.y),
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

      if (place.results) {
        place.results.sort((a, b) => b.hindex - a.hindex);
      }

      const ids = [];
      // Loop all results.
      for (const pr of place.results) {
        if (counts > maxHindex) {
          break;
        }
        ids.push(pr.id);
        dataMap[pr.id] = pr;
        const newplace = findPosition(mapType, pr);
        const label = new BMap.Label(`<div>${pr.name}</div><div style='display: none;'>${pr.id}</div>`);
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
        label.setOffset(new BMap.Size(-55.5, 25));

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
            const marker = new BMap.Marker(new BMap.Point(newplace[1], newplace[0])); // 这里经度和纬度是反着的
            marker.setLabel(label);
            marker.setTop();
            marker.setIcon(new BMap.Icon(
              '/images/map/marker_blue_sprite1.png',
              new BMap.Size(19, 50), {
                offset: new BMap.Size(0, 0), // 指定定位位置
                imageOffset: new BMap.Size(0, 0), // 设置图片偏移
              },
            ));
            pId[counts] = pr.id;
            markers.push(marker);
            counts += 1;
          }
        }
      }

      const markerClusterer = new window.BMapLib.MarkerClusterer(map, {});
      markerClusterer.addMarkers(markers);
      for (let m = 0; m < markers.length; m += 1) {
        this.addMouseoverHandler(markers[m], pId[m]);
      }

      that.hideLoading();
      //cache image
      checkCacheLevel(sysconfig.Map_Preload, ids);
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
      onResetPersonCard(dispatch); // TODO Load default name,重置其信息
      e.target.openInfoWindow(infoWindow);
      const ids = [];
      ids.push(personId);
      requestDataNow(ids, () => { //获取完信息之后再回调
        if (this.currentPersonId !== personId) {
          this.setState({ cperson: personId }, syncInfoWindow());//回调函数里面改写
        } else {
          e.target.openInfoWindow(infoWindow);
          syncInfoWindow();
        }
        //使用中等大小的图标，将图片拷贝过去，和cluster中的一样,一定注意其逻辑顺序啊！
        copyImage(`${personId}`, `Mid${personId}`, 90);
        this.currentPersonId = personId;
      });
    });
    marker.addEventListener('mouseout', (e) => {
      e.target.closeInfoWindow(infoWindow);
    });
    marker.addEventListener('click', () => {
      toggleRightInfo('person', personId, dispatch, this.props.expertMap.infoZoneIds);
    });
  };


  render() {
    const model = this.props && this.props.expertMap;
    const { results } = model.geoData;
    let personPopupJsx;
    const person = dataCache[this.state.cperson];
    if (person) {
      const [divId, name] = [`Mid${person.id}`, person.name];
      const pos = person && person.pos && person.pos[0] && person.pos[0].n;
      const aff = person && person.aff && person.aff.desc;
      const hindex = person && person.indices && person.indices.h_index;

      personPopupJsx = (
        <div className="personInfo">
          <div name={divId} />
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
      person: () => (<RightInfoZonePerson person={person} showBut="true" />),
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
      </div>
    );
  }
}

