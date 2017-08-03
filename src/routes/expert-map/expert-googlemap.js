/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './expert-googlemap.less';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile_utils';
import { findPosition, getById } from './utils/map-utils';
import GetGoogleMapLib from './utils/googleMapGai.js';
import mapData from '../../../external-docs/expert-map/expert-map-example2.json';
import RightInfoZonePerson from './RightInfoZonePerson';
import RightInfoZoneCluster from './RightInfoZoneCluster';
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

  callSearchMap(query, callback) {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

  handleScriptLoad() {
    console.log(this);
  }

  handleScriptError() {
    console.log('error');
  }

  showTop = (usersIds, e, map, maindom, inputids) => {
    const that = this;
    const ishere = getById('panel');
    if (ishere != null) {
      return;
    }
    const width = 180;
    // 可得中心点到图像中心点的半径为：width/2-imgwidth/2,圆形的方程为(X-pixel.x)^2+(Y-pixel.y)^2=width/2
    const imgwidth = 45;

    const oDiv = document.createElement('div');
    const ostyle = `height:${width}px;width:${width}px;left: ${e.x + 23 - (width / 2)}px;top: ${e.y +23 - (width / 2)}px;`;
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
      imgdiv.addEventListener('click', () => that.toggleRightInfoBox(ids[i]), false);
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
    google.maps.event.addDomListener(imgdiv,'click', function(event) { // 集体的一个显示
      that.toggleRightInfoBox(inputids);
    });

    if (thisNode != null) { // 准备绑定事件
      const pthisNode = thisNode.parentNode;
      google.maps.event.addDomListener(pthisNode, 'mouseleave', function(event) {
        if (thisNode != null && thisNode.parentNode != null) {
          const imgdivs = document.getElementsByName('scholarimg');
          for (let i = 0; i < imgdivs.length;) {
            imgdivs[i].parentNode.removeChild(imgdivs[i]);
          }
          thisNode.parentNode.removeChild(thisNode);
        }
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
              const apos = getById('map').getBoundingClientRect();
              const cpos = event.target.getBoundingClientRect();
              const newPixel = new google.maps.Point(cpos.left - apos.left + imgwidth, cpos.top - apos.top); // eslint-disable-line

              // get personInfo data.
              const chtml = event.target.innerHTML;
              let num = 0;
              if (chtml.split('@@@@@@@').length > 1) {
                num = chtml.split('@@@@@@@')[1];
              }
              const personInfo = data.data.persons[num];
              const myLatLng = new google.maps.LatLng({lat: 47, lng:112});
              const infowindow = new google.maps.InfoWindow({
                content: "<div class='popup'>oooooooooooo</div>"
              });
              infowindow.setPosition(myLatLng);
              that.onSetPersonCard(personInfo);
              //infowindow.open(map);
              //that.syncInfoWindow();

              //that.currentPersonId = personInfo.id;
            });
            //google.maps.event.addDomListener(cimg, 'mouseleave', function(event) {
              //map.closeInfoWindow();
            //});
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

  showtype = (e) => {
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid === 0) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid === 1) {
      //简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showmap(mapData,typeid);
    } else if (typeid === 2) {
      this.showmap(mapData,typeid);
    } else if (typeid === 3) {
      this.showmap(mapData,typeid);
    } else if (typeid === 4) {
      this.showmap(mapData,typeid);
    } else if (typeid === 5) {
      this.showmap(mapData,typeid);
    }
  }
//Google Maps------------------------------------------------------------------------------------------------------------
  showgooglemap = (place,type) => {
    var counter=0;
    const that=this;
    that.showOverLay();
    var mapinterval = setInterval(function () {
      if (typeof(google) == "undefined") {
        console.log("wait for Google");
        counter++;
        if(counter>200){
          clearInterval(mapinterval);
          document.getElementById("map").innerHTML="Cannot connect to Google Map! Please check the network state!";
        }
      } else {
        clearInterval(mapinterval);
        const map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 24.397, lng: 140.644},
          zoom: 3
        });
        this.map = map;

        var locations=[];
        for (var i = 0; i < place.results.length; i++) {
          var onepoint={lat:place.results[i].location.lat,lng:place.results[i].location.lng}
          locations[i]=onepoint;
        }
        const markers = [];
        const pId= [] ;
        let counts = 0;
        for(const o in place.results){
          const newplace = findPosition(type, place.results[o]);
          if ((newplace[1] != null && newplace[1] != null) &&
            (newplace[1] !== 0 && newplace[1] !== 0)) {
            const marker = new google.maps.Marker({
              position:{lat:place.results[o].location.lat,lng:place.results[o].location.lng},
              map: map,
              label: {
                text: place.results[o].id,
                color: 'transparent',
                fontSize: '12px',
                border: 'none',
                backgroundColor: 'transparent',
                // opacity:0.4,
                fontWeight: 'bold',
                textAlign: 'center',
                width: '130px',
                textShadow: '1px 1px 2px white, -1px -1px 2px white',
                fontStyle: 'italic',
              },
            });


            const personId = place.results[o].id;
            pId[counts] = personId;
            markers.push(marker);
            counts += 1;
          }
        }
        // Add a marker clusterer to manage the markers.
        const _ = new googleMap.MarkerClusterer(map, { markers });
        for (let m = 0; m < pId.length; m += 1) {
          that.addMouseoverHandler(map,markers[m], pId[m]);
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
    const model = this.props && this.props.expertMap;
    const person = model.personInfo;
    const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1 && model.infoZoneIds === person.id;
    if (shouldRIZUpdate || model.infoZoneIds.indexOf(',') >= 0) {
      const rsz = getById('rightInfoZone');
      const flowInfo = getById('flowInfo');
      if (rsz && flowInfo) {
        flowInfo.innerHTML = rsz.innerHTML;
      }
    }
  };

  toggleRightInfoBox = (id) => {
    const state = getById('flowstate').value;
    const statistic = getById('statistic').value;
    this.getTipInfoBox();
    if (statistic !== id) { // 一般认为是第一次点击
      getById('flowstate').value = 1;
      this.getRightInfoBox();
      this.syncInfoWindow();
      if (this.props.expertMap.infoZoneIds !== id) { // don't change
        if (id.indexOf(',') >= 0) { // is cluster
          const clusterIdList = id.split(',');
          this.props.dispatch({
            type: 'expertMap/listPersonByIds',
            payload: {ids: clusterIdList},
          });
        }
        this.props.dispatch({type: 'expertMap/setRightInfoZoneIds', payload: {idString: id}});
      }
      //this.syncInfoWindow();
    } else if (state === 1) { // 偶数次点击同一个对象
      // 认为是第二次及其以上点击
      getById('flowstate').value = 0;
      getById('flowInfo').style.display = 'none';
    } else { // 奇数次点击同一个对象
      getById('flowstate').value = 1;
      getById('flowInfo').style.display = '';
    }

    getById('statistic').value = id;
    console.log(getById('statistic').value)
  };

  addMouseoverHandler = (map, marker, personId) => {
    const that = this;
    const infoWindow = new google.maps.InfoWindow({
      content: "<div id='author_info' class='popup'></div>"
    });
    google.maps.event.addListener(marker, 'mouseover', function (e) {
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
      that.toggleRightInfoBox(personId);
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

  onSetPersonCard = (personInfo) => {
    this.props.dispatch({
      type: 'expertMap/getPersonInfoSuccess',
      payload: { data: { data: personInfo } },
    });
  };

  onLoadPersonCard = (personId) => {
    this.props.dispatch({type: 'expertMap/getPersonInfo', payload: {personId}});
  };

  onResetPersonCard = () => {
    this.props.dispatch({type: 'expertMap/resetPersonInfo'});
  };

  goto=()=>{
    var href=window.location.href;
    window.location.href=href.replace("expert-googlemap","expert-map");
  }

  reload=()=>{
    var href=window.location.href;
    window.location.href=href;
  }
//page-------------------------------------------------------------------------------------------------------------------
  render() {
    const model = this.props && this.props.expertMap;
    const person = model.personInfo;

    let personPopupJsx;
    if (person) {
      const url = profileUtils.getAvatar(person.avatar, person.id, 50);
      const name = profileUtils.displayNameCNFirst(person.name, person.name_zh);
      const pos = profileUtils.displayPositionFirst(person.pos);
      const aff = profileUtils.displayAff(person);
      const hindex = person && person.indices && person.indices.h_index;

      personPopupJsx = (
        <div className="personInfo">
          <div><img className="img" src={url} alt="IMG"/></div>
          <div className="info">
            <div className="nameLine">
              <div className="right">H-index:<b> {hindex}</b>
              </div>
              <div className="name">{name}</div>
            </div>
            {pos && <span><i className="fa fa-briefcase fa-fw"/>{pos}</span>}
            {aff && <span><i className="fa fa-institution fa-fw"/>{aff}</span>}
          </div>
        </div>
      );
    }

    // right info
    const shouldRIZUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') === -1 && model.infoZoneIds === person.id;
    const shouldRIZClusterUpdate = model.infoZoneIds && model.infoZoneIds.indexOf(',') > 0;
    const clusterPersons = model.clusterPersons;

    return (
      <div className={styles.expert_map} id="currentmain">
        <div className={styles.main1}>
          <div className={styles.lab1}><span>按照层级显示：</span></div>
          <div>
            <ButtonGroup id="sType">
              <Button onClick={this.showtype} value="0">自动</Button>
              <Button onClick={this.showtype} value="1">大区</Button>
              <Button onClick={this.showtype} value="2">国家</Button>
              <Button onClick={this.showtype} value="3">国内区</Button>
              <Button onClick={this.showtype} value="4">城市</Button>
              <Button onClick={this.showtype} value="5">机构</Button>
            </ButtonGroup>
            <div className={styles.switch}>
              <ButtonGroup id="diffmaps">
                <Button type="primary" onClick={this.goto}>Baidu Map</Button>
                <Button  onClick={this.reload}>Google Map</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
        <div className="mapshow">
          <div id="map" style={{ width: '100%', height: '800px' }} />
          <div className="em_report" id="em_report">
            统计/报表
          </div>
          <input id="currentId" type="hidden" />
          <input id="currentIds" type="hidden" />
          <input id="statistic" type="hidden" value="0" />
          <input id="flowstate" type="hidden" value="0" />
        </div>

        <div className={styles.main2} id="rank">
          <div className={styles.main3}>
            <div className="custom-image">
              <img width="17%" src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m0.png" />
              <img width="17%" src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m1.png" />
              <img width="17%" src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m2.png" />
              <img width="17%" src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m3.png" />
              <img width="17%" src="http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m4.png" />
            </div>
          </div>
          <div className="custom-image">
            <img src="/images/arrow.png" />
          </div>
          <div className={styles.lab2}>人数增加</div>
          <div className={styles.main3}>
            <div className="custom-image">
              <img src="/images/personsNumber.png"/>
              <div className={styles.lab3}><p>该区域学者人数</p>该学者所在位置</div>
            </div>
          </div>
        </div>

        <div id="personInfo" style={{ display: 'none' }} >
          {personPopupJsx && personPopupJsx}
        </div>

        <div id="rightInfoZone" style={{ display: 'none' }} >
          <div className="rightInfoZone">

            {shouldRIZUpdate && <RightInfoZonePerson person={model.personInfo} /> }
            {shouldRIZClusterUpdate && <RightInfoZoneCluster persons={clusterPersons} />}

          </div>
        </div>

      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertGoogleMap);
