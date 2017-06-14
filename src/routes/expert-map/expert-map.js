/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import {connect} from 'dva';
import {Button} from 'antd';
import Script from 'react-load-script';
import styles from './expert-map.less';


class ExpertMap extends React.Component {
  /** 构造函数： 这里执行初始化*/
    // constructor(props) {
    //   super(props);
    // }

  state = {
    title: 'loading...',
    // resultsByYear: this.props && this.props.results,
    // resultsByCitation: [],
  };

  addClickHandler=(marker,personId)=>{
    const that=this;
    var sContent ="<div id='author_info' style='width: 350px;height: 120px;'></div>";
    var infoWindow = new BMap.InfoWindow(sContent);
    marker.addEventListener('mouseout',function (e) {


    })
    marker.addEventListener('mouseover',function (e) {
      this.openInfoWindow(infoWindow);
      if(document.getElementById("currentId").value!=personId){
        that.onLoadPersonCard(personId);
      }else{
        that.showexpertinfo();
      }
    })
  }

  componentDidMount() {
    this.setState({tite: 'DONE'});
    this.showmap();
  }

  showmap=()=>{
    var place = require('../../../external-docs/expert-map/expert-map-example1.json');
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 2);
    map.enableScrollWheelZoom();
    var markers = [];
    const that=this;
    var pId=[];
    for(var o in place.results){
      var pt = null;
      pt = new BMap.Point(place.results[o].location.lng, place.results[o].location.lat);
      var marker=new BMap.Marker(pt);
      var label=new BMap.Label("<div>"+place.results[o].name+"</div><div style='display: none;'>"+place.results[o].id+"</div>");
      label.setStyle({ color : "black", fontSize : "12px",border:"none"  });
      marker.setLabel(label);
      var personId=place.results[o].id;
      pId[o]=personId;
      markers.push(marker);
    }

    var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(cr);
    map.add
    var mapinterval=setInterval(function(){
      if (typeof(BMapLib) == "undefined"){
        console.log("wait for BMapLib")
      }else{
        clearInterval(mapinterval);
        var markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers});
        for(var m in markers){
          that.addClickHandler(markers[m],pId[m])
        }
      }
    },100);
  }

  componentDidUpdate(prevProps, prevState) {
    this.showexpertinfo();
  }

  showexpertinfo(){
    const model = this.props && this.props.expertMap;
    const personInfo = model.personInfo;
    document.getElementById("currentId").value=personInfo.id;
    var pos=""
    if(personInfo.pos==null || personInfo.pos==""){
      pos="null";
    }else if(personInfo.pos[0]==null || personInfo.pos[0]==""){
      pos="";
    }else{
      pos=personInfo.pos[0].n;
    }
    if(personInfo.name!=null){
      document.getElementById('author_info').innerHTML="<img style='float:left;margin:4px' id='imgDemo' src='http:"+personInfo.avatar+"' width='70' height='80'/>"
        +"<i class='fa fa-user' style='width: 20px;'> </i><a  target='_blank' href='https://cn.aminer.org/profile/"+personInfo.id+"'>"
        +personInfo.name+"</a><br /><strong style='color:#A52A2A;'><span style='font-style:italic'>h</span>-index:</strong>"
        +personInfo.indices.h_index+"<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Paper:  </strong>"
        +personInfo.indices.num_pubs+"<span style='color:grey;'>  |  </span><strong style='color:#A52A2A;'>#Citation:  </strong>"
        +personInfo.indices.num_citation+"<br /><i class='fa fa-mortar-board' style='width: 20px;'> </i>"
        +pos+"<br /><i class='fa fa-institution' style='width: 20px;'> </i>"+personInfo.aff.desc+"";
    }
  }

  handleScriptLoad() {
    console.log(this);
    console.log(this.refs.allmap, 'ref');
  }

  handleScriptError() {
    console.log('error');
  }

  onLoadPersonCard = (personId) => {
    this.props.dispatch({type: 'expertMap/getPersonInfo', payload: {personId}});
  }

  showtype=(e)=>{
    const typeid = e.target && e.target.getAttribute('data');
    var tli=document.getElementById("menu0").getElementsByTagName("li");
    var currentclass="";
    for(var i=0;i<tli.length;i++){
      if(tli[i].className!=""){
        currentclass=tli[i].className;
      }
    }
    for(var i=0;i<tli.length;i++){
      if(i==typeid){
        tli[i].className=currentclass;
      }else{
        tli[i].className="";
      }
    }
  }

  render() {
    const model = this.props && this.props.expertMap;
    const personInfo = model.personInfo;
    return (
      <div className={styles.expert_map}>
        <div className={styles.main1}>
          <div className={styles.lab1}><span>按照区域显示：</span></div>
          <div className={styles.tabs0} id="tabs0">
            <ul className={styles.menu0} id="menu0">
              <li onClick={this.showtype} data="0" className={styles.hover}>大区</li>
              <li onClick={this.showtype} data="1">国家</li>
              <li onClick={this.showtype} data="2">国内区</li>
              <li onClick={this.showtype} data="3">城市</li>
              <li onClick={this.showtype} data="4">机构</li>
            </ul>
          </div>
        </div>
        <div className="mapshow">
          <div id="allmap" style={{width: '100%', height: '800px'}}/>
          <div className="em_report" id="em_report">
            统计/报表
          </div>
          <input id="currentId" type="hidden"/>
          <input id="currentIds" type="hidden"/>
          <div id="info2" style={{width: 500, height: 300}}>
            <h1>测试区 {this.state.title}</h1>
            <div id="info1" style={{width: 300, height: 100, border: 'solid 1px red'}}>
              这是漂浮窗口
              {personInfo &&
              <div>
                <p>{personInfo.id}</p>
                <p>{personInfo.name}</p>
              </div>
              }
            </div>
            <a onClick={this.test}>Jie Tang</a>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({expertMap, loading}) => ({expertMap, loading}))(ExpertMap);
