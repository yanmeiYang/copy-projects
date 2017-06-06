/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import { connect } from 'dva';
import Script from 'react-load-script';
import styles from './expert-map';

/**
 * Hi,邵洲你好。
 * 这里是一个在ReactJS中调用BaiduMap的例子。
 */
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
    console.log('initBaiduMap')
    // 百度地图API功能
    var map = new BMap.Map('allmap');
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    var geoc = new BMap.Geocoder();

    map.addEventListener("click", function (e) {
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

  }

  handleScriptError() {
    console.log('error');
  }

  render() {
    return (
      <div className={styles.expert_map}>
        <Script
          url="http://api.map.baidu.com/api?v=2.0&ak=你的秘钥&callback=initBaiduMap"
          onLoad={this.handleScriptLoad.bind(this)} onError={this.handleScriptError.bind(this)}
        />
        <div id="allmap" style={{ width: '100%', height: '500px' }} />

        <div className="em_report">
          统计/报表
        </div>
      </div>
    );
  }
}


export default connect(({ person, loading }) => ({ person, loading }))(ExpertMap);
