/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Tag } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classnames from 'classnames';
import { routerRedux } from 'dva/router';
import styles from './expert-googlemap.less';
import { sysconfig } from '../../systems';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile-utils';
import { findPosition, getById } from './utils/map-utils';
import GetGoogleMapLib from './utils/googleMapGai.js';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZoneAll from './RightInfoZoneAll';

const ButtonGroup = Button.Group;
const { CheckableTag } = Tag;
const blankAvatar = '/images/blank_avatar.jpg';
let map1;
let number = '0';
let range = '0';
const domainIds = [];
const domainChecks = [];
function insertAfter(newElement, targetElement) {
  const parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}

class ExpertGoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.showOverLay = GetGoogleMapLib(this.showTop);
    localStorage.setItem('lastgoogletype', '0');
    localStorage.setItem('googletype', '0');
  }

  state = {
    typeIndex: 0,
    rangeChecks: [true, false, false, false],
    numberChecks: [true, false, false, false, false],
  };

  componentDidMount() {
    this.callSearchMap(this.props.query);
    localStorage.setItem('lastgoogletype', '0');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query && nextProps.query !== this.props.query) {
      this.callSearchMap(nextProps.query);
    }
    if (nextProps.expertMap.geoData !== this.props.expertMap.geoData) {
      const typeid = 0;
      this.showgooglemap(nextProps.expertMap.geoData, typeid);
    }
    return true;
  }

  componentDidUpdate() {
    this.syncInfoWindow();
  }

  onChangeBaiduMap = () => {
    localStorage.setItem('maptype', 'baidu');
    const href = window.location.href;
    window.location.href = href.replace('expert-googlemap', 'expert-map');
  };

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

  handleScriptError = () => {
    console.log('error');
  };

  addMouseoverHandler = (map, marker, personId) => {
    const that = this;
    const infoWindow = new window.google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>",
    });
    window.google.maps.event.addListener(marker, 'mouseover', () => {
      if (that.currentPersonId !== personId) {
        that.onResetPersonCard();
        that.onLoadPersonCard(personId);
        infoWindow.open(map, marker);
        that.syncInfoWindow();
      } else {
        infoWindow.open(map, marker);
        that.syncInfoWindow();
      }
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

  showgooglemap = (place, type) => {
    let counter = 0;
    const that = this;
    that.showOverLay();
    const mapinterval = setInterval(function () {
      if (typeof (window.google) === 'undefined') {
        console.log('wait for Google');
        counter += 1;
        if (counter > 200) {
          clearInterval(mapinterval);
          document.getElementById('allmap').innerHTML = 'Cannot connect to Google Map! Please check the network state!';
        }
      } else {
        clearInterval(mapinterval);
        let mapCenter = { lat: sysconfig.CentralPosition.lat, lng: sysconfig.CentralPosition.lng };
        let scale = 3;
        let minscale = 1;
        let maxscale = 19;
        let newtype;
        if (localStorage.getItem('lastgoogletype') !== '0' && localStorage.getItem('isgoogleClick') === '0') {
          newtype = localStorage.getItem('lastgoogletype');
        } else {
          newtype = type;
        }
        if (newtype === '0') {
          scale = 3;
          minscale = 3;
        } else if (newtype === '1' || newtype === '2' || newtype === '3') {
          scale = 3;
          minscale = 3;
          maxscale = 4;
        } else if (newtype === '4' || newtype === '5') {
          scale = 6;
          minscale = 6;
          maxscale = 7;
        }
        if (map1) {
          mapCenter = map1.getCenter();
        }
        localStorage.setItem('lastgoogletype', newtype);
        const map = new window.google.maps.Map(document.getElementById('allmap'), {
          center: mapCenter,
          zoom: scale,
          gestureHandling: 'greedy',
          minZoom: minscale,
          maxZoom: maxscale,
        });

        this.map = map; // set to global;
        map1 = this.map;
        const locations = [];
        const newTypeString = String(newtype);
        let newPlaceResults = [];
        if (range === '0') {
          newPlaceResults = place.results;
        } else if (range === '1') {
          place.results.map((placeResult) => {
            if (placeResult.fellows[0] && placeResult.fellows[0] === 'acm') {
              newPlaceResults.push(placeResult);
            }
            return true;
          });
        } else if (range === '2') {
          place.results.map((placeResult) => {
            if (placeResult.fellows[0] === 'ieee' || placeResult.fellows[1] === 'ieee') {
              newPlaceResults.push(placeResult);
            }
            return true;
          });
        } else if (range === '3') {
          place.results.map((placeResult) => {
            if (placeResult.is_ch) {
              newPlaceResults.push(placeResult);
            }
            return true;
          });
        }
        newPlaceResults.sort((a, b) => b.hindex - a.hindex);
        let j = 0;
        for (const n of newPlaceResults) {
          const newplace = findPosition(newTypeString, n);
          const onepoint = { lat: newplace[0], lng: newplace[1] };
          locations[j] = onepoint;
          j += 1;
        }
        let markers = locations.map((location, i) => {
          return new window.google.maps.Marker({
            position: location,
            label: {
              text: newPlaceResults[i].name,
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
            title: newPlaceResults[i].id,
          });
        });
        if (number === '0') {
          markers = markers.slice(0, 200);
        } else if (number === '1') {
          markers = markers.slice(0, 50);
        } else if (number === '2') {
          markers = markers.slice(0, 100);
        } else if (number === '3') {
          markers = markers.slice(0, 500);
        }
        const beaches = [
          ['东部', 38.9071923, -77.0368707],
          ['美国中部', 39.8027644, -105.0874842],
          ['西部', 38.4087993, -121.3716178],
          ['加拿大', 62, -105.712891],
          ['拉丁美洲', 4.570868, -74.297333],
          ['大洋洲', -25.274398, 133.775136],
          ['以色列', 31.046051, 34.851612],
          ['俄罗斯', 63, 105.318756],
          ['英国', 57.378051, -3.435973],
          ['北欧', 62, 18.643501],
          ['中国', 39.90419989999999, 116.4073963],
          ['台湾', 25.0329694, 121.5654177],
          ['韩国', 35.907757, 127.766922],
          ['日本', 36.204824, 138.252924],
          ['香港', 22.396428, 114.109497],
          ['新加坡', 1.352083, 103.819836],
          ['东南亚', 12.879721, 121.774017],
          ['中亚', 48.019573, 66.923684],
          ['印度', 20.593684, 78.96288],
          ['东欧', 48.379433, 31.16558],
          ['西欧', 48.7468939, 9.0805141],
        ];
        if (localStorage.getItem('googletype') === '1') {
          beaches.map((beach) => {
            return new window.google.maps.Marker({
              position: { lat: beach[1] - 6, lng: beach[2] },
              label: { text: beach[0], fontSize: '12px', fontStyle: 'italic', fontWeight: 'bold' },
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
      }
    }, 100);
  };

  showType = (e) => {
    localStorage.setItem('isgoogleClick', '1');
    localStorage.setItem('googletype', '0');
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid === '0') {
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '1') {
      localStorage.setItem('googletype', '1');
      //简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '2') {
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '3') {
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '4') {
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    } else if (typeid === '5') {
      this.showgooglemap(this.props.expertMap.geoData, typeid);
    }
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

  showTop = (usersIds, e, map, maindom, inputids, onLeave) => {
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
    // 开始显示图片
    const ids = usersIds.slice(0, 8);

    const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
    for (let i = 0; i < ids.length; i += 1) {
      const centerX = (Math.cos(fenshu * i) * ((width / 2) - (imgwidth / 2))) + (width / 2);
      const centerY = (Math.sin(fenshu * i) * ((width / 2) - (imgwidth / 2))) + (width / 2);
      const imgdiv = document.createElement('div');
      const cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
      imgdiv.setAttribute('name', 'scholarimg');
      imgdiv.setAttribute('style', cstyle);
      imgdiv.setAttribute('class', 'imgWrapper');
      imgdiv.innerHTML = `<img width='${imgwidth}' src='${blankAvatar}' alt='0'>`;
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

    const resultPromise = listPersonByIds(ids);

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
              console.log("####################");
              const apos = getById('allmap').getBoundingClientRect();
              const cpos = event.target.getBoundingClientRect();
              const newPixel = new window.google.maps.Point(cpos.left - apos.left + imgwidth, cpos.top - apos.top); // eslint-disable-line
              const chtml = event.target.innerHTML;
              let num = 0;
              if (chtml.split('@@@@@@@').length > 1) {
                num = chtml.split('@@@@@@@')[1];
              }
              const personInfo = data.data.persons[num];
              const myLatLng = new window.google.maps.LatLng({ lat: 47, lng: 112 });
              const infowindow = new window.google.maps.InfoWindow({
                content: "<div id='author_info' class='popup'></div>",
              });
              infowindow.setPosition(myLatLng);
              that.onSetPersonCard(personInfo);
              infowindow.open(map);
              that.syncInfoWindow();
            });
            cimg.addEventListener('mouseleave', () => {
              map.closeInfoWindow();
            });
          }
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      console.error(error);
    });
  };

  handleScriptLoad() {
    console.log(this);
  }

  toggleRightInfo = (type, id) => {
    // TODO cache it.
    if (this.props.expertMap.infoZoneIds !== id) { // don't change
      if (id.indexOf(',') >= 0) { // is cluster
        const clusterIdList = id.split(',');
        console.log(clusterIdList.length);
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

  showNumber = (numberTmp) => {
    const that = this;
    const arr = [false, false, false, false, false];
    arr[numberTmp] = true;
    that.setState({ numberChecks: arr });
    const lastType = localStorage.getItem('lasttype');
    if (numberTmp) {
      number = numberTmp;
      that.showgooglemap(this.props.expertMap.geoData, lastType, range, number);
    }
  };

  showRange = (rangeTmp) => {
    const lastType = localStorage.getItem('lasttype');
    const that = this;
    const arr = [false, false, false, false];
    arr[rangeTmp] = true;
    that.setState({ rangeChecks: arr });
    if (rangeTmp) {
      range = rangeTmp;
      this.showgooglemap(this.props.expertMap.geoData, lastType, range, number);
    }
  };

  domainChanged = (value) => {
    this.props.dispatch(routerRedux.push({ pathname: '/expert-googlemap', search: `?query=${value.name}` }));
    let i = 0;
    domainIds.map((domain1) => {
      domainChecks[i] = value.id === domain1;
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
    const person = model.personInfo;
    if (person) {
      const url = profileUtils.getAvatar(person.avatar, person.id, 90);
      const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      const pos = profileUtils.displayPosition(person.pos);
      const aff = profileUtils.displayAff(person);
      const hindex = person && person.indices && person.indices.h_index;

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

    const rightInfos = {
      global: () => (
        <RightInfoZoneAll count={count} avg={avg} persons={persons}
                          isACMFellowNumber={isACMFellowNumber}
                          isIeeeFellowNumber={isIeeeFellowNumber} isChNumber={isChNumber} />
      ),
      person: () => (<RightInfoZonePerson person={model.personInfo} />),
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
        domainChecks[m] = domain1.name === this.props.query;
        m += 1;
        return true;
      });
    }
    return (
      <div className={styles.expertMap} id="currentMain">
        <div className={styles.filterWrap}>
          <div className={styles.filter}>
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}><span>Hot words:</span></span>
              <ul>
                {Domains.map((domain) => {
                  checkState += 1;
                  return (<CheckableTag className={styles.filterItem} key={domain.id}
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
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[1]}>
                  <span role="presentation" onClick={this.showRange.bind(that, '1')}>ACM Fellow</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[2]}>
                  <span role="presentation" onClick={this.showRange.bind(that, '2')}>IEEE Fellow</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.rangeChecks[3]}>
                  <span role="presentation" onClick={this.showRange.bind(that, '3')}>华人</span>
                </CheckableTag>
              </ul>
            </div>
            <div className={styles.filterRow}>
              <span className={styles.filterTitle}><span>H-index:</span></span>
              <ul>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[4]}>
                  <span role="presentation" onClick={this.showNumber.bind(that, '4')}>ALL</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[3]}>
                  <span role="presentation" onClick={this.showNumber.bind(that, '3')}>TOP500</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[0]}>
                  <span role="presentation" onClick={this.showNumber.bind(that, '0')}>TOP200</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[2]}>
                  <span role="presentation" onClick={this.showNumber.bind(that, '2')}>TOP100</span>
                </CheckableTag>
                <CheckableTag className={styles.filterItem} checked={that.state.numberChecks[1]}>
                  <span role="presentation" onClick={this.showNumber.bind(that, '1')}>TOP50</span>
                </CheckableTag>
              </ul>
            </div>
          </div>
        </div>
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
                <Button onClick={this.onChangeBaiduMap}>
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.baiduMap" />
                </Button>
                <Button type="primary" onClick={this.onChangeGoogleMap}>
                  <FM defaultMessage="Baidu Map"
                      id="com.expertMap.headerLine.label.googleMap" />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className={styles.map}>
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

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertGoogleMap);
