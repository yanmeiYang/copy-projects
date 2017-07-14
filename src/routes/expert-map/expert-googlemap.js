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

        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
          });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

      }
    }, 100);
    console.log("run!!");
    console.log(mapinterval)

  }

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
    // const personInfo = model.personInfo;
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
