/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { RequireRes } from 'hoc';
import { sysconfig } from 'systems';
import { Spinner } from 'components';
import { compare, ensure } from 'utils';
import styles from './expert-googlemap.less';

import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile-utils';
import GetGoogleMapLib from './utils/googleMapGai.js';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZoneAll from './RightInfoZoneAll';
import {
  getById,
  toggleRightInfo,
  onResetPersonCard,
  resetRightInfoToGlobal,
  showTopImageDiv,
  showTopImages,
  addImageListener,
  syncInfoWindow,
  backGlobal,
  isIn,
  ifIn,
  //findMapFilterRangesByKey,
  findMapFilterHindexRangesByKey,
} from './utils/map-utils';
import { findPosition, bigAreaConfig } from './utils/bigArea-utils';
import {
  dataCache,
  copyImage,
  checkCacheLevel,
  requestDataNow,
} from './utils/cache-utils';

let map1;
const dataMap = {};
const blankAvatar = '/images/blank_avatar.jpg';

let globalInfoWindow;
const getInfoWindow = () => {
  if (!globalInfoWindow) {
    globalInfoWindow = new window.google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>",
    });
  }
  return globalInfoWindow;
};

/**
 * -------------------------------------------------------------------
 */
@connect(({ expertMap, loading }) => ({ expertMap, loading }))
@RequireRes('GoogleMap')
export default class ExpertGoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.showOverLay = GetGoogleMapLib(this.showTop);
    this.currentPersonId = 0;
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
    syncInfoWindow();
  }

  addMouseoverHandler = (map, marker, personId) => {
    ensure('google', (google) => {
      const { dispatch } = this.props;
      const that = this;
      const infoWindow = getInfoWindow();
      google.maps.event.addListener(marker, 'mouseover', () => {
        ifIn.pop();
        ifIn.push(true);
        onResetPersonCard(dispatch);
        //infoWindow.setContent("<div id='author_info' class='popup'></div>");
        infoWindow.open(map, marker);
        const ids = [];
        ids.push(personId);
        requestDataNow(ids, () => { //获取完信息之后再回调
          if (that.currentPersonId !== personId) {
            this.setState({ cperson: personId }, syncInfoWindow());//回调函数里面改写
          } else {
            infoWindow.close();
            infoWindow.open(map, marker);
            syncInfoWindow();
          }
          //使用中等大小的图标，将图片拷贝过去，和cluster中的一样,一定注意其逻辑顺序啊！
          copyImage(`${personId}`, `Mid${personId}`, 90);
          that.currentPersonId = personId;
        });
      });

      google.maps.event.addListener(marker, 'mouseout', () => {
        ifIn.pop();
        ifIn.push(false);
        const markerInterval = setInterval(() => {
          const flag1 = isIn[isIn.length - 1];
          const flag2 = ifIn[ifIn.length - 1];
          if (!flag1 && !flag2) {
            infoWindow.close(map, marker);
            clearInterval(markerInterval);
          }
        }, 1000);
      });

      google.maps.event.addListener(marker, 'click', () => {
        toggleRightInfo('person', personId, dispatch, this.props.expertMap.infoZoneIds);
      });
    });
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
    const mapType = type || 0;

    ensure('google', (google) => {
      that.showOverLay();
      if (!map1) {
        map1 = new google.maps.Map(document.getElementById('allmap'), {
          center: { lat: sysconfig.CentralPosition.lat, lng: sysconfig.CentralPosition.lng },
        });
      }
      const mapCenter = {
        lat: map1 ? map1.getCenter().lat() : sysconfig.CentralPosition.lat,
        lng: map1 ? map1.getCenter().lng() : sysconfig.CentralPosition.lng,
      };
      const conf = this.mapConfig[mapType] || this.mapConfig[0]; //根据地图的类型选择地图的尺寸
      const map = new google.maps.Map(document.getElementById('allmap'), {
        center: mapCenter,
        zoom: conf.scale,
        gestureHandling: 'greedy',
        minZoom: conf.minscale,
        maxZoom: conf.maxscale,
        fullscreenControl: false,
      });
      this.map = map; // set to global,以便全局取用
      map1 = this.map; // 地图刷新前，用于存储上次浏览的地点

      if (!place || !place.results) {
        if (this.props.query === '' || this.props.query === '-') {
          that.hideLoading();
        }
        return;
      }

      if (place.results !== 'undefined' && typeof (place.results) !== 'undefined') {
        place.results.sort((a, b) => b.hindex - a.hindex);
      } else {
        return true; //往下执行没有必要了
      }

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
        return new google.maps.Marker({
          position: location,
          label: {
            text: place.results[i].name,
            color: '#000000',
            fontSize: '12px',
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            fontStyle: 'italic',
            id: place.results[i].id, //id是自己设置的一个属性，用来放id的
          },
          icon: {
            url: '/images/map/marker_blue_sprite.png',
            size: new google.maps.Size(20, 70),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 25),
          },
          title: place.results[i].name,
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

      if (mapType === '1') {
        bigAreaConfig.map((ac) => {
          console.log(ac);
          return new google.maps.Marker({
            position: { lat: ac.y + 1.2, lng: ac.x + 2.5 },
            label: {
              text: ac.label,
              fontSize: '12px',
              fontStyle: 'italic',
              fontWeight: 'bold',
              color: 'red',
            },
            icon: { url: '/images/map/blank.png' },
            map,
          });
        });
      }
      const markerClusterer = new window.googleMap.MarkerClusterer(map, {});
      markerClusterer.addMarkers(markers);
      for (let m = 0; m < markers.length; m += 1) {
        that.addMouseoverHandler(map, markers[m], place.results[m].id);
      }
      checkCacheLevel(sysconfig.Map_Preload, ids);
      that.hideLoading();

      const count = markerClusterer.getTotalClusters();
      const clusters = markerClusterer.getClusters();
      console.log(clusters);
      // console.log(JSON.stringify(clusters));
      // console.log(JSON.parse(JSON.stringify(clusters)));
      // var originalLog = console.log
      // console.log=function(obj){
      //   originalLog(JSON.parse(JSON.stringify(clusters)))
      // }
      // const clusterInterval = window.setInterval(() => {
      //   console.log('$$$$$$$$$$$$$$$$$$');
      //   if (count !== 0) {
      //     console.log(count);
      //     window.clearInterval(clusterInterval);
      //   }
      // },200);
      // console.log(markerClusterer.getStyles());
      // console.log(markerClusterer.getTotalClusters());
      // console.log(markerClusterer.getClusters());
    });
  };

  showLoading = () => {
    this.setState({ loadingFlag: true });
  };

  hideLoading = () => {
    this.setState({ loadingFlag: false });
  };

  showTop = (usersIds, e, map, maindom, inputids, onLeave, projection) => {
    const { dispatch } = this.props;
    const type = 'google';
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
      this.listPersonDone(map, ids, projection);
    });
  };

  listPersonDone = (map, ids, projection) => {
    const imgwidth = 45;
    const type = 'google';
    const model = this.props && this.props.expertMap;

    const imgdivs = document.getElementsByName('scholarimg');
    if (imgdivs !== null && imgdivs.length !== 0) {
      showTopImages(ids, imgwidth, blankAvatar, imgdivs);
    }
    for (let j = 0; j < imgdivs.length; j += 1) {
      const cimg = imgdivs[j];
      cimg.addEventListener('mouseenter', (event) => {
        ifIn.pop();
        ifIn.push(true);
        addImageListener(map, ids, '', event, imgwidth, type, projection, globalInfoWindow, (data) => {
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
        ifIn.pop();
        ifIn.push(false);
        const imgInterval = setInterval(() => {
          const flag1 = isIn[isIn.length - 1];
          const flag2 = ifIn[ifIn.length - 1];
          if (!flag1 && !flag2) {
            globalInfoWindow.close();
            clearInterval(imgInterval);
          }
        }, 1000);
      });
    }
  };


  render() {
    const { dispatch } = this.props;
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
      global: () => (
        <RightInfoZoneAll count={count} avg={avg} persons={persons}
                          isACMFellowNumber={isACMFellowNumber}
                          isIeeeFellowNumber={isIeeeFellowNumber} isChNumber={isChNumber} />
      ),
      person: () => (<RightInfoZonePerson person={person} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };

    let isGlobal = false;
    if (model.rightInfoType === 'global') {
      isGlobal = true;
    }

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

            {
              !isGlobal && <div className={styles.backwell}>
                <div className={styles.back}>
                  <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.overview" />:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button size="small" onClick={backGlobal.bind(this, dispatch, model)}>
                    <FM defaultMessage="Baidu Map" id="com.expertMap.headerLine.label.goback" />
                  </Button>
                </div>
              </div>
            }

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

