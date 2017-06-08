/**
 *  Created by BoGao on 2017-06-07;
 */
import React from 'react';
import {connect} from 'dva';
import {Button} from 'antd';
import Script from 'react-load-script';
import styles from './expert-map';


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


  componentDidMount() {
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 4);
    map.enableScrollWheelZoom();

    var MAX = 10;
    var markers = [];
    var pt = null;
    var i = 0;
    for (; i < MAX; i++) {
      pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
      markers.push(new BMap.Marker(pt));
    }
    //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。

    var mapinterval=setInterval(function(){
      if (typeof(BMapLib) == "undefined"){
        console.log("wait for BMapLib")
      }else{
        clearInterval(mapinterval);
        var markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers});
      }
    },100);
    this.setState({tite: 'DONE'});
  }


  componentDidUpdate(prevProps, prevState) {

  }

  handleScriptLoad() {
    console.log(this);
    console.log(this.refs.allmap, 'ref');
    // TODO 地图的代码应该放这里!!
    // TODO 你先使用假的json来实现前端的东西，稍后我会给你写一个新框架中调用API的例子。
    var place = require('../../../external-docs/expert-map/expert-map-example1.json');
    alert(place.results.length);
  }

  handleScriptError() {
    console.log('error');
  }

  onLoadPersonCard = (e) => {
    const personId = e.target && e.target.getAttribute('data');
    this.props.dispatch({type: 'expertMap/getPersonInfo', payload: {personId}});

  }

  render() {
    const model = this.props && this.props.expertMap;
    const personInfo = model.personInfo;
    return (
      <div className={styles.expert_map}>

        <div id="allmap" style={{width: '100%', height: '500px'}}/>

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
        <div className="em_report">
          统计/报表
          <br /><br /><br /><br /><br />
        </div>
      </div>
    );
  }
}


export default connect(({expertMap, loading}) => ({expertMap, loading}))(ExpertMap);
