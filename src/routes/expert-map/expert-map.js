/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import Script from 'react-load-script';
import styles from './expert-map';

class ExpertMap extends React.Component {
  /** 构造函数： 这里执行初始化*/
  // constructor(props) {
  //   super(props);
  // }

  /** 在Component被加载的时候调用的。 */
  componentDidMount() {
    window.initBaiduMap = this.initBaiduMap;
  }

  /** 地图的代码 */
  initBaiduMap = function () {
    console.log('initBaiduMap');

    // 百度地图API功能
    const map = new BMap.Map('allmap');
    map.enableScrollWheelZoom()
    map.addControl(new BMap.NavigationControl())
    map.addControl(new BMap.ScaleControl())
    map.addControl(new BMap.OverviewMapControl())
    map.addControl(new BMap.MapTypeControl())
    const point = new BMap.Point(116.404, 39.915)
    map.centerAndZoom(point, 2)
    const marker = new BMap.Marker(point)
    map.addOverlay(marker)
    marker.setAnimation(BMAP_ANIMATION_BOUNCE)
    const geoc = new BMap.Geocoder();

    map.addEventListener('click', function (e) {
      var pt = e.point;
      geoc.getLocation(pt, function (rs) {
        console.log('rs is: ', rs)
        var addComp = rs.addressComponents;
        alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
      });
    });
  };

  handleScriptLoad() {
    console.log(this);
    console.log(this.refs.allmap, 'ref');
    // TODO 地图的代码应该放这里!!
    // TODO 你先使用假的json来实现前端的东西，稍后我会给你写一个新框架中调用API的例子。
    var place = require('../../../external-docs/expert-map/expert-map-example.json');
    //alert(place.results.length);

  }

  handleScriptError() {
    console.log('error');
  }

  render() {
    return (
      <div className={styles.expert_map}>
        <Script
          url="http://api.map.baidu.com/api?v=2.0&ak=Uz8Fjrx11twtkLHltGTwZOBz6FHlccVo&callback=initBaiduMap"
          onLoad={this.handleScriptLoad.bind(this)} onError={this.handleScriptError.bind(this)}
        />
        <div id="allmap" style={{ width: '100%', height: '500px' }} />

        <div className="em_report">
          统计/报表
          <br /><br /><br /><br /><br />
        </div>
      </div>
    );
  }
}


export default connect(({ person, loading }) => ({ person, loading }))(ExpertMap);
