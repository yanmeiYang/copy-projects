/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './expert-googlemap.less';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile-utils';
import { getById } from './utils/map-utils';
import GetGoogleMapLib from './utils/googleMapGai.js';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneCluster from './RightInfoZoneCluster';
import RightInfoZoneAll from './RightInfoZoneAll';
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

class ExpertGoogleMap extends React.Component {
  constructor(props) {
    super(props);
    this.showOverLay = GetGoogleMapLib(this.showTop);
  }
  componentDidMount() {
    this.callSearchMap(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    //console.log('compare: ', nextProps.query, ' == ', this.props.query)
    if (nextProps.query && nextProps.query !== this.props.query) {
      //console.log('call searchmap: ', nextProps.query);
      this.callSearchMap(nextProps.query);
    }
    if (nextProps.expertMap.geoData !== this.props.expertMap.geoData) {
      var typeid=0;
      this.showgooglemap(nextProps.expertMap.geoData,typeid);
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    this.syncInfoWindow();
  }

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

  handleScriptLoad() {
    console.log(this);
  }

  handleScriptError = () => {
    console.log('error');
  }

  showTop = (usersIds, e, map, maindom, inputids, onLeave) => {
    const that = this;
    const ishere = getById('panel');
    if (ishere != null) {
      //return;
      that.detachCluster(ishere);
    }
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;

    const oDiv = document.createElement('div');
    const ostyle = `height:${width}px;width:${width}px;left: ${e.x + 27 - (width / 2)}px;top: ${e.y +27 - (width / 2)}px;`;
    oDiv.setAttribute('id', 'panel');
    oDiv.setAttribute('style', ostyle);
    oDiv.setAttribute('class', 'roundImgContainer');

    insertAfter(oDiv, maindom);
    const thisNode = getById('panel');
    // 开始显示图片
    const ids = usersIds.slice(0, 8);

    const fenshu = (2 * Math.PI) / ids.length;// 共有多少份，每份的夹角
    for (let i = 0; i < ids.length; i += 1) {
      const centerX = Math.cos(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const centerY = Math.sin(fenshu * i) * (width / 2 - imgwidth / 2) + width / 2;
      const imgdiv = document.createElement('div');
      const cstyle = `height:${imgwidth}px;width:${imgwidth}px;left:${centerX - (imgwidth / 2)}px;top:${centerY - (imgwidth / 2)}px;`;
      imgdiv.setAttribute('name', 'scholarimg');
      imgdiv.setAttribute('style', cstyle);
      imgdiv.setAttribute('class', 'imgWrapper');
      imgdiv.innerHTML = `<img width='${imgwidth}' src='${blankAvatar}' alt='0'>`;
      insertAfter(imgdiv,thisNode);
      thisNode.appendChild(imgdiv);
      //imgdiv.addEventListener('click', () => that.toggleRightInfoBox(ids[i]), false);
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
    google.maps.event.addDomListener(imgdiv,'click', function( ) { // 集体的一个显示
      that.toggleRightInfo('cluster', inputids);
    });

    if (thisNode != null) { // 准备绑定事件
      const pthisNode = thisNode.parentNode;
      pthisNode.addEventListener('mouseleave', (event) => {
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
            let url = blankAvatar;
            if (personInfo.avatar != null && personInfo.avatar !== '') {
              url = profileUtils.getAvatar(personInfo.avatar, personInfo.id, 41);
            }
            cimg.innerHTML = `<img style='background: white;'  data='@@@@@@@${i}@@@@@@@' height='${imgwidth}' width='${imgwidth}' src='${url}' alt='${i}'>`;
          }
          for (let j = 0; j < imgdivs.length; j += 1) {
            const cimg = imgdivs[j];
            google.maps.event.addDomListener(cimg, 'mouseenter', function(event) {
              // get current point.
              const apos = getById('allmap').getBoundingClientRect();
              const cpos = event.target.getBoundingClientRect();
              const newPixel = new google.maps.Point(cpos.left - apos.left + imgwidth, cpos.top - apos.top); // eslint-disable-line
              // get personInfo data.
              //const currentPoint = that.getProjection().fromDivPixelToLatLng(newPixel);
              const chtml = event.target.innerHTML;
              let num = 0;
              if (chtml.split('@@@@@@@').length > 1) {
                num = chtml.split('@@@@@@@')[1];
              }
              const personInfo = data.data.persons[num];
              const myLatLng = new google.maps.LatLng({ lat: 47, lng: 112 });
              const infowindow = new google.maps.InfoWindow({
                content: "<div id='author_info' class='popup'></div>",
              });
              infowindow.setPosition(myLatLng);
              that.onSetPersonCard(personInfo);
              infowindow.open(map);
              that.syncInfoWindow();
            });
            // cimg.addEventListener('mouseleave', (event) => {
            //   map.closeInfoWindow();
            // });
          }
        }
      },
      () => {
        console.log('failed');
      },
    ).catch((error) => {
      //console.error(error);
    });
  };

  detachCluster = (clusterPanel) => {
    if (clusterPanel != null && clusterPanel.parentNode != null) {
      const imgdivs = document.getElementsByName('scholarimg');
      for (let i = 0; i < imgdivs.length;) {
        imgdivs[i].parentNode.removeChild(imgdivs[i]);
      }
      clusterPanel.parentNode.removeChild(clusterPanel);
    }
  }

  showtype = (e) => {
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid === 0) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 1) {
      //简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 2) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 3) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 4) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 5) {
      this.showmap(this.props.expertMap.geoData,typeid);
    }
  }
//Google Maps------------------------------------------------------------------------------------------------------------
  showgooglemap = (place,type) => {
    var counter = 0;
    const that = this;
    that.showOverLay();
    var mapinterval = setInterval(function () {
      if (typeof (google) === 'undefined') {
        console.log('wait for Google');
        counter++;
        if (counter > 200) {
          clearInterval(mapinterval);
          document.getElementById('allmap').innerHTML='Cannot connect to Google Map! Please check the network state!';
        }
      } else {
        clearInterval(mapinterval);
        const map = new google.maps.Map(document.getElementById('allmap'), {
          //center: { lat: 24.397, lng: 140.644 },
          center: { lat: 39.915, lng: 116.404 },
          zoom: 4,
          gestureHandling: 'greedy',
        });
        //this.map = map;
        let locations = [];
        for (var i = 0; i < place.results.length; i++) {
          const onepoint = { lat: place.results[i].location.lat, lng: place.results[i].location.lng }
          locations[i] = onepoint;
        }
        // const markers = [];
        // const pId = [];
        // let counts = 0;
        // for (const o in place.results) {
        //   const marker = new google.maps.Marker({
        //     position:{ lat: place.results[o].location.lat, lng: place.results[o].location.lng },
        //     map: map,
        //     label: {
        //       text: place.results[o].name,
        //       color: 'black',
        //       fontSize: '12px',
        //       border: 'none',
        //       backgroundColor: 'transparent',
        //       // opacity:0.4,
        //       fontWeight: 'bold',
        //       textAlign: 'center',
        //       width: '130px',
        //       textShadow: '1px 1px 2px white, -1px -1px 2px white',
        //       fontStyle: 'italic',
        //     },
        //     title: place.results[o].id,
        //   });
        //   const personId = place.results[o].id;
        //   pId[counts] = personId;
        //   markers.push(marker);
        //   counts += 1;
        // }
        const markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: {
              text: place.results[i].name,
              color: '#cc6613',
              fontSize: '12px',
              backgroundColor: 'transparent',
              fontWeight: 'bold',
              fontStyle: 'italic',
            },
            icon: {
              url: '/images/map/marker_red_sprite.png',
              //fillColor: 'red',
              size: new google.maps.Size(20, 70),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 25),
            },
            //labelText: place.results[i].name,
            //labelClass: 'labels',
            title: place.results[i].id,
          });
        });
        // Add a marker clusterer to manage the markers.
        const _ = new googleMap.MarkerClusterer(map, { markers });
        for (let m = 0; m < place.results.length; m += 1) {
          that.addMouseoverHandler(map, markers[m], place.results[m].id);
        }
      }
    }, 100);
  }

  syncInfoWindow = () => {
    // sync personInfo popup
    const ai = getById('author_info');
    const pi = getById('personInfo');
    if (ai && pi) {
      ai.innerHTML = pi.innerHTML;
    }
    // this.bindMouseScroll();
    // const model = this.props && this.props.expertMap;
    // const person = model.personInfo;
    // const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1 && model.infoZoneIds === person.id;
    // if (shouldRIZUpdate || model.infoZoneIds.indexOf(',') >= 0) {
    //   const rsz = getById('rightInfoZone');
    //   const flowInfo = getById('flowInfo');
    //   if (rsz && flowInfo) {
    //     flowInfo.innerHTML = rsz.innerHTML;
    //   }
    // }
  };

  // toggleRightInfoBox = (id) => {
  //   const state = getById('flowstate').value;
  //   const statistic = getById('statistic').value;
  //   this.getTipInfoBox();
  //   if (statistic !== id) { // 一般认为是第一次点击
  //     console.log("1----"+state)
  //     getById('flowstate').value = 1;
  //     this.getRightInfoBox();
  //     if (this.props.expertMap.infoZoneIds !== id) { // don't change
  //       if (id.indexOf(',') >= 0) { // is cluster
  //         const clusterIdList = id.split(',');
  //         this.props.dispatch({
  //           type: 'expertMap/listPersonByIds',
  //           payload: {ids: clusterIdList},
  //         });
  //       }
  //       this.props.dispatch({type: 'expertMap/setRightInfoZoneIds', payload: {idString: id}});
  //     }
  //     this.syncInfoWindow();
  //   } else if (state === 1) { // 偶数次点击同一个对象
  //     // 认为是第二次及其以上点击
  //     console.log("2----"+state)
  //     getById('flowstate').value = 0;
  //     getById('flowInfo').style.display = 'none';
  //   } else { // 奇数次点击同一个对象
  //     console.log("3-----"+state)
  //     getById('flowstate').value = 1;
  //     getById('flowInfo').style.display = '';
  //   }
  //
  //   getById('statistic').value = id;
  // };

  addMouseoverHandler = (map, marker, personId) => {
    const that = this;
    const infoWindow = new google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>"
    });
    google.maps.event.addListener(marker, 'mouseover', function(e) {
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

    google.maps.event.addListener(marker,'mouseout', function (e) {
      infoWindow.close(map,marker);
    });
    google.maps.event.addListener(marker,'click', function (e) {
      //that.toggleRightInfoBox(personId);
      that.toggleRightInfo('person', personId);
    });
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

  callSearchMap(query) {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

  onChangeBaiduMap = () => {
    // TODO don't change page, use dispatch.
    localStorage.setItem("maptype","baidu");
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

  goto=() => {
    const href = window.location.href;
    window.location.href = href.replace('expert-googlemap', 'expert-map');
  }

  reload=() => {
    const href = window.location.href;
    window.location.href = href;
  }
//page-------------------------------------------------------------------------------------------------------------------
  render() {
    const model = this.props && this.props.expertMap;
    const persons = model.geoData.results;
    let count = 0;
    let hIndexSum = 0;
    if (persons) {
      persons.map((person1) => {
        hIndexSum += person1.hindex;
        count += 1;
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

    // right info
    // const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1
    //   && model.infoZoneIds === person.id;
    // const shouldRIZClusterUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') > 0;

    const rightInfos = {
      global: () => (
        <RightInfoZoneAll count={count} hIndexSum={hIndexSum} avg={avg} persons={persons} />
      ),
      person: () => (<RightInfoZonePerson person={model.personInfo} />),
      cluster: () => (<RightInfoZoneCluster persons={model.clusterPersons} />),
    };
    return (
      <div className={styles.expertMap} id="currentMain">

        <div className={styles.headerLine}>
          <div className="left">{this.props.title}</div>

          <div className={styles.scopes}>
            <span>按照层级显示：</span>
            <ButtonGroup id="sType">
              <Button onClick={this.showType} value="0">自动</Button>
              <Button onClick={this.showType} value="1">大区</Button>
              <Button onClick={this.showType} value="2">国家</Button>
              <Button onClick={this.showType} value="3" style={{ display: 'none' }}>国内区</Button>
              <Button onClick={this.showType} value="4">城市</Button>
              <Button onClick={this.showType} value="5">机构</Button>
            </ButtonGroup>

            <div className={styles.switch} >
              <ButtonGroup id="diffmaps">
                <Button onClick={this.onChangeBaiduMap}>Baidu Map</Button>
                <Button type="primary" onClick={this.onChangeGoogleMap}>Google Map</Button>
              </ButtonGroup>
            </div>

          </div>
        </div>

        <div className={styles.map}>

          <div id="allmap" />

          <div className={styles.right}>
            <div className={styles.legend}>
              <div className={styles.title}>Legend:</div>
              <div className={styles.t}>
                <img className={styles.icon} width="42" src="/images/map/marker_red_sprite.png"
                     alt="legend" />
                <div className={styles.t}>专家</div>
                <img className={styles.icon2} width="32" src="/images/map/m0.png" alt="legend" />
                <div className={styles.t}>一组专家</div>
              </div>
              <div className={styles.container}>
                <div className={styles.text}> 少</div>
                <div className={styles.item1}> 1</div>
                <div className={styles.item2}> 2</div>
                <div className={styles.item3}> 3</div>
                <div className={styles.item4}> 4</div>
                <div className={styles.item5}> 5</div>
                <div className={styles.text}> 多</div>
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

        <div className="em_report" id="em_report">统计/报表</div>

        {/* TODO what's this for? */}
        <input id="currentId" type="hidden" />
        <input id="currentIds" type="hidden" />
        <input id="statistic" type="hidden" value="0" />
        <input id="flowstate" type="hidden" value="0" />

      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertGoogleMap);
