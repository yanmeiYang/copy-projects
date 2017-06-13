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
    var a=this.props.dispatch({type: 'expertMap/getPersonInfo', payload: {personId}});
    console.log(a)
    var sContent =
      "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" +
      "<img style='float:right;margin:4px' id='imgDemo' src='http://wiki.lbsyun.baidu.com/cms/logo/lbsyunlogo296-120.png?logo2017' width='139' height='104' title='天安门'/>" +
      "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" +
      a.expertMap.name+"</div>";
    marker.addEventListener('mouseover',function (e) {
      var infoWindow = new BMap.InfoWindow(sContent);
      this.openInfoWindow(infoWindow);
      document.getElementById('imgDemo').onload = function (){
        infoWindow.redraw();
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
    for(var o in place.results){
      var pt = null;
      pt = new BMap.Point(place.results[o].location.lng, place.results[o].location.lat);
      var marker=new BMap.Marker(pt);
      var personId=place.results[o].id;
      this.addClickHandler(marker,personId)
      markers.push(marker);
    }

    var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});
    map.addControl(cr);
    var mapinterval=setInterval(function(){
      if (typeof(BMapLib) == "undefined"){
        console.log("wait for BMapLib")
      }else{
        clearInterval(mapinterval);
        var markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers});
      }
    },100);
  }

  componentDidUpdate(prevProps, prevState) {

  }

  handleScriptLoad() {
    console.log(this);
    console.log(this.refs.allmap, 'ref');
  }

  handleScriptError() {
    console.log('error');
  }

  onLoadPersonCard = (e) => {
    const personId = e.target && e.target.getAttribute('data');
    this.props.dispatch({type: 'expertMap/getPersonInfo', payload: {personId}});
  }

  showtype=(e)=>{
    const typeid = e.target && e.target.getAttribute('data');
    var tli=document.getElementById("menu0").getElementsByTagName("li");
    //alert(document.getElementById("tabs0").className);
    var currentclass=""
    for(var i=0;i<tli.length;i++){
      if(tli[i].className!=""){
        currentclass=tli[i].className
      }
    }
    for(var i=0;i<tli.length;i++){
      if(i==typeid){
        tli[i].className=currentclass
      }else{
        tli[i].className=""
      }
    }
  }

  render() {
    console.log(this.props);
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
          <div className="em_report">
            统计/报表
          </div>
          <div style={{width: 500, height: 300}}>
            <h1>测试区 {this.state.title}</h1>
            <div style={{width: 300, height: 100, border: 'solid 1px red'}}>
              这是漂浮窗口
              {personInfo &&
              <div>
                <p>{personInfo.id}</p>
                <p>{personInfo.name}</p>
              </div>
              }
            </div>
            <a onClick={this.onLoadPersonCard} data="54088138dabfae8faa649e53">Lawrence Page</a> /
            <a onClick={this.onLoadPersonCard} data="53f46a3edabfaee43ed05f08">Jie Tang</a>
          </div>
        </div>
      </div>
    );
  }
}


export default connect(({expertMap, loading}) => ({expertMap, loading}))(ExpertMap);
