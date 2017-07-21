/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'antd';
import styles from './expert-googlemap.less';
import { listPersonByIds } from '../../services/person';
import * as profileUtils from '../../utils/profile_utils';


const ButtonGroup = Button.Group;

let globalInfoWindow;
const getInfoWindow = () => {
  if (!globalInfoWindow) {
    const sContent = "<div id='author_info' class='popup'></div>";
    globalInfoWindow = new BMap.InfoWindow(sContent);
    globalInfoWindow.disableAutoPan();
  }
  return globalInfoWindow;
};

class ExpertGoogleMap extends React.Component {
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

  callSearchMap(query, callback) {
    this.props.dispatch({ type: 'expertMap/searchMap', payload: { query } });
  }

  handleScriptLoad() {
    console.log(this);
  }

  handleScriptError() {
    console.log('error');
  }

  onLoadPersonCard = (personId) => {
    this.props.dispatch({ type: 'expertMap/getPersonInfo', payload: { personId } });
  }

  showtype = (e) => {
    const typeid = e.currentTarget && e.currentTarget.value && e.currentTarget.getAttribute('value');
    if (typeid == 0) {
      this.showmap(this.props.expertMap.geoData,typeid);
    } else if (typeid == 1) {
      //简单地读取其城市大区等信息，然后归一到一个地址，然后在地图上显示
      this.showmap(mapData,typeid);
    } else if (typeid == 2) {
      this.showmap(mapData,typeid);
    } else if (typeid == 3) {
      this.showmap(mapData,typeid);
    } else if (typeid == 4) {
      this.showmap(mapData,typeid);
    } else if (typeid == 5) {
      this.showmap(mapData,typeid);
    }
  }
//Google Maps------------------------------------------------------------------------------------------------------------
  showgooglemap = (place,type) => {
    var counter=0;
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
        var map;
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 24.397, lng: 140.644},
          zoom: 3
        });
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var locations=[];
        for (var i = 0; i < place.results.length; i++) {
          var onepoint={lat:place.results[i].location.lat,lng:place.results[i].location.lng}
          locations[i]=onepoint;
          /*     console.log(place.results[i].location.lat+" "+place.results[i].location.lng)
           var latLng = new google.maps.LatLng(place.results[i].location.lat,place.results[i].location.lng);
           var marker = new google.maps.Marker({
           position: latLng,
           map: map
           });*/
        }
        const pId = [];
        var markers = locations.map(function(location, i) {
          var marker;
          marker=new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          });
          var content = "Number: " + i +  '</h3>'
          var infowindow = new google.maps.InfoWindow()
          console.log(marker)
          /*google.maps.event.addListener(marker,'click', (function(marker,content,infowindow) {
            return function() {
              infowindow.setContent(content);
              infowindow.open(map,marker);
            };
          })(marker,content,infowindow));*/
          return marker;
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        for(var i=0;i<markers.length;i++){
          //console.log(markers[i])
        }
      }
    }, 100);
    console.log("run!!");
    console.log(mapinterval)

  }

  addMouseoverHandler = (marker, personId) => {
    const infoWindow = getInfoWindow();
    marker.addEventListener('mouseover', (e) => {
      e.target.openInfoWindow(infoWindow);
      this.syncInfoWindow();
      this.currentPersonId = personId;
    });
  }

  syncInfoWindow = () => {
    // sync personInfo popup
    const ai = getById('author_info');
    const pi = getById('personInfo');
    if (ai && pi) {
      ai.innerHTML = pi.innerHTML;
    }
  }

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
      console.log(name)
      const pos = profileUtils.displayPositionFirst(person.pos);
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
      </div>
    );
  }
}

export default connect(({ expertMap, loading }) => ({ expertMap, loading }))(ExpertGoogleMap);
